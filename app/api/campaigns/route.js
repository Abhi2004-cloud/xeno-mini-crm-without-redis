// app/api/campaigns/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Campaign from "@/models/Campaign";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

function buildQuery(rules, combinator) {
  const conditions = rules.map((r) => {
    let condition = {};
    if (r.field === "spend") {
      if (r.operator === ">") condition.totalSpend = { $gt: Number(r.value) };
      if (r.operator === "<") condition.totalSpend = { $lt: Number(r.value) };
      if (r.operator === "=") condition.totalSpend = Number(r.value);
    }
    if (r.field === "visits") {
      if (r.operator === ">") condition.visits = { $gt: Number(r.value) };
      if (r.operator === "<") condition.visits = { $lt: Number(r.value) };
      if (r.operator === "=") condition.visits = Number(r.value);
    }
    if (r.field === "inactiveDays") {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - Number(r.value));
      condition.lastActiveAt = { $lt: cutoff };
    }
    return condition;
  });

  if (conditions.length === 0) return {}; // no rules
  if (combinator === "AND") return { $and: conditions };
  return { $or: conditions };
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const body = await req.json();
    const { name, rules, combinator, messageTemplate } = body;
    if (!name || !rules) {
      return NextResponse.json(
        { ok: false, error: "Missing fields" },
        { status: 400 }
      );
    }

    const createdBy = session.user.email;

    const query = buildQuery(rules, combinator || "AND");
    const matchedCustomers = await Customer.find(query).lean();
    const audienceSize = matchedCustomers.length;

    const campaign = await Campaign.create({
      name,
      createdBy,
      rules,
      combinator,
      audienceSize,
      messageTemplate,
      status: "CREATED",
    });

    const logs = [];
    for (const cust of matchedCustomers) {
      const personalizedMessage = messageTemplate.replace(
        "{{name}}",
        cust.name || "Customer"
      );
      const vendorMessageId =
        "msg_" + Math.random().toString(36).substring(2, 10);

      logs.push({
        campaignId: campaign._id,
        customerEmail: cust.email,
        message: personalizedMessage,
        vendorMessageId,
        status: "PENDING",
      });
    }

    const CommunicationLog = (await import("@/models/CommunicationLog"))
      .default;
    const insertedLogs = await CommunicationLog.insertMany(logs);

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    insertedLogs.forEach((l) =>
      fetch(`${baseUrl}/api/vendor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          logId: l._id,
          vendorMessageId: l.vendorMessageId,
          customerEmail: l.customerEmail,
          message: l.message,
        }),
      }).catch((err) =>
        console.error("vendor call failed", l._id, err?.message || err)
      )
    );

    return NextResponse.json({
      ok: true,
      campaign: { ...campaign.toObject(), audienceSize },
    });
  } catch (e) {
    console.error("campaign create error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    await connectDB();
    const CommunicationLog = (await import("@/models/CommunicationLog"))
      .default;

    const campaigns = await Campaign.find({ createdBy: session.user.email })
      .sort({ createdAt: -1 })
      .lean();

    // Always return safe JSON, even if no campaigns exist
    if (!campaigns || campaigns.length === 0) {
      return NextResponse.json({ ok: true, campaigns: [] });
    }

    const campaignsWithStats = await Promise.all(
      campaigns.map(async (c) => {
        const sent = await CommunicationLog.countDocuments({
          campaignId: c._id,
          status: "SENT",
        });
        const failed = await CommunicationLog.countDocuments({
          campaignId: c._id,
          status: "FAILED",
        });
        const pending = await CommunicationLog.countDocuments({
          campaignId: c._id,
          status: "PENDING",
        });
        return { ...c, stats: { sent, failed, pending } };
      })
    );

    return NextResponse.json({ ok: true, campaigns: campaignsWithStats });
  } catch (e) {
    console.error("campaign GET error:", e);
    return NextResponse.json(
      { ok: false, error: e.message, campaigns: [] },
      { status: 500 }
    );
  }
}

// app/api/customers/preview/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
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
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { rules, combinator } = body;

    if (!rules) {
      return NextResponse.json({ ok: false, error: "Missing rules" }, { status: 400 });
    }

    const query = buildQuery(rules, combinator || "AND");
    const count = await Customer.countDocuments(query);

    console.log("PREVIEW: Query built:", JSON.stringify(query));
    console.log("PREVIEW: Found", count, "customers");

    return NextResponse.json({ ok: true, audienceSize: count });
  } catch (e) {
    console.error("preview error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

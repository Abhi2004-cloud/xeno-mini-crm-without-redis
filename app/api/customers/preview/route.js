// app/api/customers/preview/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { rules } = body;

    if (!rules) {
      return NextResponse.json({ ok: false, error: "Missing rules" }, { status: 400 });
    }

    let query = { createdBy: session.user.email };
    if (rules.spend) query.totalSpend = { $gt: rules.spend };
    if (rules.visits) query.visits = { $lt: rules.visits };
    if (rules.inactiveDays) {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - rules.inactiveDays);
      query.lastActiveAt = { $lt: cutoff };
    }

    const count = await Customer.countDocuments(query);

    return NextResponse.json({ ok: true, audienceSize: count });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

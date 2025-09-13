// app/api/logs/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CommunicationLog from "@/models/CommunicationLog";
import Campaign from "@/models/Campaign";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    // find campaigns created by this user
    const campaigns = await Campaign.find({ createdBy: session.user.email }, { _id: 1 }).lean();
    const campaignIds = campaigns.map((c) => c._id);

    // return logs belonging to those campaign ids
    const logs = await CommunicationLog.find({ campaignId: { $in: campaignIds } })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({ ok: true, logs });
  } catch (e) {
    console.error("logs GET error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

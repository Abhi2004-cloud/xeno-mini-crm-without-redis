// app/api/delivery-receipt/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CommunicationLog from "@/models/CommunicationLog";

export async function POST(req) {
  try {
    await connectDB();
    const payload = await req.json();
    const { vendorMessageId, status, logId } = payload;

    if (!vendorMessageId && !logId) {
      return NextResponse.json({ ok: false, error: "Missing vendorMessageId or logId" }, { status: 400 });
    }
    if (!status) {
      return NextResponse.json({ ok: false, error: "Missing status" }, { status: 400 });
    }

    console.log("DELIVERY-RECEIPT: updating", { vendorMessageId, logId, status });

    // Try update by vendorMessageId first; fallback to logId
    let log = null;
    if (vendorMessageId) {
      log = await CommunicationLog.findOneAndUpdate(
        { vendorMessageId },
        { status, vendorMeta: { lastUpdatedAt: new Date(), raw: payload } },
        { new: true }
      );
    }
    if (!log && logId) {
      log = await CommunicationLog.findOneAndUpdate(
        { _id: logId },
        { status, vendorMeta: { lastUpdatedAt: new Date(), raw: payload } },
        { new: true }
      );
    }

    if (!log) {
      // nothing matched
      console.warn("DELIVERY-RECEIPT: no log found for", { vendorMessageId, logId });
      return NextResponse.json({ ok: false, error: "No matching log found" }, { status: 404 });
    }

    console.log("DELIVERY-RECEIPT: updated log", log._id.toString(), "->", log.status);
    return NextResponse.json({ ok: true, log });
  } catch (e) {
    console.error("delivery-receipt error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}


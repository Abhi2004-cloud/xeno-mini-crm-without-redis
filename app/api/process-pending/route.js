// app/api/process-pending/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CommunicationLog from "@/models/CommunicationLog";

export async function POST(req) {
  try {
    await connectDB();
    
    // Find all pending logs that are older than 1 second (to simulate processing delay)
    const oneSecondAgo = new Date(Date.now() - 1000);
    const pendingLogs = await CommunicationLog.find({
      status: "PENDING",
      createdAt: { $lt: oneSecondAgo }
    }).limit(50); // Process up to 50 at a time

    if (pendingLogs.length === 0) {
      return NextResponse.json({ ok: true, processed: 0 });
    }

    let processed = 0;
    for (const log of pendingLogs) {
      // Simulate 90% success, 10% fail
      const status = Math.random() < 0.9 ? "SENT" : "FAILED";
      
      await CommunicationLog.findByIdAndUpdate(log._id, {
        status,
        vendorMeta: {
          lastUpdatedAt: new Date(),
          processedBy: "background-processor",
          simulatedVendorResponse: { status, timestamp: new Date() }
        }
      });
      
      processed++;
      console.log(`PROCESSOR: updated log ${log._id} -> ${status}`);
    }

    return NextResponse.json({ ok: true, processed });
  } catch (e) {
    console.error("process-pending error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// app/api/test-vendor/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CommunicationLog from "@/models/CommunicationLog";

export async function POST(req) {
  try {
    await connectDB();
    
    // Find all PENDING logs
    const pendingLogs = await CommunicationLog.find({ status: "PENDING" }).limit(10);
    
    console.log(`TEST-VENDOR: Found ${pendingLogs.length} pending logs`);
    
    if (pendingLogs.length === 0) {
      return NextResponse.json({ 
        ok: true, 
        message: "No pending logs found",
        updated: 0 
      });
    }

    let updated = 0;
    for (const log of pendingLogs) {
      // Simulate 90% success, 10% fail
      const status = Math.random() < 0.9 ? "SENT" : "FAILED";
      
      await CommunicationLog.findByIdAndUpdate(log._id, {
        status,
        vendorMeta: {
          lastUpdatedAt: new Date(),
          processedBy: "test-vendor-endpoint",
          testUpdate: true
        }
      });
      
      console.log(`TEST-VENDOR: Updated log ${log._id} -> ${status}`);
      updated++;
    }

    return NextResponse.json({ 
      ok: true, 
      message: `Updated ${updated} logs`,
      updated 
    });
  } catch (e) {
    console.error("test-vendor error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    
    // Get status counts
    const pending = await CommunicationLog.countDocuments({ status: "PENDING" });
    const sent = await CommunicationLog.countDocuments({ status: "SENT" });
    const failed = await CommunicationLog.countDocuments({ status: "FAILED" });
    
    return NextResponse.json({
      ok: true,
      counts: { pending, sent, failed },
      total: pending + sent + failed
    });
  } catch (e) {
    console.error("test-vendor GET error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

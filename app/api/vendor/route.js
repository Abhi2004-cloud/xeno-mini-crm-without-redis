// app/api/vendor/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import CommunicationLog from "@/models/CommunicationLog";

export async function POST(req) {
  try {
    const { vendorMessageId, customerEmail, message, logId } = await req.json();

    console.log("VENDOR: received send request", { vendorMessageId, customerEmail, logId });

    // Simulate 90% success, 10% fail
    const status = Math.random() < 0.9 ? "SENT" : "FAILED";

    // Instead of setTimeout (which doesn't work in serverless), 
    // immediately update the status after simulating processing
    await connectDB();
    
    // Simulate processing delay with a small random factor
    const processingDelay = 100 + Math.floor(Math.random() * 200); // 100-300ms
    await new Promise(resolve => setTimeout(resolve, processingDelay));

    // Update the communication log directly
    let log = null;
    if (vendorMessageId) {
      log = await CommunicationLog.findOneAndUpdate(
        { vendorMessageId },
        { 
          status, 
          vendorMeta: { 
            lastUpdatedAt: new Date(), 
            processingTime: processingDelay,
            simulatedVendorResponse: { status, timestamp: new Date() }
          } 
        },
        { new: true }
      );
    }
    if (!log && logId) {
      log = await CommunicationLog.findOneAndUpdate(
        { _id: logId },
        { 
          status, 
          vendorMeta: { 
            lastUpdatedAt: new Date(), 
            processingTime: processingDelay,
            simulatedVendorResponse: { status, timestamp: new Date() }
          } 
        },
        { new: true }
      );
    }

    if (log) {
      console.log("VENDOR: updated log", log._id.toString(), "->", log.status);
    } else {
      console.warn("VENDOR: no log found for", { vendorMessageId, logId });
    }

    return NextResponse.json({ ok: true, vendorMessageId, status });
  } catch (e) {
    console.error("vendor route error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}


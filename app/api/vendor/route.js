// app/api/vendor/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { vendorMessageId, customerEmail, message, logId } = await req.json();

    console.log("VENDOR: received send request", { vendorMessageId, customerEmail, logId });

    // Simulate 90% success, 10% fail
    const status = Math.random() < 0.9 ? "SENT" : "FAILED";

    // safe base URL fallback
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Simulate async callback to delivery receipt API after 700-1500ms
    setTimeout(async () => {
      try {
        console.log("VENDOR: calling delivery-receipt for", vendorMessageId, "status", status);
        await fetch(`${baseUrl}/api/delivery-receipt`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vendorMessageId, status, logId }),
        });
      } catch (err) {
        console.error("VENDOR: delivery-receipt callback failed", err);
      }
    }, 700 + Math.floor(Math.random() * 800));

    return NextResponse.json({ ok: true, vendorMessageId });
  } catch (e) {
    console.error("vendor route error:", e);
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}


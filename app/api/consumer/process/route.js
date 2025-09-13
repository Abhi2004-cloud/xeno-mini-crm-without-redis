// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import CommunicationLog from "@/models/CommunicationLog";
// import { consumeLogEvents } from "@/lib/queue";

// export async function POST() {
//   try {
//     await connectDB();

//     // pull up to 20 events
//     const events = await consumeLogEvents(20);

//     if (events.length === 0) {
//       return NextResponse.json({ ok: true, processed: 0 });
//     }

//     // insert into DB
//     const insertedLogs = await CommunicationLog.insertMany(
//       events.map((e) => ({ ...e, status: "PENDING" }))
//     );

//     // call vendor for each log
//     const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
//     for (const l of insertedLogs) {
//       await fetch(`${baseUrl}/api/vendor`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           logId: l._id,
//           vendorMessageId: l.vendorMessageId,
//           customerEmail: l.customerEmail,
//           message: l.message,
//         }),
//       });
//     }

//     return NextResponse.json({ ok: true, processed: insertedLogs.length });
//   } catch (e) {
//     console.error("consumer error", e);
//     return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
//   }
// }

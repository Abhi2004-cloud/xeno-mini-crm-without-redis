// app/api/customers/route.js
// import { NextResponse } from "next/server";
// import { z } from "zod";
// import { connectDB } from "@/lib/db";
// import Customer from "@/models/Customer";

// const CustomerSchema = z.object({
//   email: z.string().email(),
//   name: z.string().optional(),
//   phone: z.string().optional(),
//   totalSpend: z.number().optional(),
//   visits: z.number().optional(),
//   lastActiveAt: z.string().datetime().optional(), // ISO date
//   tags: z.array(z.string()).optional(),
// });

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();

//     const payload = Array.isArray(body) ? body : [body];
//     const data = payload.map((item) => CustomerSchema.parse(item));

//     // upsert by email
//     const ops = data.map((doc) => ({
//       updateOne: {
//         filter: { email: doc.email },
//         update: { $set: { ...doc, lastActiveAt: doc.lastActiveAt ? new Date(doc.lastActiveAt) : undefined } },
//         upsert: true,
//       },
//     }));

//     const result = await Customer.bulkWrite(ops, { ordered: false });
//     return NextResponse.json({ ok: true, result });
//   } catch (e) {
//     return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
//   }
// }


// app/api/customers/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/models/Customer";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// POST /api/customers → add new customer
export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body = await req.json();
    const { name, email, totalSpend, visits, lastActiveAt } = body;

    if (!name || !email) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    const customer = await Customer.create({
      name,
      email,
      totalSpend: totalSpend || 0,
      visits: visits || 0,
      lastActiveAt: lastActiveAt ? new Date(lastActiveAt) : new Date(),
      createdBy: session.user.email, // link to user
    });

    return NextResponse.json({ ok: true, customer });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

// GET /api/customers → list all user’s customers
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const customers = await Customer.find({ createdBy: session.user.email }).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, customers });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
  }
}

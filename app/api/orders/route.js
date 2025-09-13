// app/api/orders/route.js
import { NextResponse } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import Order from "@/models/Order";
import Customer from "@/models/Customer";

const OrderSchema = z.object({
  customerEmail: z.string().email(),
  amount: z.number().positive(),
  items: z.array(z.object({
    sku: z.string().optional(),
    name: z.string(),
    qty: z.number().int().positive(),
    price: z.number().positive(),
  })).optional(),
  placedAt: z.string().datetime().optional(),
});

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();
    const payload = Array.isArray(body) ? body : [body];

    const docs = payload.map((it) => {
      const parsed = OrderSchema.parse(it);
      return {
        ...parsed,
        placedAt: parsed.placedAt ? new Date(parsed.placedAt) : new Date(),
      };
    });

    const inserted = await Order.insertMany(docs, { ordered: false });

    // Update customer aggregates (simple version)
    for (const o of inserted) {
      await Customer.updateOne(
        { email: o.customerEmail },
        {
          $inc: { totalSpend: o.amount, visits: 1 },
          $set: { lastActiveAt: new Date(o.placedAt) },
        },
        { upsert: true }
      );
    }

    return NextResponse.json({ ok: true, inserted: inserted.length });
  } catch (e) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 });
  }
}

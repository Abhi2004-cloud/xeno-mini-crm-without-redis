import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    customerEmail: { type: String, required: true, index: true },
    amount: { type: Number, required: true },
    items: [{ sku: String, name: String, qty: Number, price: Number }],
    placedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);

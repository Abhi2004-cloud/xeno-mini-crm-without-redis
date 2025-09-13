// import mongoose from "mongoose";

// const CustomerSchema = new mongoose.Schema(
//   {
//     email: { type: String, required: true, index: true, unique: true },
//     name: String,
//     phone: String,
//     totalSpend: { type: Number, default: 0 },
//     visits: { type: Number, default: 0 },
//     lastActiveAt: { type: Date },
//     createdBy: { type: String, required: true },
//     tags: [String],
//   },
//   { timestamps: true }
// );

// export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);

// models/Customer.js
import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: false }, // allow same email for diff users
    totalSpend: { type: Number, default: 0 },
    visits: { type: Number, default: 0 },
    lastActiveAt: { type: Date, default: Date.now },
    createdBy: { type: String, required: true }, // user email
  },
  { timestamps: true }
);

export default mongoose.models.Customer || mongoose.model("Customer", CustomerSchema);


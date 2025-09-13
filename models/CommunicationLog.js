import mongoose from "mongoose";

const CommunicationLogSchema = new mongoose.Schema(
  {
    campaignId: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign", index: true },
    customerEmail: { type: String, required: true },
    message: String,
    vendorMessageId: String, // from dummy vendor
    status: { type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" },
    vendorMeta: { type: Object },
  },
  { timestamps: true }
);

export default mongoose.models.CommunicationLog ||
  mongoose.model("CommunicationLog", CommunicationLogSchema);

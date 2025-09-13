import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    createdBy: { type: String, required: true }, // user email
    rules: { type: Object, required: true },     // JSON rule tree
    audienceSize: { type: Number, default: 0 },
    messageTemplate: { type: String, default: "" },
    status: { type: String, default: "CREATED" }, // CREATED | SENDING | DONE
  },
  { timestamps: true }
);

export default mongoose.models.Campaign || mongoose.model("Campaign", CampaignSchema);

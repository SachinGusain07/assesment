import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Device name is required"],
      trim: true,
    },
    platform: {
      type: String,
      required: [true, "Platform is required"],
      enum: {
        values: ["android", "ios", "web"],
        message: "{VALUE} is not a supported platform. Use: android, ios, or web",
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

deviceSchema.index({ name: "text", platform: 1 });

export const Device = mongoose.model("Device", deviceSchema);
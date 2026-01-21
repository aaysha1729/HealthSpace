import mongoose from "mongoose";

const cycleEntrySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
      index: true,
    },
    flowIntensity: {
      type: String,
      enum: ["", "Light", "Medium", "Heavy", "None"],
      default: "",
    },
    sensations: [
      {
        type: String,
      },
    ],
    mood: {
      type: Number,
      min: 0,
      max: 4,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    isFlowDay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Compound index for user + date queries
cycleEntrySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.model("CycleEntry", cycleEntrySchema);

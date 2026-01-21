import mongoose from "mongoose";

const cycleSettingsSchema = new mongoose.Schema(
  {
    averageCycleLength: {
      type: Number,
      default: 28,
    },
    averagePeriodLength: {
      type: Number,
      default: 5,
    },
    lastPeriodStart: {
      type: Date,
      default: null,
    },
    // Track cycle history for predictions
    cycleHistory: [
      {
        startDate: Date,
        endDate: Date,
        length: Number,
      },
    ],
    // Custom sensations the user has added
    customSensations: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Calculate current cycle day
cycleSettingsSchema.methods.getCurrentCycleDay = function () {
  if (!this.lastPeriodStart) return null;

  const today = new Date();
  const lastStart = new Date(this.lastPeriodStart);
  const diffTime = Math.abs(today - lastStart);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (diffDays % this.averageCycleLength) + 1;
};

// Get current phase based on cycle day
cycleSettingsSchema.methods.getCurrentPhase = function () {
  const cycleDay = this.getCurrentCycleDay();
  if (!cycleDay) return "Unknown";

  if (cycleDay <= this.averagePeriodLength) return "Menstrual";
  if (cycleDay <= 13) return "Follicular";
  if (cycleDay <= 16) return "Ovulation";
  return "Luteal";
};

// Predict next period start
cycleSettingsSchema.methods.getNextPeriodStart = function () {
  if (!this.lastPeriodStart) return null;

  const nextStart = new Date(this.lastPeriodStart);
  nextStart.setDate(nextStart.getDate() + this.averageCycleLength);
  return nextStart;
};

const CycleSettings = mongoose.model("CycleSettings", cycleSettingsSchema);

export default CycleSettings;

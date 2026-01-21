import express from "express";
import CycleEntry from "../models/CycleEntry.js";
import User from "../models/User.js";
import { authenticate } from "../middleware/auth.js";
import {
  validate,
  cycleEntrySchema,
  cycleSettingsSchema,
} from "../validation/schemas.js";

const router = express.Router();

// Helper functions
const getCurrentCycleDay = (user) => {
  if (!user.cycleSettings.lastPeriodStart) return null;
  const today = new Date();
  const lastStart = new Date(user.cycleSettings.lastPeriodStart);
  const diffTime = Math.abs(today - lastStart);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays % user.cycleSettings.averageCycleLength) + 1;
};

const getCurrentPhase = (user) => {
  const cycleDay = getCurrentCycleDay(user);
  if (!cycleDay) return "Unknown";
  if (cycleDay <= user.cycleSettings.averagePeriodLength) return "Menstrual";
  if (cycleDay <= 13) return "Follicular";
  if (cycleDay <= 16) return "Ovulation";
  return "Luteal";
};

const getNextPeriodStart = (user) => {
  if (!user.cycleSettings.lastPeriodStart) return null;
  const nextStart = new Date(user.cycleSettings.lastPeriodStart);
  nextStart.setDate(
    nextStart.getDate() + user.cycleSettings.averageCycleLength,
  );
  return nextStart;
};

// GET /api/cycle/settings
router.get("/settings", authenticate, async (req, res) => {
  try {
    const cycleDay = getCurrentCycleDay(req.user);
    const phase = getCurrentPhase(req.user);

    res.json({
      ...req.user.cycleSettings.toObject(),
      currentCycleDay: cycleDay || 1,
      currentPhase: phase || "Follicular",
      nextPeriodStart: getNextPeriodStart(req.user),
      averageCycleLength: req.user.cycleSettings.averageCycleLength,
      averagePeriodLength: req.user.cycleSettings.averagePeriodLength,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    res.status(500).json({ message: "Error fetching settings" });
  }
});

// PUT /api/cycle/settings
router.put(
  "/settings",
  authenticate,
  validate(cycleSettingsSchema),
  async (req, res) => {
    try {
      const { averageCycleLength, averagePeriodLength, lastPeriodStart } =
        req.body;

      if (averageCycleLength)
        req.user.cycleSettings.averageCycleLength = averageCycleLength;
      if (averagePeriodLength)
        req.user.cycleSettings.averagePeriodLength = averagePeriodLength;
      if (lastPeriodStart)
        req.user.cycleSettings.lastPeriodStart = new Date(lastPeriodStart);

      await req.user.save();

      res.json({
        ...req.user.cycleSettings.toObject(),
        currentCycleDay: getCurrentCycleDay(req.user),
        currentPhase: getCurrentPhase(req.user),
      });
    } catch (error) {
      console.error("Update settings error:", error);
      res.status(500).json({ message: "Error updating settings" });
    }
  },
);

// POST /api/cycle/log
router.post(
  "/log",
  authenticate,
  validate(cycleEntrySchema),
  async (req, res) => {
    try {
      const { date, flowIntensity, sensations, mood, notes } = req.body;

      const entryDate = new Date(date || new Date());
      entryDate.setHours(0, 0, 0, 0);

      const isFlowDay =
        flowIntensity && flowIntensity !== "None" && flowIntensity !== "";

      // Upsert entry
      const entry = await CycleEntry.findOneAndUpdate(
        { userId: req.userId, date: entryDate },
        {
          userId: req.userId,
          date: entryDate,
          flowIntensity: flowIntensity || "",
          sensations: sensations || [],
          mood,
          notes: notes || "",
          isFlowDay,
        },
        { upsert: true, new: true },
      );

      // Update last period start if this is start of new period
      if (isFlowDay) {
        const yesterday = new Date(entryDate);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayEntry = await CycleEntry.findOne({
          userId: req.userId,
          date: yesterday,
          isFlowDay: true,
        });

        if (!yesterdayEntry) {
          req.user.cycleSettings.lastPeriodStart = entryDate;
          await req.user.save();
        }
      }

      res.json(entry);
    } catch (error) {
      console.error("Log entry error:", error);
      res.status(500).json({ message: "Error logging entry" });
    }
  },
);

// GET /api/cycle/entry/:date
router.get("/entry/:date", authenticate, async (req, res) => {
  try {
    const entryDate = new Date(req.params.date);
    entryDate.setHours(0, 0, 0, 0);

    const entry = await CycleEntry.findOne({
      userId: req.userId,
      date: entryDate,
    });

    res.json(
      entry || {
        date: entryDate,
        flowIntensity: "",
        sensations: [],
        mood: null,
      },
    );
  } catch (error) {
    console.error("Get entry error:", error);
    res.status(500).json({ message: "Error fetching entry" });
  }
});

// GET /api/cycle/month/:year/:month
router.get("/month/:year/:month", authenticate, async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await CycleEntry.find({
      userId: req.userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Calculate predicted and fertile days
    let predictedDays = [];
    let fertileDays = [];

    const { cycleSettings } = req.user;
    const cycleLength = cycleSettings.averageCycleLength || 28;
    const periodLength = cycleSettings.averagePeriodLength || 5;

    // Get or create a reference start date
    let refDate = cycleSettings.lastPeriodStart
      ? new Date(cycleSettings.lastPeriodStart)
      : new Date(new Date().setDate(new Date().getDate() - 12));

    // Calculate predicted period days for this month
    let cycleStart = new Date(refDate);

    // Move to the cycle that contains or precedes this month
    while (cycleStart < startDate) {
      cycleStart.setDate(cycleStart.getDate() + cycleLength);
    }
    // Go back one cycle if we went past the month
    if (cycleStart > endDate) {
      cycleStart.setDate(cycleStart.getDate() - cycleLength);
    }

    // Add predicted period days
    for (let i = 0; i < periodLength; i++) {
      const predictedDate = new Date(cycleStart);
      predictedDate.setDate(predictedDate.getDate() + i);
      if (predictedDate >= startDate && predictedDate <= endDate) {
        predictedDays.push(predictedDate.getDate());
      }
    }

    // Also check next cycle for predictions that fall in this month
    const nextCycleStart = new Date(cycleStart);
    nextCycleStart.setDate(nextCycleStart.getDate() + cycleLength);
    for (let i = 0; i < periodLength; i++) {
      const predictedDate = new Date(nextCycleStart);
      predictedDate.setDate(predictedDate.getDate() + i);
      if (predictedDate >= startDate && predictedDate <= endDate) {
        predictedDays.push(predictedDate.getDate());
      }
    }

    // Fertile window (ovulation day - 4 to ovulation day + 1)
    const ovulationDay = cycleLength - 14;
    const fertileStart = ovulationDay - 4;
    const fertileEnd = ovulationDay + 1;

    // Calculate fertile days for current cycle
    for (let day = fertileStart; day <= fertileEnd; day++) {
      const fertileDate = new Date(cycleStart);
      fertileDate.setDate(fertileDate.getDate() + day);
      if (fertileDate >= startDate && fertileDate <= endDate) {
        fertileDays.push(fertileDate.getDate());
      }
    }

    // Also check previous cycle's fertile window
    const prevCycleStart = new Date(cycleStart);
    prevCycleStart.setDate(prevCycleStart.getDate() - cycleLength);
    for (let day = fertileStart; day <= fertileEnd; day++) {
      const fertileDate = new Date(prevCycleStart);
      fertileDate.setDate(fertileDate.getDate() + day);
      if (fertileDate >= startDate && fertileDate <= endDate) {
        fertileDays.push(fertileDate.getDate());
      }
    }

    res.json({ entries, predictedDays, fertileDays });
  } catch (error) {
    console.error("Get month error:", error);
    res.status(500).json({ message: "Error fetching month data" });
  }
});

// DELETE /api/cycle/entry/:date
router.delete("/entry/:date", authenticate, async (req, res) => {
  try {
    const entryDate = new Date(req.params.date);
    entryDate.setHours(0, 0, 0, 0);

    await CycleEntry.findOneAndDelete({
      userId: req.userId,
      date: entryDate,
    });

    res.json({ message: "Entry deleted" });
  } catch (error) {
    console.error("Delete entry error:", error);
    res.status(500).json({ message: "Error deleting entry" });
  }
});

export default router;

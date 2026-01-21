import CycleEntry from "../models/CycleEntry.js";
import CycleSettings from "../models/CycleSettings.js";
import { getPredictedPeriodWindow, getFertileWindowDays } from "../utils/cycleCalculations.js";

// Get or create settings
export const getSettings = async (req, res) => {
  try {
    let settings = await CycleSettings.findOne();

    if (!settings) {
      // Create default settings
      settings = await CycleSettings.create({
        averageCycleLength: 28,
        averagePeriodLength: 5,
        lastPeriodStart: new Date(),
        customSensations: [],
      });
    }

    const cycleDay = settings.getCurrentCycleDay();
    const phase = settings.getCurrentPhase();
    const nextPeriod = settings.getNextPeriodStart();

    res.json({
      ...settings.toObject(),
      currentCycleDay: cycleDay,
      currentPhase: phase,
      nextPeriodStart: nextPeriod,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update settings
export const updateSettings = async (req, res) => {
  try {
    const {
      averageCycleLength,
      averagePeriodLength,
      lastPeriodStart,
      customSensations,
    } = req.body;

    let settings = await CycleSettings.findOne();

    if (!settings) {
      settings = new CycleSettings();
    }

    if (averageCycleLength) settings.averageCycleLength = averageCycleLength;
    if (averagePeriodLength) settings.averagePeriodLength = averagePeriodLength;
    if (lastPeriodStart) settings.lastPeriodStart = new Date(lastPeriodStart);
    if (customSensations) settings.customSensations = customSensations;

    await settings.save();

    const cycleDay = settings.getCurrentCycleDay();
    const phase = settings.getCurrentPhase();

    res.json({
      ...settings.toObject(),
      currentCycleDay: cycleDay,
      currentPhase: phase,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Log a new entry for today
export const logEntry = async (req, res) => {
  try {
    const { date, flowIntensity, sensations, mood, notes } = req.body;

    const entryDate = date ? new Date(date) : new Date();
    entryDate.setHours(0, 0, 0, 0);

    // Check if entry exists for this date
    let entry = await CycleEntry.findOne({
      date: {
        $gte: entryDate,
        $lt: new Date(entryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    if (entry) {
      // Update existing entry
      if (flowIntensity !== undefined) entry.flowIntensity = flowIntensity;
      if (sensations !== undefined) entry.sensations = sensations;
      if (mood !== undefined) entry.mood = mood;
      if (notes !== undefined) entry.notes = notes;
      entry.isFlowDay = flowIntensity && flowIntensity !== "None";
      await entry.save();
    } else {
      // Create new entry
      entry = await CycleEntry.create({
        date: entryDate,
        flowIntensity: flowIntensity || "",
        sensations: sensations || [],
        mood: mood,
        notes: notes || "",
        isFlowDay: flowIntensity && flowIntensity !== "None",
      });
    }

    // Update last period start if this is a flow day and it's before the current last period
    if (entry.isFlowDay) {
      const settings = await CycleSettings.findOne();
      if (
        settings &&
        (!settings.lastPeriodStart || entryDate > settings.lastPeriodStart)
      ) {
        // Check if this is a new period (not consecutive days)
        const yesterday = new Date(entryDate);
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayEntry = await CycleEntry.findOne({
          date: {
            $gte: yesterday,
            $lt: entryDate,
          },
          isFlowDay: true,
        });

        if (!yesterdayEntry) {
          // This is the start of a new period
          settings.lastPeriodStart = entryDate;
          await settings.save();
        }
      }
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get entry for a specific date
export const getEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    const entry = await CycleEntry.findOne({
      date: {
        $gte: entryDate,
        $lt: new Date(entryDate.getTime() + 24 * 60 * 60 * 1000),
      },
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
    res.status(500).json({ message: error.message });
  }
};

// Get entries for a month
export const getMonthEntries = async (req, res) => {
  try {
    const { year, month } = req.params;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const entries = await CycleEntry.find({
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    // Get settings for predictions
    const settings = await CycleSettings.findOne();

    // Calculate predicted and fertile days
    let predictedDays = [];
    let predictedWindowDays = [];
    let fertileDays = [];

    if (settings && settings.lastPeriodStart) {
      const cycleLength = settings.averageCycleLength;
      const periodLength = settings.averagePeriodLength;

      // Get predicted period window
      const { predictedDays: predicted, windowDays: window } = getPredictedPeriodWindow(
        settings.lastPeriodStart,
        cycleLength,
        periodLength
      );

      // Filter predicted days for this month
      predictedDays = predicted
        .filter(date => date >= startDate && date <= endDate)
        .map(date => date.getDate());

      // Filter window days for this month
      predictedWindowDays = window
        .filter(date => date >= startDate && date <= endDate)
        .map(date => date.getDate());

      // Calculate fertile window
      let cycleStart = new Date(settings.lastPeriodStart);
      while (cycleStart <= startDate) {
        cycleStart.setDate(cycleStart.getDate() + cycleLength);
      }
      cycleStart.setDate(cycleStart.getDate() - cycleLength);

      const fertile = getFertileWindowDays(cycleStart, cycleLength);
      fertileDays = fertile
        .filter(date => date >= startDate && date <= endDate)
        .map(date => date.getDate());
    }

    res.json({
      entries,
      predictedDays,
      predictedWindowDays,
      fertileDays,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
  try {
    const { date } = req.params;
    const entryDate = new Date(date);
    entryDate.setHours(0, 0, 0, 0);

    await CycleEntry.deleteOne({
      date: {
        $gte: entryDate,
        $lt: new Date(entryDate.getTime() + 24 * 60 * 60 * 1000),
      },
    });

    res.json({ message: "Entry deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

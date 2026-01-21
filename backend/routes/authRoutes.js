import express from "express";
import User from "../models/User.js";
import { generateToken } from "../config/jwt.js";
import { authenticate } from "../middleware/auth.js";
import { validate, signupSchema, loginSchema } from "../validation/schemas.js";

const router = express.Router();

// POST /api/auth/signup
router.post("/signup", validate(signupSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Create user with default last period start (12 days ago)
    const defaultLastPeriod = new Date();
    defaultLastPeriod.setDate(defaultLastPeriod.getDate() - 12);

    const user = await User.create({
      email,
      password,
      cycleSettings: {
        lastPeriodStart: defaultLastPeriod,
        averageCycleLength: 28,
        averagePeriodLength: 5,
      },
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      user: {
        id: user._id,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
      },
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error creating account" });
  }
});

// POST /api/auth/login
router.post("/login", validate(loginSchema), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      user: {
        id: user._id,
        email: user.email,
        onboardingComplete: user.onboardingComplete,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in" });
  }
});

// GET /api/auth/me
router.get("/me", authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      onboardingComplete: req.user.onboardingComplete,
      settings: req.user.settings,
      cycleSettings: req.user.cycleSettings,
    },
  });
});

// POST /api/auth/logout
router.post("/logout", (req, res) => {
  // JWT is stateless, logout is handled client-side
  res.json({ message: "Logged out successfully" });
});

// PUT /api/auth/complete-onboarding
router.put("/complete-onboarding", authenticate, async (req, res) => {
  try {
    const { focus, cycleLength, periodLength, lastPeriodStart } = req.body;

    req.user.onboardingComplete = true;
    if (focus) req.user.settings.focus = focus;
    if (cycleLength) req.user.cycleSettings.averageCycleLength = cycleLength;
    if (periodLength) req.user.cycleSettings.averagePeriodLength = periodLength;
    if (lastPeriodStart)
      req.user.cycleSettings.lastPeriodStart = new Date(lastPeriodStart);

    await req.user.save();

    res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        onboardingComplete: req.user.onboardingComplete,
      },
    });
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Error completing onboarding" });
  }
});

export default router;

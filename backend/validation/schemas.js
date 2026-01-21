import { z } from "zod";

// Auth schemas
export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

// Cycle schemas
export const cycleEntrySchema = z.object({
  date: z.string().or(z.date()),
  flowIntensity: z.enum(["", "Light", "Medium", "Heavy", "None"]).optional(),
  sensations: z.array(z.string()).optional(),
  mood: z.number().min(0).max(4).nullable().optional(),
  notes: z.string().max(1000).optional(),
});

export const cycleSettingsSchema = z.object({
  averageCycleLength: z.number().min(21).max(45).optional(),
  averagePeriodLength: z.number().min(1).max(10).optional(),
  lastPeriodStart: z.string().or(z.date()).nullable().optional(),
});

// Community schemas
export const postSchema = z.object({
  title: z.string().min(5, "Title too short").max(200, "Title too long"),
  content: z
    .string()
    .min(10, "Content too short")
    .max(5000, "Content too long"),
  category: z
    .enum([
      "IRREGULAR CYCLES",
      "PCOS SUPPORT",
      "MEDICATION",
      "GENERAL",
      "QUESTIONS",
    ])
    .optional(),
});

export const replySchema = z.object({
  content: z
    .string()
    .min(1, "Reply cannot be empty")
    .max(2000, "Reply too long"),
});

// Validation middleware factory
export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: "Validation error",
        errors: error.errors.map((e) => ({
          field: e.path.join("."),
          message: e.message,
        })),
      });
    }
    next(error);
  }
};

import express from "express";
import cors from "cors";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import securityConfig from "./config/security.js";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/authRoutes.js";
import cycleRoutes from "./routes/cycleRoutes.js";
import communityRoutes from "./routes/communityRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ==================== SECURITY MIDDLEWARE ====================

// Set security HTTP headers
app.use(helmet(securityConfig.helmet));

// CORS
app.use(
  cors({
    origin: securityConfig.cors.origins,
    credentials: securityConfig.cors.credentials,
    methods: securityConfig.cors.methods,
    allowedHeaders: securityConfig.cors.allowedHeaders,
  }),
);

// Body parser with size limits
app.use(express.json({ limit: "10kb" })); // Body limit
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// Apply general rate limiting to all API routes
app.use("/api", apiLimiter);

// ==================== ROUTES ====================

// Auth routes with stricter rate limiting
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/cycle", cycleRoutes);
app.use("/api/community", communityRoutes);

// Health check (no rate limit)
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "HealthSpace API is running",
    database: "MongoDB",
    security: "enabled",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ==================== ERROR HANDLING ====================

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);

  // Don't leak error details in production
  const isDev = process.env.NODE_ENV === "development";

  res.status(err.status || 500).json({
    message: err.message || "Internal server error",
    ...(isDev && { stack: err.stack }),
  });
});

// ==================== SERVER STARTUP ====================

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔒 Security middleware enabled`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import goalRoutes from "./routes/goalRoutes.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { arcjetMiddleware } from "./middleware/arcjet.js";
import { ENV } from "./config/env.js";

const app = express();

// Enable Helmet with cross-origin resource policy for Cloudinary images & API responses
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Dynamic CORS configuration allowing CLIENT_URL, localhost, and Vercel domains
const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        return callback(null, true);
      }
      // Allow all Vercel deployment preview and production origins
      if (origin && (origin.endsWith(".vercel.app") || origin.includes("vercel.app"))) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

if (ENV.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use("/api", arcjetMiddleware);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Fitness Tracker API",
    version: "1.0.0",
    clientUrl: ENV.CLIENT_URL,
    endpoints: {
      auth: "/api/auth",
      exercises: "/api/exercises",
      workouts: "/api/workouts",
      goals: "/api/goals",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/exercises", exerciseRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/goals", goalRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = ENV.PORT;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log("Fitness Tracker API");
      console.log(`Server: http://localhost:${PORT}`);
      console.log(`Configured CLIENT_URL: ${ENV.CLIENT_URL}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

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

app.use(helmet());
app.use(cors());

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
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();

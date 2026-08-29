import express from "express";
import {
  createWorkout,
  getMyWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  getWorkoutStats,
  getPersonalRecords,
  getStreak,
  getWorkoutCalendar,
} from "../controllers/workoutController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/stats/advanced", getWorkoutStats);

router.get("/personal-records", getPersonalRecords);

router.get("/streak", getStreak);

router.get("/calendar", getWorkoutCalendar);

router.route("/").get(getMyWorkouts).post(createWorkout);

router.route("/:id").get(getWorkout).put(updateWorkout).delete(deleteWorkout);

export default router;

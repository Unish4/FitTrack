import express from "express";
import {
  createGoal,
  getGoals,
  getGoal,
  updateGoal,
  updateProgress,
  deleteGoal,
  abandonGoal,
  getGoalStats,
  getCompletedGoals,
} from "../controllers/goalController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/stats/summary", getGoalStats);

router.get("/completed", getCompletedGoals);

router.route("/").get(getGoals).post(createGoal);

router.route("/:id").get(getGoal).put(updateGoal).delete(deleteGoal);

router.patch("/:id/progress", updateProgress);

router.patch("/:id/abandon", abandonGoal);

export default router;

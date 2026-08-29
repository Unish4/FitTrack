import express from "express";
import {
  getExercises,
  getExercise,
  createExercise,
  updateExercise,
  deleteExercise,
  uploadExerciseImage,
  getExerciseCategories,
  getExercisesByMuscleGroup,
  searchExercises,
  getPopularExercises,
} from "../controllers/exerciseController.js";
import { protect, authorize } from "../middleware/auth.js";
import upload from "../config/multer.js";

const router = express.Router();

router.get("/", getExercises);

router.get("/categories/list", getExerciseCategories);

router.get("/search", searchExercises);

router.get("/popular", getPopularExercises);

router.get("/muscle/:muscleGroup", getExercisesByMuscleGroup);

router.get("/:id", getExercise);

router.post("/", protect, authorize("admin"), createExercise);

router.put("/:id", protect, authorize("admin"), updateExercise);

router.delete("/:id", protect, authorize("admin"), deleteExercise);

router.post(
  "/:id/image",
  protect,
  authorize("admin"),
  upload.single("image"),
  uploadExerciseImage,
);

export default router;

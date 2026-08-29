import mongoose from "mongoose";
import Workout from "../models/Workout.js";
import User from "../models/User.js";
import Exercise from "../models/Exercise.js";
import APIFeatures from "../utils/apiFeatures.js";
import {
  successResponse,
  errorResponse,
  paginatedResponse,
} from "../utils/response.js";
import {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} from "../utils/AppError.js";

export const createWorkout = async (req, res) => {
  try {
    const {
      name,
      date,
      duration,
      type,
      exercises,
      caloriesBurned,
      mood,
      intensity,
      notes,
    } = req.body;

    if (!name || !exercises || exercises.length === 0) {
      return errorResponse(
        res,
        new BadRequestError(
          "Please provide workout name and at least one exercise",
        ),
      );
    }

    // Check that each exercise has valid data
    for (let i = 0; i < exercises.length; i++) {
      if (
        !exercises[i].exercise ||
        !exercises[i].sets ||
        exercises[i].sets.length === 0
      ) {
        return errorResponse(
          res,
          new BadRequestError(
            `Exercise at index ${i} must have an exercise ID and at least one set`,
          ),
        );
      }
    }

    const enrichedExercises = [];

    for (let i = 0; i < exercises.length; i++) {
      const exerciseDoc = await Exercise.findById(exercises[i].exercise);

      if (!exerciseDoc) {
        return errorResponse(
          res,
          new NotFoundError(
            `Exercise with ID ${exercises[i].exercise} not found`,
          ),
        );
      }

      enrichedExercises.push({
        ...exercises[i],
        name: exerciseDoc.name, // Add exercise name as snapshot
      });
    }

    //  CREATE WORKOUT
    const workout = await Workout.create({
      user: req.user.id,
      name,
      date: date || new Date(),
      duration,
      type,
      exercises: enrichedExercises,
      caloriesBurned,
      mood,
      intensity,
      notes,
    });

    // Increment total workout count
    await User.findByIdAndUpdate(req.user.id, { $inc: { totalWorkouts: 1 } });

    await updateStreak(req.user.id);

    await checkAchievements(req.user.id);

    return successResponse(res, workout, "Workout logged successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    return errorResponse(res, error);
  }
};

export const getMyWorkouts = async (req, res) => {
  try {
    // Users can only see THEIR workouts
    const filteredQuery = new APIFeatures(
      Workout.find({ user: req.user.id }),
      req.query,
    )
      .filter() // Filter by type, date, mood
      .search(["name", "type", "mood"]).query;

    const total = await filteredQuery.clone().countDocuments();

    const features = new APIFeatures(filteredQuery, req.query)
      .sort() // Sort by date, duration
      .limitFields() // Select fields
      .paginate(10); // 10 per page

    const workouts = await features.query;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    return paginatedResponse(res, workouts, page, limit, total);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id).populate(
      "exercises.exercise",
      "name category muscleGroup",
    );

    if (!workout) {
      return errorResponse(res, new NotFoundError("Workout not found"));
    }

    if (
      workout.user.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        res,
        new ForbiddenError("You can only view your own workouts"),
      );
    }

    return successResponse(res, workout, "Workout fetched successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid workout ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return errorResponse(res, new NotFoundError("Workout not found"));
    }

    if (workout.user.toString() !== req.user.id.toString()) {
      return errorResponse(
        res,
        new ForbiddenError("You can only update your own workouts"),
      );
    }

    // Don't allow changing user
    const { user, ...updateData } = req.body;

    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    return successResponse(res, updatedWorkout, "Workout updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid workout ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return errorResponse(res, new NotFoundError("Workout not found"));
    }

    if (
      workout.user.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        res,
        new ForbiddenError("You can only delete your own workouts"),
      );
    }

    await Workout.findByIdAndDelete(req.params.id);

    await User.findByIdAndUpdate(workout.user, { $inc: { totalWorkouts: -1 } });

    return successResponse(res, null, "Workout deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid workout ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const getWorkoutStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    const totalStats = await Workout.aggregate([
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$caloriesBurned" },
          avgDuration: { $avg: "$duration" },
          avgCalories: { $avg: "$caloriesBurned" },
        },
      },
    ]);

    //  WORKOUTS BY TYPE
    const workoutsByType = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
    ]);

    //  WORKOUTS BY MOOD
    const workoutsByMood = await Workout.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$mood",
          count: { $sum: 1 },
        },
      },
    ]);

    //  LAST 30 DAYS TREND
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyTrend = await Workout.aggregate([
      {
        $match: {
          user: userId,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            day: { $dayOfMonth: "$date" },
          },
          workoutCount: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    //  MOST EXERCISED MUSCLE GROUPS
    const muscleGroupStats = await Workout.aggregate([
      { $match: { user: userId } },
      { $unwind: "$exercises" },
      {
        $lookup: {
          from: "exercises",
          localField: "exercises.exercise",
          foreignField: "_id",
          as: "exerciseInfo",
        },
      },
      { $unwind: "$exerciseInfo" },
      {
        $group: {
          _id: "$exerciseInfo.muscleGroup",
          totalSets: { $sum: { $size: "$exercises.sets" } },
          exerciseCount: { $sum: 1 },
        },
      },
      { $sort: { totalSets: -1 } },
    ]);

    //  TOTAL VOLUME (Sets × Reps × Weight)
    const volumeStats = await Workout.aggregate([
      { $match: { user: userId } },
      { $unwind: "$exercises" },
      { $unwind: "$exercises.sets" },
      {
        $group: {
          _id: null,
          totalVolume: {
            $sum: {
              $multiply: ["$exercises.sets.reps", "$exercises.sets.weight"],
            },
          },
          maxWeight: { $max: "$exercises.sets.weight" },
        },
      },
    ]);

    return successResponse(
      res,
      {
        totals: totalStats[0] || {
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          avgDuration: 0,
          avgCalories: 0,
        },
        byType: workoutsByType,
        byMood: workoutsByMood,
        dailyTrend,
        muscleGroups: muscleGroupStats,
        volume: volumeStats[0] || { totalVolume: 0, maxWeight: 0 },
      },
      "Workout statistics fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getPersonalRecords = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    //  FIND MAX WEIGHT PER EXERCISE
    const personalRecords = await Workout.aggregate([
      { $match: { user: userId } },
      { $unwind: "$exercises" },
      { $unwind: "$exercises.sets" },
      {
        $group: {
          _id: "$exercises.name", // Group by exercise name
          maxWeight: { $max: "$exercises.sets.weight" },
          maxReps: { $max: "$exercises.sets.reps" },
          achievedAt: { $max: "$date" },
        },
      },
      { $sort: { maxWeight: -1 } },
    ]);

    return successResponse(res, personalRecords, "Personal records fetched");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getStreak = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    //  GET RECENT WORKOUT DATES
    const recentWorkouts = await Workout.find({ user: req.user.id })
      .select("date")
      .sort({ date: -1 })
      .limit(30);

    return successResponse(
      res,
      {
        currentStreak: user.streak,
        totalWorkouts: user.totalWorkouts,
        recentWorkoutDates: recentWorkouts.map((w) => w.date),
      },
      "Streak information fetched",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getWorkoutCalendar = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Default to current month
    const now = new Date();
    const targetMonth = parseInt(month) || now.getMonth() + 1; // 1-12
    const targetYear = parseInt(year) || now.getFullYear();

    //  CALCULATE MONTH RANGE
    const startDate = new Date(targetYear, targetMonth - 1, 1);
    const nextMonthStart = new Date(targetYear, targetMonth, 1);
    const lastDayOfMonth = new Date(targetYear, targetMonth, 0);

    //  FIND WORKOUTS IN MONTH
    const workouts = await Workout.find({
      user: req.user.id,
      date: { $gte: startDate, $lt: nextMonthStart },
    })
      .select("date duration type caloriesBurned name")
      .sort("date");

    //  GROUP BY DAY
    const calendarData = workouts.map((w) => ({
      date: w.date,
      name: w.name,
      duration: w.duration,
      type: w.type,
      caloriesBurned: w.caloriesBurned,
    }));

    //  CALCULATE MONTH STATS
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce(
      (sum, w) => sum + (w.duration || 0),
      0,
    );
    const totalCalories = workouts.reduce(
      (sum, w) => sum + (w.caloriesBurned || 0),
      0,
    );
    const activeDays = new Set(workouts.map((w) => w.date.toDateString())).size;

    return successResponse(
      res,
      {
        month: targetMonth,
        year: targetYear,
        workouts: calendarData,
        stats: {
          totalWorkouts,
          totalDuration,
          totalCalories,
          activeDays,
          daysInMonth: lastDayOfMonth.getDate(),
        },
      },
      "Calendar fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

async function updateStreak(userId) {
  try {
    const user = await User.findById(userId);

    // Get recent workouts sorted by date
    const workouts = await Workout.find({ user: userId })
      .select("date")
      .sort({ date: -1 })
      .limit(365); // Max 1 year of streak

    if (workouts.length === 0) {
      user.streak = 0;
      await user.save();
      return;
    }

    // Calculate streak
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastWorkoutDate = new Date(workouts[0].date);
    lastWorkoutDate.setHours(0, 0, 0, 0);

    // If last workout is not today or yesterday, streak is 0
    const diffDays = Math.floor(
      (today - lastWorkoutDate) / (1000 * 60 * 60 * 24),
    );

    if (diffDays > 1) {
      streak = 0;
    } else {
      // Count consecutive days
      for (let i = 1; i < workouts.length; i++) {
        const currentDate = new Date(workouts[i].date);
        currentDate.setHours(0, 0, 0, 0);

        const prevDate = new Date(workouts[i - 1].date);
        const uniqueDays = [
          ...new Set(
            workouts.map((w) => {
              const d = new Date(w.date);
              d.setHours(0, 0, 0, 0);
              return d.getTime();
            }),
          ),
        ].sort((a, b) => b - a);

        let streak = 1;
        const lastWorkoutDate = new Date(uniqueDays[0]);

        const diffDays = Math.floor(
          (today - lastWorkoutDate) / (1000 * 60 * 60 * 24),
        );

        if (diffDays > 1) {
          streak = 0;
        } else {
          for (let i = 1; i < uniqueDays.length; i++) {
            const dayDiff = Math.round(
              (uniqueDays[i - 1] - uniqueDays[i]) / (1000 * 60 * 60 * 24),
            );

            if (dayDiff === 1) {
              streak++;
            } else {
              break;
            }
          }
        }
        if (dayDiff <= 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    user.streak = streak;
    await user.save();
  } catch (error) {
    console.error("Error updating streak:", error);
  }
}

async function checkAchievements(userId) {
  try {
    const user = await User.findById(userId);

    if (!user) return;

    const existingAchievements = user.achievements.map((a) => a.name);
    const newAchievements = [];

    //  ACHIEVEMENT DEFINITIONS
    const achievementDefinitions = [
      {
        name: "First Workout",
        condition: user.totalWorkouts >= 1,
        description: "Log your first workout",
      },
      {
        name: "10 Workouts",
        condition: user.totalWorkouts >= 10,
        description: "Complete 10 workouts",
      },
      {
        name: "50 Workouts",
        condition: user.totalWorkouts >= 50,
        description: "Complete 50 workouts",
      },
      {
        name: "100 Workouts",
        condition: user.totalWorkouts >= 100,
        description: "Complete 100 workouts",
      },
      {
        name: "7-Day Streak",
        condition: user.streak >= 7,
        description: "Workout 7 days in a row",
      },
      {
        name: "30-Day Streak",
        condition: user.streak >= 30,
        description: "Workout 30 days in a row",
      },
    ];

    // Check which achievements user has earned
    for (const achievement of achievementDefinitions) {
      if (
        achievement.condition &&
        !existingAchievements.includes(achievement.name)
      ) {
        newAchievements.push({
          name: achievement.name,
          description: achievement.description,
          earnedAt: new Date(),
        });
      }
    }

    // Save new achievements
    if (newAchievements.length > 0) {
      user.achievements.push(...newAchievements);
      await user.save();
      console.log(
        `🏆 ${newAchievements.length} new achievements for ${user.name}!`,
      );
    }
  } catch (error) {
    console.error("Error checking achievements:", error);
  }
}

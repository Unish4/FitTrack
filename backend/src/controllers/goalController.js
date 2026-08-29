import Goal from "../models/Goal.js";
import User from "../models/User.js";
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

export const createGoal = async (req, res) => {
  try {
    const {
      type,
      title,
      targetValue,
      currentValue,
      unit,
      startDate,
      targetDate,
      notes,
    } = req.body;

    if (!type || !title || !targetValue) {
      return errorResponse(
        res,
        new BadRequestError(
          "Please provide goal type, title, and target value",
        ),
      );
    }

    const goal = await Goal.create({
      user: req.user.id,
      type,
      title,
      targetValue,
      currentValue: currentValue || 0,
      unit: unit || "",
      startDate: startDate || new Date(),
      targetDate,
      notes,
    });

    return successResponse(res, goal, "Goal created successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    return errorResponse(res, error);
  }
};

export const getGoals = async (req, res) => {
  try {
    // Users see only their own goals
    const features = new APIFeatures(
      Goal.find({ user: req.user.id }),
      req.query,
    )
      .filter() // Filter by type, status
      .sort() // Sort by targetDate
      .limitFields() // Select fields
      .paginate(10);

    const goals = await features.query;

    // Get total count
    // Get total count for the same filter conditions
    const total = await Goal.countDocuments(features.query.getFilter());

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    return paginatedResponse(res, goals, page, limit, total);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return errorResponse(res, new NotFoundError("Goal not found"));
    }

    if (
      goal.user.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        res,
        new ForbiddenError("You can only view your own goals"),
      );
    }

    const progressPercentage = goal.progressPercentage; // From virtual
    const remaining = goal.targetValue - goal.currentValue;

    return successResponse(
      res,
      {
        ...goal.toObject(),
        remaining,
        isAchieved: goal.currentValue >= goal.targetValue,
      },
      "Goal fetched successfully",
    );
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, new BadRequestError("Invalid goal ID format"));
    }

    return errorResponse(res, error);
  }
};

export const updateGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return errorResponse(res, new NotFoundError("Goal not found"));
    }

    if (goal.user.toString() !== req.user.id.toString()) {
      return errorResponse(
        res,
        new ForbiddenError("You can only update your own goals"),
      );
    }

    // Don't allow changing user
    const { user, ...updateData } = req.body;

    const updatedGoal = await Goal.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (updatedGoal.currentValue >= updatedGoal.targetValue) {
      updatedGoal.status = "completed";
      await updatedGoal.save();
    }

    return successResponse(res, updatedGoal, "Goal updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    if (error.name === "CastError") {
      return errorResponse(res, new BadRequestError("Invalid goal ID format"));
    }

    return errorResponse(res, error);
  }
};

export const updateProgress = async (req, res) => {
  try {
    const { currentValue, incrementBy } = req.body;

    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return errorResponse(res, new NotFoundError("Goal not found"));
    }

    if (goal.user.toString() !== req.user.id.toString()) {
      return errorResponse(
        res,
        new ForbiddenError("You can only update your own goals"),
      );
    }

    if (goal.status !== "active") {
      return errorResponse(
        res,
        new BadRequestError(`Cannot update progress for ${goal.status} goal`),
      );
    }

    if (incrementBy !== undefined) {
      if (typeof incrementBy !== "number" || !Number.isFinite(incrementBy)) {
        return errorResponse(
          res,
          new BadRequestError("incrementBy must be a finite number"),
        );
      }
      // Increment by amount: currentValue + incrementBy
      goal.currentValue += incrementBy;
    } else if (currentValue !== undefined) {
      if (typeof currentValue !== "number" || !Number.isFinite(currentValue)) {
        return errorResponse(
          res,
          new BadRequestError("currentValue must be a finite number"),
        );
      }
      // Set to specific value
      goal.currentValue = currentValue;
    } else {
      return errorResponse(
        res,
        new BadRequestError("Please provide currentValue or incrementBy"),
      );
    }

    if (goal.currentValue >= goal.targetValue) {
      goal.status = "completed";
      goal.currentValue = goal.targetValue; // Don't exceed target
    }

    await goal.save();

    return successResponse(
      res,
      {
        ...goal.toObject(),
        isAchieved: goal.status === "completed",
      },
      goal.status === "completed"
        ? "🎉 Goal achieved! Congratulations!"
        : "Progress updated",
    );
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, new BadRequestError("Invalid goal ID format"));
    }

    return errorResponse(res, error);
  }
};

export const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return errorResponse(res, new NotFoundError("Goal not found"));
    }

    if (
      goal.user.toString() !== req.user.id.toString() &&
      req.user.role !== "admin"
    ) {
      return errorResponse(
        res,
        new ForbiddenError("You can only delete your own goals"),
      );
    }

    await Goal.findByIdAndDelete(req.params.id);

    return successResponse(res, null, "Goal deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, new BadRequestError("Invalid goal ID format"));
    }

    return errorResponse(res, error);
  }
};

export const abandonGoal = async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);

    if (!goal) {
      return errorResponse(res, new NotFoundError("Goal not found"));
    }

    if (goal.user.toString() !== req.user.id.toString()) {
      return errorResponse(
        res,
        new ForbiddenError("You can only update your own goals"),
      );
    }

    if (goal.status === "completed") {
      return errorResponse(
        res,
        new BadRequestError("Cannot abandon a completed goal"),
      );
    }

    goal.status = "abandoned";
    await goal.save();

    return successResponse(res, goal, "Goal marked as abandoned");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(res, new BadRequestError("Invalid goal ID format"));
    }

    return errorResponse(res, error);
  }
};

export const getGoalStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalGoals = await Goal.countDocuments({ user: userId });
    const activeGoals = await Goal.countDocuments({
      user: userId,
      status: "active",
    });
    const completedGoals = await Goal.countDocuments({
      user: userId,
      status: "completed",
    });
    const abandonedGoals = await Goal.countDocuments({
      user: userId,
      status: "abandoned",
    });

    const goalsByType = await Goal.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
        },
      },
    ]);

    const progressStats = await Goal.aggregate([
      { $match: { user: userId, status: "active" } },
      {
        $group: {
          _id: null,
          avgProgress: {
            $avg: {
              $multiply: [{ $divide: ["$currentValue", "$targetValue"] }, 100],
            },
          },
        },
      },
    ]);

    const successRate =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    const upcomingDeadlines = await Goal.find({
      user: userId,
      status: "active",
      targetDate: { $gte: new Date() },
    })
      .sort("targetDate")
      .limit(5)
      .select("title targetDate progressPercentage");

    return successResponse(
      res,
      {
        totals: {
          total: totalGoals,
          active: activeGoals,
          completed: completedGoals,
          abandoned: abandonedGoals,
          successRate,
        },
        byType: goalsByType,
        averageProgress: Math.round(progressStats[0]?.avgProgress || 0),
        upcomingDeadlines,
      },
      "Goal statistics fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getCompletedGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      user: req.user.id,
      status: "completed",
    })
      .sort({ updatedAt: -1 })
      .select("title type targetValue unit completedAt updatedAt");

    return successResponse(res, goals, `${goals.length} completed goals`);
  } catch (error) {
    return errorResponse(res, error);
  }
};

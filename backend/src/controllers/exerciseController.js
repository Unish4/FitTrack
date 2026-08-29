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
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";

export const getExercises = async (req, res) => {
  try {
    const filteredQuery = new APIFeatures(Exercise.find(), req.query)
      .filter()
      .search(["name", "muscleGroup", "category"]).query;

    const total = await filteredQuery.clone().countDocuments();

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;

    const features = new APIFeatures(filteredQuery, req.query)
      .sort()
      .limitFields()
      .paginate(limit);

    const exercises = await features.query;

    return paginatedResponse(res, exercises, page, limit, total);
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return errorResponse(res, new NotFoundError("Exercise not found"));
    }

    return successResponse(res, exercise, "Exercise fetched successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid exercise ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const createExercise = async (req, res) => {
  try {
    const {
      name,
      category,
      muscleGroup,
      equipment,
      difficulty,
      instructions,
      tips,
    } = req.body;

    if (!name || !category || !muscleGroup) {
      return errorResponse(
        res,
        new BadRequestError("Please provide name, category, and muscle group"),
      );
    }

    const existingExercise = await Exercise.findOne({ name });

    if (existingExercise) {
      return errorResponse(
        res,
        new BadRequestError("An exercise with this name already exists"),
      );
    }

    const exercise = await Exercise.create({
      name,
      category,
      muscleGroup,
      equipment,
      difficulty,
      instructions,
      tips,
      createdBy: req.user.id, // Track who created it
    });

    return successResponse(res, exercise, "Exercise created successfully", 201);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    if (error.code === 11000) {
      return errorResponse(
        res,
        new BadRequestError("An exercise with this name already exists"),
      );
    }

    return errorResponse(res, error);
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { _id, createdAt, updatedAt, createdBy, ...updateData } = req.body;

    const exercise = await Exercise.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!exercise) {
      return errorResponse(res, new NotFoundError("Exercise not found"));
    }

    return successResponse(res, exercise, "Exercise updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid exercise ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return errorResponse(res, new NotFoundError("Exercise not found"));
    }

    if (exercise.image?.publicId) {
      try {
        await deleteFromCloudinary(exercise.image.publicId);
        console.log(`Deleted exercise image: ${exercise.image.publicId}`);
      } catch (error) {
        console.error("Failed to delete image:", error);
      }
    }

    await Exercise.findByIdAndDelete(req.params.id);

    return successResponse(res, null, "Exercise deleted successfully");
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid exercise ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const uploadExerciseImage = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        new BadRequestError("Please upload an image file"),
      );
    }

    const exercise = await Exercise.findById(req.params.id);

    if (!exercise) {
      return errorResponse(res, new NotFoundError("Exercise not found"));
    }

    const previousImagePublicId = exercise.image?.publicId;
    let uploadedImage = null;

    try {
      const result = await uploadToCloudinary(
        req.file.buffer,
        req.file.mimetype,
        "fitTrack/exercises",
      );

      uploadedImage = result;

      exercise.image = {
        url: result.url,
        publicId: result.publicId,
      };

      await exercise.save();
    } catch (error) {
      if (uploadedImage?.publicId) {
        try {
          await deleteFromCloudinary(uploadedImage.publicId);
        } catch (cleanupError) {
          console.error("Failed to clean up uploaded image:", cleanupError);
        }
      }

      throw error;
    }

    if (previousImagePublicId) {
      try {
        await deleteFromCloudinary(previousImagePublicId);
      } catch (error) {
        console.error("Failed to delete old image:", error);
      }
    }

    return successResponse(
      res,
      { image: exercise.image },
      "Exercise image uploaded",
    );
  } catch (error) {
    if (error.name === "CastError") {
      return errorResponse(
        res,
        new BadRequestError("Invalid exercise ID format"),
      );
    }

    return errorResponse(res, error);
  }
};

export const getExerciseCategories = async (req, res) => {
  try {
    const categories = await Exercise.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    const muscleGroups = await Exercise.aggregate([
      {
        $group: {
          _id: "$muscleGroup",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
    ]);

    return successResponse(
      res,
      { categories, muscleGroups },
      "Categories fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getExercisesByMuscleGroup = async (req, res) => {
  try {
    const { muscleGroup } = req.params;

    const validGroups = [
      "chest",
      "back",
      "legs",
      "core",
      "arms",
      "shoulders",
      "full-body",
      "cardio",
    ];

    if (!validGroups.includes(muscleGroup)) {
      return errorResponse(
        res,
        new BadRequestError(
          `Invalid muscle group. Valid: ${validGroups.join(", ")}`,
        ),
      );
    }

    const exercises = await Exercise.find({ muscleGroup })
      .select("name category difficulty equipment")
      .sort("name");

    return successResponse(
      res,
      exercises,
      `${exercises.length} exercises for ${muscleGroup}`,
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const searchExercises = async (req, res) => {
  try {
    const { q, category, muscleGroup, difficulty } = req.query;

    if (!q) {
      return errorResponse(
        res,
        new BadRequestError("Please provide a search query (?q=bench)"),
      );
    }

    const searchQuery = {
      $text: {
        $search: q,
      },
    };

    if (category) searchQuery.category = category;
    if (muscleGroup) searchQuery.muscleGroup = muscleGroup;
    if (difficulty) searchQuery.difficulty = difficulty;

    const exercises = await Exercise.find(searchQuery)
      .select({
        name: 1,
        category: 1,
        muscleGroup: 1,
        difficulty: 1,
        score: { $meta: "textScore" },
      })
      .sort({ score: { $meta: "textScore" } }) // Sort by relevance
      .limit(20);

    return successResponse(
      res,
      exercises,
      `Found ${exercises.length} exercises`,
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getPopularExercises = async (req, res) => {
  try {
    const popularExercises = await Exercise.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select("name category muscleGroup difficulty");

    return successResponse(res, popularExercises, "Popular exercises fetched");
  } catch (error) {
    return errorResponse(res, error);
  }
};

import User from "../models/User.js";
import Workout from "../models/Workout.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwt.js";
import { successResponse, errorResponse } from "../utils/response.js";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "../utils/AppError.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import { NotBeforeError } from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return errorResponse(
        res,
        new BadRequestError("Please provide a name, email and password"),
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return errorResponse(
        res,
        new BadRequestError("User with this email already exists!"),
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      fitnessProfile: {
        fitnessLevel: "beginner",
      },
    });

    const token = generateToken(user._id);

    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          fitnessProfile: user.fitnessProfile,
          avatar: user.avatar,
        },
      },
      "Account created successfully",
      201,
    );
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    // Handle duplicate key errors
    if (error.code === 11000) {
      return errorResponse(
        res,
        new BadRequestError("A user with this email already exists"),
      );
    }

    return errorResponse(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(
        res,
        new BadRequestError("Please provide email and password"),
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(
        res,
        new BadRequestError("Invalid email or password"),
      );
    }

    if (!user.isActive) {
      return errorResponse(res, new UnauthorizedError("Account deactivated!"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(
        res,
        new UnauthorizedError("Invalid email or password"),
      );
    }

    const token = generateToken(user._id);
    return successResponse(
      res,
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          fitnessProfile: user.fitnessProfile,
          avatar: user.avatar,
          streak: user.streak,
          totalWorkouts: user.totalWorkouts,
        },
      },
      "Logged in successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, new NotFoundError("User not found"));
    }
    const recentWorkouts = await Workout.find({ user: user._id })
      .sort({ date: -1 })
      .limit(5)
      .select("name date duration type caloriesBurned");

    return successResponse(
      res,
      {
        ...user.toObject(),
        recentWorkouts,
      },
      "Profile fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { password, role, fitnessProfile, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(req.user.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return errorResponse(res, new NotFoundError("No user found"));
    }

    return successResponse(res, user, "Profile updated successfully");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    if (error.code === 11000) {
      return errorResponse(res, new BadRequestError("Email already in use"));
    }

    return errorResponse(res, error);
  }
};

export const updateFitnessProfile = async (req, res) => {
  try {
    const { height, weight, age, fitnessLevel } = req.body;

    const fitnessProfile = {};

    if (height !== undefined) fitnessProfile.height = height;
    if (weight !== undefined) fitnessProfile.weight = weight;
    if (age !== undefined) fitnessProfile.age = age;
    if (fitnessLevel !== undefined) fitnessProfile.fitnessLevel = fitnessLevel;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { fitnessProfile },
      { new: true, runValidators: true },
    );

    if (!user) {
      return errorResponse(res, new NotFoundError("User not found"));
    }

    return successResponse(res, user.fitnessProfile, "Fitness profile updated");
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return errorResponse(res, new BadRequestError(messages.join(", ")));
    }

    return errorResponse(res, error);
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return errorResponse(
        res,
        new BadRequestError("Please provide current and new password"),
      );
    }

    if (newPassword.length < 6) {
      return errorResponse(
        res,
        new BadRequestError("New password must be atleast 6 characters long"),
      );
    }

    const user = await User.findById(req.user.id).select("+password");

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return errorResponse(
        res,
        new UnauthorizedError("Current password is incorrect"),
      );
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return successResponse(res, null, "Password changed successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return errorResponse(
        res,
        new BadRequestError("Please upload an image file"),
      );
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, new NotFoundError("User not found"));
    }

    if (user.avatar?.publicId) {
      try {
        await deleteFromCloudinary(user.avatar.publicId);
        console.log(`Deleted old avatar: ${user.avatar.publicId}`);
      } catch (error) {
        console.error("Failed to delete old avatar:", error);
      }
    }

    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.mimetype,
      "fitTrack/avatars",
    );

    user.avatar = {
      url: result.url,
      publicId: result.publicId,
    };

    await user.save();

    return successResponse(
      res,
      { avatar: user.avatar },
      "Avatar uploaded successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const deleteAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user.avatar?.publicId) {
      return errorResponse(res, new BadRequestError("No avatar to delete"));
    }

    await deleteFromCloudinary(user.avatar.publicId);

    user.avatar = {
      url: "",
      publicId: "",
    };

    await user.save();
    return successResponse(res, null, "Avatar removed successfully");
  } catch (error) {
    return errorResponse(res, error);
  }
};

export const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return errorResponse(res, new NotFoundError("User not found"));
    }

    const workoutStats = await Workout.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalDuration: { $sum: "$duration" },
          totalCalories: { $sum: "$caloriesBurned" },
          avgDuration: { $avg: "$duration" },
        },
      },
    ]);

    const workoutsByType = await Workout.aggregate([
      {
        $match: { user: user._id },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ]);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const last7DaysWorkouts = await Workout.countDocuments({
      user: user._id,
      date: { $gte: sevenDaysAgo },
    });

    return successResponse(
      res,
      {
        stats: workoutStats[0] || {
          totalWorkouts: 0,
          totalDuration: 0,
          totalCalories: 0,
          avgDuration: 0,
        },
        workoutsByType,
        last7DaysWorkouts,
        streak: user.streak,
        achievements: user.achievements,
        totalWorkouts: user.totalWorkouts,
      },
      "User stats fetched successfully",
    );
  } catch (error) {
    return errorResponse(res, error);
  }
};

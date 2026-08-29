import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      unique: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    avatar: {
      url: {
        type: String,
        default: "",
      },
      publicId: {
        type: String,
        default: "",
      },
    },

    fitnessProfile: {
      height: {
        type: Number,
        min: [50, "Height is too low"],
        max: [300, "Height is too high"],
        default: null,
      },

      weight: {
        type: Number,
        min: [20, "Weight too low"],
        max: [500, "Weight too high"],
        default: null,
      },

      age: {
        type: Number,
        min: [10, "Age too low"],
        max: [120, "Age too high"],
        default: null,
      },

      gender: {
        type: String,
        enum: ["male", "female", "other"],
        default: null,
      },

      fitnessLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
        default: "beginner",
      },
    },

    streak: {
      type: Number,
      default: 0,
    },

    totalWorkouts: {
      type: Number,
      default: 0,
    },

    achievements: [
      {
        name: {
          type: String,
          required: true,
        },

        description: {
          type: String,
          default: "",
        },

        earnedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

userSchema.index({ totalWorkouts: -1 });

const User = mongoose.model("User", userSchema);
export default User;

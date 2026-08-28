import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Exercise name is required"],
      trim: true,
      unique: true,
      minlength: [2, "Name too short"],
      maxlength: [100, "Name too long"],
    },

    category: {
      type: String,
      enum: {
        values: ["strength", "cardio", "flexibility", "balance", "other"],
        message: "{VALUE} is not a valid category",
      },
      required: [true, "Category is required"],
    },

    muscleGroup: {
      type: String,
      enum: {
        values: [
          "chest",
          "back",
          "legs",
          "core",
          "arms",
          "shoulders",
          "full-body",
          "cardio",
        ],
        message: "{VALUE} is not a valid muscle group",
      },
      required: [true, "Muscle group is required"],
    },

    equipment: {
      type: [String],
      default: ["bodyweight"],
      enum: {
        values: [
          "bodyweight",
          "barbell",
          "dumbbell",
          "kettlebell",
          "machine",
          "cable",
          "resistance-band",
          "other",
        ],
        message: "{VALUE} is not valid equipment",
      },
    },

    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },

    instructions: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 20; // Max 20 steps
        },
        message: "Maximum 20 instruction steps allowed",
      },
    },

    tips: {
      type: [String],
      default: [],
    },

    image: {
      url: { type: String, default: "" },
      publicId: { type: String, default: "" },
    },

    isPublic: {
      type: Boolean,
      default: true, // Public library exercises
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      required: function () {
        return !this.isPublic;
      },
    },
  },
  {
    timestamps: true,
  },
);

// Text index for search
exerciseSchema.index({
  name: "text",
  muscleGroup: "text",
  category: "text",
});

// Index for filtering
exerciseSchema.index({ category: 1, muscleGroup: 1 });

const Exercise = mongoose.model("Exercise", exerciseSchema);
export default Exercise;

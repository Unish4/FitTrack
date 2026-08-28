import mongoose from "mongoose";

const goalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Goal must belong to a user"],
      index: true,
    },

    type: {
      type: String,
      enum: [
        "weight_loss",
        "muscle_gain",
        "endurance",
        "strength",
        "flexibility",
        "workout_count",
        "custom",
      ],
      required: [true, "Goal type is required"],
    },

    title: {
      type: String,
      required: [true, "Goal title is required"],
      trim: true,
      maxlength: [200, "Title too long"],
    },

    targetValue: {
      type: Number,
      required: [true, "Target value is required"],
      min: [0, "Target cannot be negative"],
    },

    currentValue: {
      type: Number,
      default: 0,
      min: [0, "Current value cannot be negative"],
    },

    unit: {
      type: String,
      default: "",
      maxlength: [20, "Unit too long"],
    },

    startDate: {
      type: Date,
      default: Date.now,
    },

    targetDate: {
      type: Date,
      validate: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "Target date must be after start date",
      },
    },

    status: {
      type: String,
      enum: ["active", "completed", "abandoned"],
      default: "active",
    },

    notes: {
      type: String,
      default: "",
      maxlength: [500, "Notes too long"],
    },
  },
  { timestamps: true },
);

// Virtual: Progress percentage
goalSchema.virtual("progressPercentage").get(function () {
  if (this.targetValue === 0) return 0;
  return Math.min(
    100,
    Math.round((this.currentValue / this.targetValue) * 100),
  );
});

goalSchema.set("toJSON", { virtuals: true });
goalSchema.set("toObject", { virtuals: true });

// Index
goalSchema.index({ user: 1, status: 1 });

const Goal = mongoose.model("Goal", goalSchema);
export default Goal;

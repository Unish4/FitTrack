import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Workout must belong to a user"],
      index: true,
    },

    name: {
      type: String,
      required: [true, "Workout name is required"],
      trim: true,
      maxlength: [200, "Name cannot exceed 200 characters"],
    },

    date: {
      type: Date,
      default: Date.now,
      required: [true, "Workout date is required"],
    },

    duration: {
      type: Number,
      min: [1, "Duration must be at least 1 minute"],
      max: [1440, "Duration cannot exceed 24 hours"],
      default: 30,
    },

    type: {
      type: String,
      enum: ["strength", "cardio", "flexibility", "mixed"],
      default: "strength",
    },

    exercises: [
      {
        exercise: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
          required: true,
        },
        name: {
          type: String, // Snapshot of exercise name
          required: true,
        },
        sets: [
          {
            reps: {
              type: Number,
              min: [0, "Reps cannot be negative"],
              default: 0,
            },
            weight: {
              type: Number,
              min: [0, "Weight cannot be negative"],
              default: 0, // In kg
            },
            duration: {
              type: Number,
              min: [0, "Duration cannot be negative"],
              default: 0, // For cardio (seconds)
            },
            distance: {
              type: Number,
              min: [0, "Distance cannot be negative"],
              default: 0, // For cardio (km)
            },
            restTime: {
              type: Number,
              min: [0, "Rest time cannot be negative"],
              default: 60, // Rest between sets (seconds)
            },
            completed: {
              type: Boolean,
              default: true,
            },
          },
        ],
        notes: {
          type: String,
          default: "",
          maxlength: [500, "Notes too long"],
        },
      },
    ],

    caloriesBurned: {
      type: Number,
      min: [0, "Calories cannot be negative"],
      default: 0,
    },

    mood: {
      type: String,
      enum: ["great", "good", "okay", "tired", "bad"],
      default: "good",
    },

    intensity: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    notes: {
      type: String,
      default: "",
      maxlength: [1000, "Notes too long"],
    },
  },
  { timestamps: true },
);

// Indexes for queries
workoutSchema.index({ user: 1, date: -1 });
workoutSchema.index({ user: 1, type: 1 });

// Virtual: Total volume (sets × reps × weight)
workoutSchema.virtual("totalVolume").get(function () {
  let volume = 0;
  this.exercises.forEach((exercise) => {
    exercise.sets.forEach((set) => {
      volume += set.reps * set.weight;
    });
  });
  return volume;
});

// Enable virtuals
workoutSchema.set("toJSON", { virtuals: true });
workoutSchema.set("toObject", { virtuals: true });

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;

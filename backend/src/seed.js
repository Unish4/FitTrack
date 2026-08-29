import { connectDB } from "./config/db.js";
import Exercise from "./models/Exercise.js";
import mongoose from "mongoose";

const exercisesData = [
  {
    name: "Barbell Bench Press",
    category: "strength",
    muscleGroup: "chest",
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Lie flat on the bench with feet firm on the floor.",
      "Grip the barbell slightly wider than shoulder-width apart.",
      "Unrack the bar and lower it slowly to mid-chest level.",
      "Press the bar explosively upwards until arms are fully extended."
    ],
    tips: ["Keep your elbows at a 45-degree angle to protect shoulder joints."],
    isPublic: true
  },
  {
    name: "Incline Dumbbell Press",
    category: "strength",
    muscleGroup: "chest",
    equipment: ["dumbbell"],
    difficulty: "intermediate",
    instructions: [
      "Set an adjustable bench to a 30-45 degree incline.",
      "Sit down holding dumbbells resting on your thighs.",
      "Lift dumbbells up to chest height and press straight overhead.",
      "Lower with control until dumbbells align with upper chest."
    ],
    tips: ["Avoid setting incline too high to keep focus on upper chest."],
    isPublic: true
  },
  {
    name: "Push-Ups",
    category: "strength",
    muscleGroup: "chest",
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Place hands shoulder-width apart on the floor with legs extended behind.",
      "Keep your body in a straight plank position from head to heels.",
      "Lower your body until chest nearly touches the floor.",
      "Push back up to starting position."
    ],
    tips: ["Keep core engaged to prevent lower back sagging."],
    isPublic: true
  },
  {
    name: "Barbell Back Squat",
    category: "strength",
    muscleGroup: "legs",
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Rest the barbell across your upper back trapezius muscle.",
      "Stand with feet shoulder-width apart and toes turned slightly outward.",
      "Lower your hips back and down as if sitting in a chair.",
      "Squat down until thighs are parallel to ground, then drive up through heels."
    ],
    tips: ["Keep knees tracking over toes and chest up throughout movement."],
    isPublic: true
  },
  {
    name: "Romanian Deadlift",
    category: "strength",
    muscleGroup: "legs",
    equipment: ["barbell", "dumbbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand upright holding barbell with overhand grip.",
      "Hinge forward at hips while pushing hips backward with slight knee bend.",
      "Lower bar along shins until hamstrings feel deep stretch.",
      "Drive hips forward to return to standing position."
    ],
    tips: ["Keep bar close to your body and avoid rounding lower back."],
    isPublic: true
  },
  {
    name: "Leg Press",
    category: "strength",
    muscleGroup: "legs",
    equipment: ["machine"],
    difficulty: "beginner",
    instructions: [
      "Sit in leg press machine with back flat against pad.",
      "Place feet hip-width apart on footplate.",
      "Release safety bars and press footplate away until legs are extended.",
      "Bend knees to lower footplate toward chest, then press back up."
    ],
    tips: ["Do not lock out knees completely at peak extension."],
    isPublic: true
  },
  {
    name: "Pull-Ups",
    category: "strength",
    muscleGroup: "back",
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Grab pull-up bar with palms facing away, slightly wider than shoulder-width.",
      "Hang freely with arms fully extended.",
      "Pull chest up toward bar by driving elbows down.",
      "Lower back down with controlled speed."
    ],
    tips: ["Focus on squeezing shoulder blades together at top contraction."],
    isPublic: true
  },
  {
    name: "Lat Pulldown",
    category: "strength",
    muscleGroup: "back",
    equipment: ["cable", "machine"],
    difficulty: "beginner",
    instructions: [
      "Sit at lat pulldown machine and adjust thigh pad.",
      "Grip wide bar with palms facing forward.",
      "Pull bar down toward upper chest while leaning slightly backward.",
      "Slowly return bar to top starting position."
    ],
    tips: ["Avoid swinging body momentum to pull heavy weight."],
    isPublic: true
  },
  {
    name: "Bent-Over Barbell Row",
    category: "strength",
    muscleGroup: "back",
    equipment: ["barbell"],
    difficulty: "intermediate",
    instructions: [
      "Stand holding barbell with overhand grip and knees slightly bent.",
      "Bend forward at waist until torso is almost parallel to floor.",
      "Pull barbell up to lower abdomen, squeezing back muscles.",
      "Lower bar back to starting position under control."
    ],
    tips: ["Maintain flat spine alignment throughout all repetitions."],
    isPublic: true
  },
  {
    name: "Overhead Dumbbell Shoulder Press",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: ["dumbbell"],
    difficulty: "intermediate",
    instructions: [
      "Sit upright holding dumbbells at shoulder level with palms facing forward.",
      "Press dumbbells overhead until arms are fully extended.",
      "Lower dumbbells steadily back to shoulder height."
    ],
    tips: ["Avoid arching lower back excessively during heavy overhead presses."],
    isPublic: true
  },
  {
    name: "Lateral Raises",
    category: "strength",
    muscleGroup: "shoulders",
    equipment: ["dumbbell"],
    difficulty: "beginner",
    instructions: [
      "Stand holding dumbbells at sides with slight elbow bend.",
      "Raise arms out to sides until parallel to floor.",
      "Pause briefly at shoulder height, then lower with control."
    ],
    tips: ["Lead movement with elbows rather than wrists."],
    isPublic: true
  },
  {
    name: "Bicep Dumbbell Curls",
    category: "strength",
    muscleGroup: "arms",
    equipment: ["dumbbell"],
    difficulty: "beginner",
    instructions: [
      "Stand holding dumbbells at sides with palms facing forward.",
      "Curl weight up toward shoulders while keeping upper arms stationary.",
      "Squeeze biceps at peak contraction, then lower slowly."
    ],
    tips: ["Keep elbows pinned close to torso during curl."],
    isPublic: true
  },
  {
    name: "Tricep Rope Pushdowns",
    category: "strength",
    muscleGroup: "arms",
    equipment: ["cable"],
    difficulty: "beginner",
    instructions: [
      "Attach rope attachment to high cable pulley.",
      "Grip rope ends and hold upper arms motionless beside ribs.",
      "Extend arms downward, spreading rope ends at bottom contraction.",
      "Slowly return to 90-degree elbow angle."
    ],
    tips: ["Isolate tricep movement without using shoulder motion."],
    isPublic: true
  },
  {
    name: "Plank Hold",
    category: "flexibility",
    muscleGroup: "core",
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Place forearms on floor with elbows underneath shoulders.",
      "Extend legs behind with toes planted on floor.",
      "Engage abdominal muscles and hold body rigid like a board."
    ],
    tips: ["Breathe steadily and avoid letting hips sag or arch up."],
    isPublic: true
  },
  {
    name: "Hanging Leg Raises",
    category: "strength",
    muscleGroup: "core",
    equipment: ["bodyweight"],
    difficulty: "advanced",
    instructions: [
      "Hang from pull-up bar with arms straight.",
      "Keeping legs straight or knees slightly bent, raise legs until parallel to floor.",
      "Slowly lower legs back down without swinging."
    ],
    tips: ["Initiate movement purely from core contraction without momentum."],
    isPublic: true
  },
  {
    name: "Treadmill Running",
    category: "cardio",
    muscleGroup: "cardio",
    equipment: ["machine"],
    difficulty: "beginner",
    instructions: [
      "Step onto treadmill and select speed and incline.",
      "Maintain tall running posture with arms swinging naturally.",
      "Cool down gradually at end of interval."
    ],
    tips: ["Land gently on midfoot to minimize joint impact."],
    isPublic: true
  },
  {
    name: "Rowing Machine (Ergometer)",
    category: "cardio",
    muscleGroup: "full-body",
    equipment: ["machine"],
    difficulty: "intermediate",
    instructions: [
      "Strap feet onto footpads and grab handle with overhand grip.",
      "Push with legs first, lean back slightly, then pull handle to chest.",
      "Extend arms forward, lean torso forward, then bend knees to recover."
    ],
    tips: ["Drive power 60% from legs, 20% core, 20% arms."],
    isPublic: true
  },
  {
    name: "Kettlebell Swings",
    category: "cardio",
    muscleGroup: "full-body",
    equipment: ["kettlebell"],
    difficulty: "intermediate",
    instructions: [
      "Stand with feet shoulder-width apart with kettlebell on floor in front.",
      "Hinge at hips to pick up kettlebell and swing it between legs.",
      "Thrust hips forward powerfully to swing kettlebell up to chest level.",
      "Let kettlebell fall naturally back between legs and repeat."
    ],
    tips: ["Movement is a hip hinge, not a knee squat."],
    isPublic: true
  },
  {
    name: "Bodyweight Burpees",
    category: "cardio",
    muscleGroup: "full-body",
    equipment: ["bodyweight"],
    difficulty: "intermediate",
    instructions: [
      "Stand tall, then drop into squat position and place hands on floor.",
      "Kick feet back into push-up position and perform a push-up.",
      "Jump feet back toward hands, then jump explosively into air."
    ],
    tips: ["Pace yourself smoothly during high-intensity intervals."],
    isPublic: true
  },
  {
    name: "Hamstring & Calves Stretch",
    category: "flexibility",
    muscleGroup: "legs",
    equipment: ["bodyweight"],
    difficulty: "beginner",
    instructions: [
      "Sit on floor with one leg extended and other bent inward.",
      "Reach forward toward extended toes while keeping back straight.",
      "Hold stretch for 30 seconds, then switch legs."
    ],
    tips: ["Stretch to point of mild tension without bouncing or pain."],
    isPublic: true
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    console.log("Connected to database for seeding...");

    let insertedCount = 0;
    for (const exercise of exercisesData) {
      const existing = await Exercise.findOne({ name: exercise.name });
      if (!existing) {
        await Exercise.create(exercise);
      } else {
        await Exercise.updateOne({ _id: existing._id }, exercise);
      }
      insertedCount++;
    }

    console.log(`✅ Successfully seeded ${insertedCount} public exercises into FitTrack database!`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to seed database:", error);
    process.exit(1);
  }
};

seedDatabase();

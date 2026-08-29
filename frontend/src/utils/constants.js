export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const WORKOUT_TYPES = [
  { value: 'strength', label: 'Strength Training' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'mixed', label: 'Mixed / Hybrid' },
];

export const WORKOUT_MOODS = [
  { value: 'great', label: '⚡ Great', emoji: '⚡' },
  { value: 'good', label: '😊 Good', emoji: '😊' },
  { value: 'okay', label: '😐 Okay', emoji: '😐' },
  { value: 'tired', label: '😴 Tired', emoji: '😴' },
  { value: 'bad', label: '😫 Bad', emoji: '😫' },
];

export const WORKOUT_INTENSITIES = [
  { value: 'low', label: 'Low Intensity' },
  { value: 'medium', label: 'Medium Intensity' },
  { value: 'high', label: 'High Intensity' },
];

export const EXERCISE_CATEGORIES = [
  { value: 'strength', label: 'Strength' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'balance', label: 'Balance' },
  { value: 'other', label: 'Other' },
];

export const MUSCLE_GROUPS = [
  { value: 'chest', label: 'Chest' },
  { value: 'back', label: 'Back' },
  { value: 'legs', label: 'Legs' },
  { value: 'core', label: 'Core' },
  { value: 'arms', label: 'Arms' },
  { value: 'shoulders', label: 'Shoulders' },
  { value: 'full-body', label: 'Full Body' },
  { value: 'cardio', label: 'Cardio' },
];

export const GOAL_TYPES = [
  { value: 'weight_loss', label: 'Weight Loss' },
  { value: 'muscle_gain', label: 'Muscle Gain' },
  { value: 'endurance', label: 'Endurance' },
  { value: 'strength', label: 'Strength' },
  { value: 'flexibility', label: 'Flexibility' },
  { value: 'workout_count', label: 'Total Workouts' },
  { value: 'custom', label: 'Custom Goal' },
];

export const GOAL_STATUSES = [
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'abandoned', label: 'Abandoned' },
];

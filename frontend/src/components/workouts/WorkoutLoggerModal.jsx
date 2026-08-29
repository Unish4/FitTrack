import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import { useExerciseStore } from '../../store/exerciseStore';
import { Plus, Trash2, CheckCircle2, Dumbbell } from 'lucide-react';
import { WORKOUT_TYPES, WORKOUT_MOODS, WORKOUT_INTENSITIES } from '../../utils/constants';

export const WorkoutLoggerModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const { exercises: availableExercises, fetchExercises } = useExerciseStore();

  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState(45);
  const [type, setType] = useState('strength');
  const [caloriesBurned, setCaloriesBurned] = useState(250);
  const [mood, setMood] = useState('good');
  const [intensity, setIntensity] = useState('medium');
  const [notes, setNotes] = useState('');
  const [workoutExercises, setWorkoutExercises] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchExercises({ limit: 100 });
    }
  }, [isOpen, fetchExercises]);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDate(initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
      setDuration(initialData.duration || 30);
      setType(initialData.type || 'strength');
      setCaloriesBurned(initialData.caloriesBurned || 0);
      setMood(initialData.mood || 'good');
      setIntensity(initialData.intensity || 'medium');
      setNotes(initialData.notes || '');
      setWorkoutExercises(
        initialData.exercises?.map((item) => ({
          exercise: item.exercise?._id || item.exercise,
          name: item.name || item.exercise?.name || 'Exercise',
          notes: item.notes || '',
          sets: item.sets?.map((s) => ({
            reps: s.reps || 10,
            weight: s.weight || 0,
            restTime: s.restTime || 60,
            completed: s.completed !== false,
          })) || [{ reps: 10, weight: 0, restTime: 60, completed: true }],
        })) || []
      );
    } else {
      setName('Daily Strength Session');
      setDate(new Date().toISOString().split('T')[0]);
      setDuration(45);
      setType('strength');
      setCaloriesBurned(250);
      setMood('good');
      setIntensity('medium');
      setNotes('');
      setWorkoutExercises([]);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const addExerciseBlock = (exerciseObj) => {
    setWorkoutExercises([
      ...workoutExercises,
      {
        exercise: exerciseObj._id,
        name: exerciseObj.name,
        notes: '',
        sets: [{ reps: 10, weight: 20, restTime: 60, completed: true }],
      },
    ]);
  };

  const removeExerciseBlock = (index) => {
    setWorkoutExercises(workoutExercises.filter((_, i) => i !== index));
  };

  const addSetToExercise = (exIndex) => {
    const updated = [...workoutExercises];
    const lastSet = updated[exIndex].sets[updated[exIndex].sets.length - 1] || { reps: 10, weight: 20, restTime: 60 };
    updated[exIndex].sets.push({ ...lastSet, completed: true });
    setWorkoutExercises(updated);
  };

  const removeSetFromExercise = (exIndex, setIndex) => {
    const updated = [...workoutExercises];
    if (updated[exIndex].sets.length > 1) {
      updated[exIndex].sets = updated[exIndex].sets.filter((_, sI) => sI !== setIndex);
      setWorkoutExercises(updated);
    }
  };

  const updateSetField = (exIndex, setIndex, field, value) => {
    const updated = [...workoutExercises];
    updated[exIndex].sets[setIndex][field] = value;
    setWorkoutExercises(updated);
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Workout name is required';
    if (workoutExercises.length === 0) {
      errs.exercises = 'Please add at least one exercise to your workout session';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      date,
      duration: Number(duration),
      type,
      caloriesBurned: Number(caloriesBurned),
      mood,
      intensity,
      notes: notes.trim(),
      exercises: workoutExercises.map((item) => ({
        exercise: item.exercise,
        name: item.name,
        notes: item.notes,
        sets: item.sets.map((s) => ({
          reps: Number(s.reps),
          weight: Number(s.weight),
          restTime: Number(s.restTime),
          completed: Boolean(s.completed),
        })),
      })),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Workout' : 'Log New Workout'}
      subtitle="Track your sets, reps, weight, and energy burned"
      maxWidth="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Workout Metadata */}
        <div className="space-y-4">
          <Input
            label="Workout Session Name"
            placeholder="e.g. Chest & Triceps Blast"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <Select
              label="Workout Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={WORKOUT_TYPES}
            />
            <Input
              label="Duration (Minutes)"
              type="number"
              min="1"
              max="1440"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Calories Burned (kcal)"
              type="number"
              min="0"
              value={caloriesBurned}
              onChange={(e) => setCaloriesBurned(e.target.value)}
            />
            <Select
              label="Mood / Energy"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
              options={WORKOUT_MOODS}
            />
            <Select
              label="Intensity Level"
              value={intensity}
              onChange={(e) => setIntensity(e.target.value)}
              options={WORKOUT_INTENSITIES}
            />
          </div>
        </div>

        {/* Exercises Builder */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Dumbbell className="w-4 h-4 text-emerald-400" /> Workout Exercises ({workoutExercises.length})
              </h4>
              {errors.exercises && (
                <p className="text-xs text-rose-400 font-medium">{errors.exercises}</p>
              )}
            </div>

            {/* Exercise Selector */}
            <Select
              placeholder="+ Select Exercise to Add"
              fullWidth={false}
              className="sm:w-64"
              options={availableExercises.map((ex) => ({
                value: ex._id,
                label: `${ex.name} (${ex.muscleGroup})`,
              }))}
              onChange={(e) => {
                const found = availableExercises.find((ex) => ex._id === e.target.value);
                if (found) {
                  addExerciseBlock(found);
                  e.target.value = '';
                }
              }}
            />
          </div>

          {/* Exercise Set Blocks */}
          {workoutExercises.map((exBlock, exIdx) => (
            <div key={exIdx} className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 text-xs flex items-center justify-center font-bold">
                    {exIdx + 1}
                  </span>
                  {exBlock.name}
                </span>

                <button
                  type="button"
                  onClick={() => removeExerciseBlock(exIdx)}
                  className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold p-1 hover:bg-rose-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              </div>

              {/* Set Inputs */}
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 px-2">
                  <span className="col-span-2">Set</span>
                  <span className="col-span-3">Reps</span>
                  <span className="col-span-4">Weight (kg)</span>
                  <span className="col-span-2">Rest (s)</span>
                  <span className="col-span-1 text-center"></span>
                </div>

                {exBlock.sets.map((setObj, setIdx) => (
                  <div key={setIdx} className="grid grid-cols-12 gap-2 items-center">
                    <span className="col-span-2 text-xs font-semibold text-slate-400 pl-2">
                      #{setIdx + 1}
                    </span>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        value={setObj.reps}
                        onChange={(e) => updateSetField(exIdx, setIdx, 'reps', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.5"
                        value={setObj.weight}
                        onChange={(e) => updateSetField(exIdx, setIdx, 'weight', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="0"
                        value={setObj.restTime}
                        onChange={(e) => updateSetField(exIdx, setIdx, 'restTime', Number(e.target.value))}
                      />
                    </div>
                    <div className="col-span-1 text-center">
                      {exBlock.sets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSetFromExercise(exIdx, setIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-1 flex justify-start">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  iconLeft={Plus}
                  onClick={() => addSetToExercise(exIdx)}
                >
                  Add Set
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Notes */}
        <Input
          label="Session Notes & Comments"
          placeholder="e.g. Felt great on bench press, hit personal record!"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
            {initialData ? 'Save Workout' : 'Log Workout'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

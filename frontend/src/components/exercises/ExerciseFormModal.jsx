import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { EXERCISE_CATEGORIES, MUSCLE_GROUPS } from '../../utils/constants';

const EQUIPMENT_OPTIONS = [
  'bodyweight',
  'barbell',
  'dumbbell',
  'kettlebell',
  'machine',
  'cable',
  'resistance-band',
  'other',
];

export const ExerciseFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('strength');
  const [muscleGroup, setMuscleGroup] = useState('chest');
  const [difficulty, setDifficulty] = useState('beginner');
  const [selectedEquipment, setSelectedEquipment] = useState(['bodyweight']);
  const [instructions, setInstructions] = useState(['']);
  const [tips, setTips] = useState(['']);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setCategory(initialData.category || 'strength');
      setMuscleGroup(initialData.muscleGroup || 'chest');
      setDifficulty(initialData.difficulty || 'beginner');
      setSelectedEquipment(initialData.equipment || ['bodyweight']);
      setInstructions(
        initialData.instructions && initialData.instructions.length > 0
          ? initialData.instructions
          : ['']
      );
      setTips(
        initialData.tips && initialData.tips.length > 0
          ? initialData.tips
          : ['']
      );
    } else {
      setName('');
      setCategory('strength');
      setMuscleGroup('chest');
      setDifficulty('beginner');
      setSelectedEquipment(['bodyweight']);
      setInstructions(['']);
      setTips(['']);
    }
    setErrors({});
  }, [initialData, isOpen]);

  const toggleEquipment = (eq) => {
    if (selectedEquipment.includes(eq)) {
      if (selectedEquipment.length > 1) {
        setSelectedEquipment(selectedEquipment.filter((item) => item !== eq));
      }
    } else {
      setSelectedEquipment([...selectedEquipment, eq]);
    }
  };

  const handleInstructionChange = (index, value) => {
    const updated = [...instructions];
    updated[index] = value;
    setInstructions(updated);
  };

  const addInstruction = () => {
    if (instructions.length < 20) {
      setInstructions([...instructions, '']);
    }
  };

  const removeInstruction = (index) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const handleTipChange = (index, value) => {
    const updated = [...tips];
    updated[index] = value;
    setTips(updated);
  };

  const addTip = () => setTips([...tips, '']);
  const removeTip = (index) => setTips(tips.filter((_, i) => i !== index));

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Exercise name is required';
    if (!category) errs.category = 'Category is required';
    if (!muscleGroup) errs.muscleGroup = 'Muscle group is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      category,
      muscleGroup,
      difficulty,
      equipment: selectedEquipment,
      instructions: instructions.filter((i) => i.trim() !== ''),
      tips: tips.filter((t) => t.trim() !== ''),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Exercise' : 'Create New Exercise'}
      subtitle="Admin library management"
      maxWidth="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Exercise Name"
          placeholder="e.g. Barbell Bench Press"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />

        <div className="grid sm:grid-cols-3 gap-4">
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={EXERCISE_CATEGORIES}
          />
          <Select
            label="Muscle Group"
            value={muscleGroup}
            onChange={(e) => setMuscleGroup(e.target.value)}
            options={MUSCLE_GROUPS}
          />
          <Select
            label="Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            options={[
              { value: 'beginner', label: 'Beginner' },
              { value: 'intermediate', label: 'Intermediate' },
              { value: 'advanced', label: 'Advanced' },
            ]}
          />
        </div>

        {/* Equipment Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
            Equipment
          </label>
          <div className="flex flex-wrap gap-2">
            {EQUIPMENT_OPTIONS.map((eq) => {
              const isSelected = selectedEquipment.includes(eq);
              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleEquipment(eq)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all capitalize ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {eq}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Instructions */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Instruction Steps ({instructions.length})
            </label>
            <Button type="button" variant="ghost" size="sm" iconLeft={Plus} onClick={addInstruction}>
              Add Step
            </Button>
          </div>
          {instructions.map((step, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <span className="text-xs font-bold text-slate-500 w-5">{idx + 1}.</span>
              <Input
                placeholder={`Step ${idx + 1} instruction...`}
                value={step}
                onChange={(e) => handleInstructionChange(idx, e.target.value)}
              />
              {instructions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeInstruction(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Dynamic Tips */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Pro Tips ({tips.length})
            </label>
            <Button type="button" variant="ghost" size="sm" iconLeft={Plus} onClick={addTip}>
              Add Tip
            </Button>
          </div>
          {tips.map((tip, idx) => (
            <div key={idx} className="flex items-center space-x-2">
              <Input
                placeholder="Pro tip..."
                value={tip}
                onChange={(e) => handleTipChange(idx, e.target.value)}
              />
              {tips.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTip(idx)}
                  className="p-2 text-slate-500 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
            {initialData ? 'Save Changes' : 'Create Exercise'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

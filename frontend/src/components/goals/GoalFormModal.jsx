import React, { useState, useEffect } from 'react';
import { Modal, Input, Select, Button } from '../ui';
import { CheckCircle2 } from 'lucide-react';
import { GOAL_TYPES } from '../../utils/constants';

export const GoalFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isLoading = false,
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('weight_loss');
  const [targetValue, setTargetValue] = useState(10);
  const [currentValue, setCurrentValue] = useState(0);
  const [unit, setUnit] = useState('kg');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setType(initialData.type || 'weight_loss');
      setTargetValue(initialData.targetValue || 10);
      setCurrentValue(initialData.currentValue || 0);
      setUnit(initialData.unit || 'kg');
      setTargetDate(
        initialData.targetDate
          ? new Date(initialData.targetDate).toISOString().split('T')[0]
          : ''
      );
      setNotes(initialData.notes || '');
    } else {
      setTitle('');
      setType('weight_loss');
      setTargetValue(10);
      setCurrentValue(0);
      setUnit('kg');

      // Default target date: 30 days from now
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 30);
      setTargetDate(defaultDate.toISOString().split('T')[0]);
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const validate = () => {
    const errs = {};
    if (!title.trim()) errs.title = 'Goal title is required';
    if (!type) errs.type = 'Goal type is required';
    if (!targetValue || Number(targetValue) <= 0) {
      errs.targetValue = 'Target value must be greater than 0';
    }
    if (targetDate && new Date(targetDate) <= new Date()) {
      errs.targetDate = 'Target date must be in the future';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      type,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      unit: unit.trim(),
      targetDate: targetDate ? new Date(targetDate).toISOString() : undefined,
      notes: notes.trim(),
    };

    onSubmit(payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Fitness Goal' : 'Create New Fitness Goal'}
      subtitle="Set target metrics and completion deadline"
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Goal Title"
          placeholder="e.g. Lose 5kg before summer"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <div className="grid sm:grid-cols-2 gap-4">
          <Select
            label="Goal Type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            options={GOAL_TYPES}
            error={errors.type}
          />
          <Input
            label="Measurement Unit"
            placeholder="e.g. kg, workouts, km"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Target Value"
            type="number"
            min="0.1"
            step="any"
            value={targetValue}
            onChange={(e) => setTargetValue(e.target.value)}
            error={errors.targetValue}
          />
          <Input
            label="Current Initial Value"
            type="number"
            min="0"
            step="any"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
          />
        </div>

        <Input
          label="Target Completion Date"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          error={errors.targetDate}
        />

        <Input
          label="Notes & Strategy"
          placeholder="e.g. Workout 4 times a week and eat clean"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
            {initialData ? 'Save Goal' : 'Create Goal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

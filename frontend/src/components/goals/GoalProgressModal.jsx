import React, { useState, useEffect } from 'react';
import { Modal, Input, Button } from '../ui';
import { Trophy, CheckCircle2 } from 'lucide-react';

export const GoalProgressModal = ({
  isOpen,
  onClose,
  onSubmit,
  goal,
  isLoading = false,
}) => {
  const [mode, setMode] = useState('set'); // 'set' | 'increment'
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (goal) {
      setVal(goal.currentValue || 0);
      setMode('set');
    }
  }, [goal, isOpen]);

  if (!goal) return null;

  const currentValNum = Number(val) || 0;
  const newCalculatedVal = mode === 'set' ? currentValNum : (goal.currentValue || 0) + currentValNum;
  const willAchieve = newCalculatedVal >= goal.targetValue;

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = mode === 'set'
      ? { currentValue: currentValNum }
      : { incrementBy: currentValNum };

    onSubmit(goal._id, payload);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Update Progress: ${goal.title}`}
      subtitle={`Target: ${goal.targetValue} ${goal.unit} • Currently: ${goal.currentValue} ${goal.unit}`}
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Mode Selector */}
        <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('set');
              setVal(goal.currentValue || 0);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'set'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Set Exact Value
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('increment');
              setVal(1);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              mode === 'increment'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Add / Increment Amount
          </button>
        </div>

        <Input
          label={mode === 'set' ? `New Total (${goal.unit})` : `Amount to Add (${goal.unit})`}
          type="number"
          step="any"
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />

        {willAchieve && (
          <div className="p-3.5 bg-purple-500/10 border border-purple-500/30 rounded-xl flex items-center space-x-3 text-xs text-purple-300">
            <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
            <span>🎉 Outstanding! This update will mark your goal as <strong>Completed</strong>!</span>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
            Update Progress
          </Button>
        </div>
      </form>
    </Modal>
  );
};

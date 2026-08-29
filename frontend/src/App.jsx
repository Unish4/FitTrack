import React, { useState } from 'react';
import {
  Button,
  Input,
  Select,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  Badge,
  Spinner,
  Skeleton,
  CardSkeleton,
  Modal,
  ConfirmModal,
  EmptyState,
} from './components/ui';
import { Activity, Mail, Lock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);

  const handleAsyncAction = () => {
    setLoadingBtn(true);
    setTimeout(() => {
      setLoadingBtn(false);
      toast.success('Action executed successfully!');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12">
      <Toaster position="top-right" />
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header */}
        <div className="flex items-center space-x-4 border-b border-slate-800 pb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              FitTrack Design System
            </h1>
            <p className="text-sm text-slate-400">
              Phase 1 — Reusable UI Primitives Showcase
            </p>
          </div>
        </div>

        {/* Buttons */}
        <Card>
          <CardHeader>
            <div>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Primary, secondary, outline, danger, ghost variants & sizes</CardDescription>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Button variant="primary" iconLeft={Plus} onClick={() => toast.success('Primary clicked')}>
                Primary Button
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="danger" iconLeft={Trash2} onClick={() => setIsConfirmOpen(true)}>
                Delete
              </Button>
              <Button variant="ghost">Ghost</Button>
            </div>

            <div className="flex flex-wrap gap-3 items-center pt-2">
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
              <Button variant="primary" isLoading={loadingBtn} onClick={handleAsyncAction}>
                Async Loader
              </Button>
              <Button variant="primary" isDisabled>Disabled</Button>
            </div>
          </CardBody>
        </Card>

        {/* Inputs & Selects */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Inputs</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input label="Email Address" iconLeft={Mail} placeholder="name@example.com" />
              <Input label="Password" iconLeft={Lock} type="password" placeholder="••••••••" error="Password must be at least 6 characters" />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select Dropdowns</CardTitle>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Fitness Goal"
                options={[
                  { value: 'weight_loss', label: 'Weight Loss' },
                  { value: 'muscle_gain', label: 'Muscle Gain' },
                  { value: 'endurance', label: 'Endurance' },
                ]}
              />
              <Select
                label="Activity Level"
                helperText="Selected level will adjust calorie recommendations"
                options={['Beginner', 'Intermediate', 'Advanced']}
              />
            </CardBody>
          </Card>
        </div>

        {/* Badges & Modals */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Badges & Indicators</CardTitle>
            </CardHeader>
            <CardBody className="flex flex-wrap gap-2">
              <Badge variant="emerald" dot>Active</Badge>
              <Badge variant="indigo">Intermediate</Badge>
              <Badge variant="amber">Pending</Badge>
              <Badge variant="rose">Abandoned</Badge>
              <Badge variant="sky">Cardio</Badge>
              <Badge variant="purple">Streak 7 Days</Badge>
              <Badge variant="neutral">Draft</Badge>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Modals & Dialogs</CardTitle>
            </CardHeader>
            <CardBody className="flex gap-3">
              <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                Open Standard Modal
              </Button>
              <Button variant="danger" onClick={() => setIsConfirmOpen(true)}>
                Open Confirm Dialog
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Skeletons & Empty States */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Loading Skeleton</CardTitle>
            </CardHeader>
            <CardBody>
              <CardSkeleton />
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Empty State</CardTitle>
            </CardHeader>
            <CardBody>
              <EmptyState
                title="No workouts recorded"
                description="Start your fitness journey by creating your first workout log."
                actionLabel="Create Workout"
                onAction={() => toast.info('Navigating to create workout...')}
              />
            </CardBody>
          </Card>
        </div>

        {/* Modals */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Sample Modal Title"
          subtitle="This is a reusable accessible modal component."
        >
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">
              Modals backdrops automatically lock background scrolling and close when pressing Escape or clicking outside.
            </p>
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
              <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Close</Button>
              <Button variant="primary" iconLeft={CheckCircle2} onClick={() => setIsModalOpen(false)}>Save Changes</Button>
            </div>
          </div>
        </Modal>

        <ConfirmModal
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={() => {
            setIsConfirmOpen(false);
            toast.error('Item deleted!');
          }}
          title="Delete Workout Record?"
          message="Are you sure you want to permanently remove this workout entry? This action cannot be reversed."
        />
      </div>
    </div>
  );
}

export default App;

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Input, Select, Button } from '../ui';
import { updateFitnessProfileApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../api/axios';
import { Activity, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const FitnessProfileForm = () => {
  const { user, updateUser } = useAuthStore();
  const fp = user?.fitnessProfile || {};

  const [height, setHeight] = useState(fp.height || '');
  const [weight, setWeight] = useState(fp.weight || '');
  const [age, setAge] = useState(fp.age || '');
  const [gender, setGender] = useState(fp.gender || 'male');
  const [fitnessLevel, setFitnessLevel] = useState(fp.fitnessLevel || 'beginner');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      height: height ? Number(height) : undefined,
      weight: weight ? Number(weight) : undefined,
      age: age ? Number(age) : undefined,
      gender,
      fitnessLevel,
    };

    try {
      const res = await updateFitnessProfileApi(payload);
      updateUser({ fitnessProfile: res.data });
      toast.success(res.message || 'Fitness profile updated!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Physical & Fitness Attributes</CardTitle>
            <CardDescription>Update your height, weight, age, and training experience</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <Input
              label="Height (cm)"
              type="number"
              min="50"
              max="300"
              placeholder="e.g. 175"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
            <Input
              label="Weight (kg)"
              type="number"
              min="20"
              max="500"
              step="0.1"
              placeholder="e.g. 70"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
            <Input
              label="Age (Years)"
              type="number"
              min="10"
              max="120"
              placeholder="e.g. 25"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Select
              label="Gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
              ]}
            />
            <Select
              label="Fitness Experience Level"
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              options={[
                { value: 'beginner', label: 'Beginner (New to training)' },
                { value: 'intermediate', label: 'Intermediate (1-3 years)' },
                { value: 'advanced', label: 'Advanced (3+ years)' },
              ]}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
              Save Physical Profile
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

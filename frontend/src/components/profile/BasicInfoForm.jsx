import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardBody, Input, Button } from '../ui';
import { updateProfileApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../api/axios';
import { User, Mail, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const BasicInfoForm = () => {
  const { user, updateUser } = useAuthStore();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim()) errs.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Please enter a valid email address';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const res = await updateProfileApi({ name: name.trim(), email: email.trim() });
      updateUser({ name: res.data.name, email: res.data.email });
      toast.success(res.message || 'Profile information updated!');
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
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <User className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Update your display name and email address</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            iconLeft={User}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <Input
            label="Email Address"
            type="email"
            iconLeft={Mail}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
          />

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary" isLoading={isLoading} iconLeft={CheckCircle2}>
              Save Information
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
};

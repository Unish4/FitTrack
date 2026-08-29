import React from 'react';
import { ProfileHeaderCard } from '../../components/profile/ProfileHeaderCard';
import { BasicInfoForm } from '../../components/profile/BasicInfoForm';
import { FitnessProfileForm } from '../../components/profile/FitnessProfileForm';
import { ChangePasswordForm } from '../../components/profile/ChangePasswordForm';
import { User } from 'lucide-react';

export const ProfilePage = () => {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <User className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Profile & Settings
          </h1>
          <p className="text-xs text-slate-400">
            Manage your personal data, avatar image, physical attributes, and account security
          </p>
        </div>
      </div>

      {/* Profile Header Avatar Card */}
      <ProfileHeaderCard />

      {/* Main Grid Forms */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <BasicInfoForm />
          <ChangePasswordForm />
        </div>
        <div>
          <FitnessProfileForm />
        </div>
      </div>
    </div>
  );
};

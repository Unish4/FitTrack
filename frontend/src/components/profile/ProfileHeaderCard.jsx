import React, { useRef, useState } from 'react';
import { Card, Badge, Button } from '../ui';
import { uploadAvatarApi, deleteAvatarApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/authStore';
import { getErrorMessage } from '../../api/axios';
import { Camera, Trash2, Shield, Flame, Dumbbell } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const ProfileHeaderCard = () => {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const getInitials = (name) => {
    if (!name) return 'FT';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const res = await uploadAvatarApi(formData);
      updateUser({ avatar: res.data.avatar });
      toast.success(res.message || 'Avatar uploaded successfully!');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = '';
    }
  };

  const handleDeleteAvatar = async () => {
    setIsUploading(true);
    try {
      const res = await deleteAvatarApi();
      updateUser({ avatar: { url: '', publicId: '' } });
      toast.success(res.message || 'Avatar removed');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/20 border-slate-800">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
          {/* Avatar Container */}
          <div className="relative group">
            {user?.avatar?.url ? (
              <img
                src={user.avatar.url}
                alt={user.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-emerald-500/40 shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-black text-xl shadow-xl">
                {getInitials(user?.name)}
              </div>
            )}

            {/* Hidden Input */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold cursor-pointer"
            >
              <Camera className="w-5 h-5 text-emerald-400" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-extrabold text-white">{user?.name}</h2>
              <Badge variant={user?.role === 'admin' ? 'purple' : 'emerald'} size="sm">
                {user?.role === 'admin' ? (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3" /> Admin
                  </span>
                ) : (
                  'Member'
                )}
              </Badge>
            </div>
            <p className="text-xs text-slate-400 font-medium">{user?.email}</p>

            {/* Avatar Buttons */}
            <div className="flex items-center justify-center sm:justify-start space-x-2 pt-1">
              <Button
                variant="ghost"
                size="sm"
                iconLeft={Camera}
                isLoading={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                Change Avatar
              </Button>
              {user?.avatar?.publicId && (
                <Button
                  variant="ghost"
                  size="sm"
                  iconLeft={Trash2}
                  isDisabled={isUploading}
                  onClick={handleDeleteAvatar}
                  className="text-rose-400 hover:text-rose-300 hover:bg-rose-500/10"
                >
                  Remove
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center space-x-4 p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl">
          <div className="text-center px-3 border-r border-slate-800">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Streak
            </span>
            <p className="text-lg font-black text-amber-400 mt-0.5">{user?.streak || 0} Days</p>
          </div>
          <div className="text-center px-3">
            <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
              <Dumbbell className="w-3.5 h-3.5 text-emerald-400" /> Workouts
            </span>
            <p className="text-lg font-black text-white mt-0.5">{user?.totalWorkouts || 0}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

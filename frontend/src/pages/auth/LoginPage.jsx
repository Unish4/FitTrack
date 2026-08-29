import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card, CardBody } from '../../components/ui';
import { Activity, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const { login, isLoading, error } = useAuthStore();
  const navigate = useNavigate();

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header Branding */}
        <div className="text-center space-y-3">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 shadow-xl">
            <Activity className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Welcome back to <span className="text-emerald-400">FitTrack</span>
          </h1>
          <p className="text-sm text-slate-400">
            Log in to track your workouts and monitor progress
          </p>
        </div>

        {/* Login Form Card */}
        <Card className="border-slate-800 bg-slate-900/90 shadow-2xl">
          <CardBody className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-medium text-rose-300">
                  {error}
                </div>
              )}

              <Input
                label="Email Address"
                type="email"
                iconLeft={Mail}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={formErrors.email}
                autoComplete="email"
              />

              <div className="space-y-1">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  iconLeft={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={formErrors.password}
                  autoComplete="current-password"
                  iconRight={() => (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-slate-400 hover:text-slate-200 transition-colors focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                iconRight={ArrowRight}
                className="mt-2"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="font-semibold text-emerald-400 hover:text-emerald-300 transition-colors ml-1"
                >
                  Create Account
                </Link>
              </p>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

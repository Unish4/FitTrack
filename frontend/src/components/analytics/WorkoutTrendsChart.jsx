import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui';
import { Calendar } from 'lucide-react';

export const WorkoutTrendsChart = ({ dailyTrend = [] }) => {
  // Format daily trend data for Recharts
  const chartData = dailyTrend.map((item) => {
    const { year, month, day } = item._id || {};
    const dateStr = year && month && day ? `${month}/${day}` : 'Date';
    return {
      date: dateStr,
      duration: item.totalDuration || 0,
      workouts: item.workoutCount || 0,
    };
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>30-Day Activity Trend</CardTitle>
            <CardDescription>Daily workout duration & frequency</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex-1 p-4 sm:p-6 min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No activity trend data logged in the past 30 days.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDuration" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Area
                type="monotone"
                dataKey="duration"
                name="Duration (mins)"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorDuration)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};

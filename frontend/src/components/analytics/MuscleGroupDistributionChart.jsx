import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui';
import { Dumbbell } from 'lucide-react';

const BAR_COLORS = [
  '#10b981', // emerald
  '#6366f1', // indigo
  '#06b6d4', // cyan
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#f43f5e', // rose
  '#3b82f6', // blue
];

export const MuscleGroupDistributionChart = ({ muscleGroups = [] }) => {
  const chartData = muscleGroups.map((item) => ({
    name: item._id ? item._id.toUpperCase() : 'OTHER',
    sets: item.totalSets || 0,
    exercises: item.exerciseCount || 0,
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Muscle Group Breakdown</CardTitle>
            <CardDescription>Total sets targeted by muscle group</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex-1 p-4 sm:p-6 min-h-[300px]">
        {chartData.length === 0 ? (
          <div className="h-full flex items-center justify-center text-xs text-slate-500 italic">
            No muscle group data recorded.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
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
              <Bar dataKey="sets" name="Total Sets" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};

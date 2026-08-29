import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardBody } from '../ui';
import { Activity } from 'lucide-react';

const TYPE_COLORS = {
  strength: '#6366f1',
  cardio: '#06b6d4',
  flexibility: '#a855f7',
  mixed: '#10b981',
  other: '#64748b',
};

export const WorkoutTypePieChart = ({ byType = [] }) => {
  const chartData = byType.map((item) => ({
    name: item._id ? item._id.toUpperCase() : 'OTHER',
    value: item.count || 0,
    color: TYPE_COLORS[item._id] || TYPE_COLORS.other,
  }));

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <CardTitle>Workout Type Split</CardTitle>
            <CardDescription>Distribution of training categories</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardBody className="flex-1 p-4 sm:p-6 min-h-[300px] flex items-center justify-center">
        {chartData.length === 0 ? (
          <div className="text-xs text-slate-500 italic">No workout type data logged.</div>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem',
                  color: '#f8fafc',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-xs text-slate-300 font-semibold">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardBody>
    </Card>
  );
};

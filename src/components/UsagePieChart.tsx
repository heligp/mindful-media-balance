
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { UsageData } from '@/types';
import { formatTime } from '@/lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface UsagePieChartProps {
  data: UsageData[];
  title?: string;
}

const UsagePieChart: React.FC<UsagePieChartProps> = ({ data, title = "Today's Usage" }) => {
  const totalTime = data.reduce((sum, app) => sum + app.timeInMillis, 0);
  
  // Format data for the chart
  const chartData = data.map(app => ({
    name: app.appName,
    value: app.timeInMillis,
    color: app.color,
  }));
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = ((data.value / totalTime) * 100).toFixed(1);
      
      return (
        <div className="bg-background p-2 rounded-md shadow-md border">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm">{formatTime(data.value)}</p>
          <p className="text-xs text-muted-foreground">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {totalTime > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-gray-500">No usage data yet</p>
          </div>
        )}
        
        <div className="mt-4">
          <p className="text-sm font-medium">Total Time: {formatTime(totalTime)}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsagePieChart;

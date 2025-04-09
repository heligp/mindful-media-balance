
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { formatTime } from '@/lib/mockData';

interface WeeklyUsageBarChartProps {
  data: { [key: string]: any[] };
}

const UsageBarChart: React.FC<WeeklyUsageBarChartProps> = ({ data }) => {
  // Transform data for the chart
  const chartData = Object.keys(data).map(day => {
    const dayData = data[day];
    const result: any = { name: day.substring(0, 3) };
    
    dayData.forEach(app => {
      result[app.appName] = app.timeInMillis / (60 * 1000); // Convert to minutes
    });
    
    return result;
  });
  
  // Get all app names
  const appNames = Object.values(data)[0].map(app => app.appName);
  
  // Get colors for each app
  const appColors: { [key: string]: string } = {};
  Object.values(data)[0].forEach(app => {
    appColors[app.appName] = app.color;
  });
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background p-3 rounded shadow-lg border">
          <p className="font-medium">{label}</p>
          <div className="mt-1">
            {payload.map((entry: any, index: number) => (
              <p key={`tooltip-${index}`} style={{ color: entry.color }} className="text-sm">
                {entry.name}: {formatTime(entry.value * 60 * 1000)}
              </p>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Weekly Usage</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => `${value}m`} 
                label={{ value: 'Minutes', angle: -90, position: 'insideLeft', dy: 50 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {appNames.map((app, index) => (
                <Bar 
                  key={app} 
                  dataKey={app} 
                  stackId="a" 
                  fill={appColors[app]} 
                  name={app} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default UsageBarChart;

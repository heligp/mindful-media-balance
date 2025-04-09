
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UsageBarChart from '@/components/UsageBarChart';
import UsagePieChart from '@/components/UsagePieChart';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import { TrendingUp, TrendingDown, Clock } from 'lucide-react';

const StatsPage = () => {
  const { weeklyUsage, todayUsage } = useApp();
  const [timeFrame, setTimeFrame] = useState<'day' | 'week'>('day');
  
  // Calculate some stats
  const calculateTrends = () => {
    const days = Object.keys(weeklyUsage);
    if (days.length < 2) return { trend: 'neutral', percentage: 0 };
    
    const yesterday = days[days.length - 2];
    const today = days[days.length - 1];
    
    const yesterdayTotal = weeklyUsage[yesterday].reduce((sum, app) => sum + app.timeInMillis, 0);
    const todayTotal = weeklyUsage[today].reduce((sum, app) => sum + app.timeInMillis, 0);
    
    const diff = todayTotal - yesterdayTotal;
    const percentage = yesterdayTotal === 0 ? 0 : (diff / yesterdayTotal) * 100;
    
    return {
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
      percentage: Math.abs(percentage).toFixed(1)
    };
  };
  
  const trend = calculateTrends();
  
  // Get the day with highest and lowest usage
  const getExtremeUsageDays = () => {
    const days = Object.keys(weeklyUsage);
    if (days.length === 0) return { highest: null, lowest: null };
    
    let highestDay = days[0];
    let lowestDay = days[0];
    let highestUsage = 0;
    let lowestUsage = Infinity;
    
    days.forEach(day => {
      const total = weeklyUsage[day].reduce((sum, app) => sum + app.timeInMillis, 0);
      if (total > highestUsage) {
        highestUsage = total;
        highestDay = day;
      }
      if (total < lowestUsage) {
        lowestUsage = total;
        lowestDay = day;
      }
    });
    
    return {
      highest: { day: highestDay, usage: highestUsage },
      lowest: { day: lowestDay, usage: lowestUsage }
    };
  };
  
  const extremeDays = getExtremeUsageDays();

  return (
    <div className="min-h-screen pb-24">
      <div className="container max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Usage Statistics</h1>
          <p className="text-muted-foreground">Track your usage patterns over time</p>
        </header>
        
        <Tabs value={timeFrame} onValueChange={(v) => setTimeFrame(v as 'day' | 'week')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="day">Today</TabsTrigger>
            <TabsTrigger value="week">This Week</TabsTrigger>
          </TabsList>
          
          <TabsContent value="day" className="space-y-6">
            <Card className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Today's Trend</CardTitle>
                <CardDescription>Compared to yesterday</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  {trend.trend === 'up' ? (
                    <>
                      <TrendingUp className="h-5 w-5 text-destructive mr-2" />
                      <span className="text-destructive font-medium">{trend.percentage}% increase in usage</span>
                    </>
                  ) : trend.trend === 'down' ? (
                    <>
                      <TrendingDown className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-600 font-medium">{trend.percentage}% decrease in usage</span>
                    </>
                  ) : (
                    <span>No significant change</span>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <UsagePieChart data={todayUsage} title="Today's Usage Breakdown" />
          </TabsContent>
          
          <TabsContent value="week" className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Highest Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {extremeDays.highest && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-destructive" />
                      <div>
                        <p className="font-medium">{extremeDays.highest.day}</p>
                        <p className="text-xs text-muted-foreground">
                          {(extremeDays.highest.usage / (60 * 1000)).toFixed(0)} minutes
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-muted/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Lowest Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  {extremeDays.lowest && (
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      <div>
                        <p className="font-medium">{extremeDays.lowest.day}</p>
                        <p className="text-xs text-muted-foreground">
                          {(extremeDays.lowest.usage / (60 * 1000)).toFixed(0)} minutes
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            <UsageBarChart data={weeklyUsage} />
          </TabsContent>
        </Tabs>
      </div>
      
      <Navbar />
    </div>
  );
};

export default StatsPage;

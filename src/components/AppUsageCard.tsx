
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { UsageData } from '@/types';
import { useApp } from '@/contexts/AppContext';
import { Clock, AlertCircle, Lock } from 'lucide-react';

interface AppUsageCardProps {
  app: UsageData;
}

const AppUsageCard: React.FC<AppUsageCardProps> = ({ app }) => {
  const { userSettings, formatTime, updateDailyLimit, lockApp } = useApp();
  
  const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
  const usagePercentage = Math.min(100, (app.timeInMillis / limitInMs) * 100);
  const remainingTimeMs = Math.max(0, limitInMs - app.timeInMillis);
  
  const handleLimitChange = (value: number[]) => {
    const newLimitMinutes = value[0];
    updateDailyLimit(app.appName, newLimitMinutes);
  };
  
  // Determine status color based on usage percentage
  const getStatusColor = () => {
    if (usagePercentage >= 100) return 'bg-destructive';
    if (usagePercentage >= 75) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  const appIcon = () => {
    switch (app.appName) {
      case 'Instagram':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: app.color }}>
            <span className="text-white text-lg font-bold">IG</span>
          </div>
        );
      case 'Facebook':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: app.color }}>
            <span className="text-white text-lg font-bold">FB</span>
          </div>
        );
      case 'TikTok':
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: app.color }}>
            <span className="text-white text-lg font-bold">TT</span>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-400">
            <span className="text-white text-lg font-bold">?</span>
          </div>
        );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 flex flex-row items-center space-x-2">
        {appIcon()}
        <div className="flex-1">
          <CardTitle className="text-base">{app.appName}</CardTitle>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>Daily Limit: {userSettings.dailyLimits[app.appName] || 60} minutes</span>
          </div>
        </div>
        {usagePercentage >= 100 && (
          <Button 
            size="sm" 
            variant="outline"
            className="flex items-center text-destructive border-destructive"
            onClick={() => lockApp(app.appName)}
          >
            <Lock size={14} className="mr-1" />
            Lock
          </Button>
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium">
            Used: {formatTime(app.timeInMillis)}
          </span>
          <span className="text-sm font-medium">
            Remaining: {formatTime(remainingTimeMs)}
          </span>
        </div>
        
        <Progress 
          value={usagePercentage} 
          className={`h-2 ${getStatusColor()}`} 
        />
        
        {usagePercentage >= 90 && (
          <div className="mt-2 flex items-center text-destructive text-xs">
            <AlertCircle size={12} className="mr-1" />
            {usagePercentage >= 100 ? 'Limit exceeded!' : 'Approaching limit!'}
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-1">
        <div className="w-full">
          <div className="flex justify-between text-xs mb-1">
            <span>Set daily limit:</span>
            <span>{userSettings.dailyLimits[app.appName] || 60} min</span>
          </div>
          <Slider
            defaultValue={[userSettings.dailyLimits[app.appName] || 60]}
            max={240}
            min={15}
            step={15}
            onValueChange={handleLimitChange}
          />
        </div>
      </CardFooter>
    </Card>
  );
};

export default AppUsageCard;

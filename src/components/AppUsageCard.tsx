
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Lock, Info } from 'lucide-react';
import { UsageData } from '@/types';
import { formatTime } from '@/lib/mockData';
import { useApp } from '@/contexts/AppContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AppUsageCardProps {
  app: UsageData;
}

const AppUsageCard: React.FC<AppUsageCardProps> = ({ app }) => {
  const { userSettings, lockApp, hasDeviceAdminPermission, requestDeviceAdminPermission } = useApp();
  
  const limitInMinutes = userSettings.dailyLimits[app.appName] || 60; // Default to 60 minutes if not set
  const limitInMs = limitInMinutes * 60 * 1000;
  const percentUsed = (app.timeInMillis / limitInMs) * 100;
  const isOverLimit = percentUsed > 100;
  
  // Calculate remaining time
  const remainingMs = isOverLimit ? 0 : limitInMs - app.timeInMillis;
  const remainingFormatted = formatTime(remainingMs);

  const handleLockClick = () => {
    if (!hasDeviceAdminPermission) {
      requestDeviceAdminPermission();
      return;
    }
    lockApp(app.appName);
  };
  
  return (
    <Card className={`overflow-hidden ${isOverLimit ? 'border-red-400' : ''}`}>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div 
              className="w-3 h-3 rounded-full mr-2" 
              style={{ backgroundColor: app.color }}
            ></div>
            <h3 className="font-medium">{app.appName}</h3>
          </div>
          <div className="text-sm font-medium">
            {formatTime(app.timeInMillis)}
            <span className="text-muted-foreground text-xs ml-1">
              / {limitInMinutes}m
            </span>
          </div>
        </div>
        
        <Progress 
          value={Math.min(percentUsed, 100)} 
          className={`h-2 ${isOverLimit ? 'bg-red-100' : 'bg-gray-100'}`}
        />
        
        <div className="flex justify-between mt-2">
          <span className="text-xs text-muted-foreground">
            {isOverLimit ? 'Limit exceeded' : `${remainingFormatted} remaining`}
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  size="sm" 
                  variant={isOverLimit ? "destructive" : "outline"} 
                  className={`text-xs h-7 px-2 ${!hasDeviceAdminPermission ? 'opacity-70' : ''}`}
                  onClick={handleLockClick}
                >
                  <Lock className="h-3 w-3 mr-1" />
                  {isOverLimit ? 'Lock Now' : 'Block App'}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {hasDeviceAdminPermission 
                  ? (isOverLimit ? "Lock this app immediately" : "Block this app temporarily") 
                  : "Requires Device Admin permission"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};

export default AppUsageCard;

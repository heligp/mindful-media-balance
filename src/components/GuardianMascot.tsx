
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Eye, AlertTriangle, ThumbsUp } from 'lucide-react';

const GuardianMascot: React.FC = () => {
  const { todayUsage, userSettings } = useApp();
  
  // Calculate if any app has exceeded its limit
  const anyAppExceeded = todayUsage.some(app => {
    const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
    return app.timeInMillis > limitInMs;
  });
  
  // Calculate overall usage percentage
  const totalTimeMs = todayUsage.reduce((sum, app) => sum + app.timeInMillis, 0);
  const totalLimitMs = todayUsage.reduce((sum, app) => {
    const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
    return sum + limitInMs;
  }, 0);
  const overallPercentage = (totalTimeMs / totalLimitMs) * 100;
  
  // Determine the mascot's message
  const getMessage = () => {
    if (anyAppExceeded) {
      return "I see you're exceeding some limits! Let's try to cut back a bit.";
    } else if (overallPercentage > 75) {
      return "You're approaching your limits. I'm watching you!";
    } else {
      return "Great job! You're managing your screen time well today.";
    }
  };
  
  // Determine the mascot's icon
  const getIcon = () => {
    if (anyAppExceeded) {
      return <AlertTriangle className="text-amber-500" />;
    } else if (overallPercentage > 75) {
      return <Eye className="text-blue-500" />;
    } else {
      return <ThumbsUp className="text-green-500" />;
    }
  };

  return (
    <Card className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-indigo-200 dark:border-indigo-800">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white">
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium">Guardian Says:</h3>
            <p className="text-sm">{getMessage()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GuardianMascot;

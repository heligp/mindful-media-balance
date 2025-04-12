
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Trophy, Award, TrendingUp, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PointsDisplay: React.FC = () => {
  const { userStats } = useApp();

  return (
    <Card className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Trophy size={18} className="mr-2" />
          Guardian Points
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={14} className="ml-2 cursor-help opacity-70" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Earn +10 points for every 30 minutes under your limit</p>
                <p>Earn +50 points for blocking apps when prompted</p>
                <p>Lose 5 points when you exceed your daily limit</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-4 flex items-center justify-center">
          {userStats.points} 
          <span className="text-sm ml-2 opacity-80">points</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="flex items-center">
            <Award size={14} className="mr-1" />
            <span>Current Streak: {userStats.streak} days</span>
          </div>
          <div className="flex items-center">
            <TrendingUp size={14} className="mr-1" />
            <span>Best Streak: {userStats.highestStreak} days</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDisplay;

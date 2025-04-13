
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useApp } from '@/contexts/AppContext';
import { Coins, Award, Zap } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipTrigger 
} from '@/components/ui/tooltip';
import { HoverCard, HoverCardTrigger, HoverCardContent } from '@/components/ui/hover-card';

const FocusCoinsDisplay: React.FC = () => {
  const { focusCoins } = useApp();
  
  // For demo purposes, let's set some milestone values
  const nextMilestone = Math.ceil(focusCoins / 100) * 100;
  const progress = (focusCoins % 100) / 100 * 100;

  return (
    <Card className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Coins size={18} className="mr-2" />
            FocusCoins
          </div>
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="cursor-help opacity-80 hover:opacity-100 transition-opacity">
                <Award size={18} />
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="space-y-2">
                <h4 className="font-medium">How to Earn FocusCoins</h4>
                <ul className="text-sm space-y-1">
                  <li className="flex items-center">
                    <Zap size={14} className="mr-1" />
                    <span>+10 coins every 15 minutes under your limit</span>
                  </li>
                  <li className="flex items-center">
                    <Zap size={14} className="mr-1" />
                    <span>+50 coins for taking breaks when suggested</span>
                  </li>
                  <li className="flex items-center">
                    <Zap size={14} className="mr-1" />
                    <span>+100 coins for completing daily challenges</span>
                  </li>
                </ul>
              </div>
            </HoverCardContent>
          </HoverCard>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-3 flex items-center justify-center">
          {focusCoins} 
          <span className="text-sm ml-2 opacity-80">coins</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span>Progress to next reward</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-yellow-300/30" />
          <div className="text-xs text-center">
            {focusCoins}/{nextMilestone} coins to unlock next reward
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FocusCoinsDisplay;

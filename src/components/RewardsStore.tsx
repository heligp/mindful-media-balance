
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, ShoppingCart, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const RewardsStore: React.FC = () => {
  const { rewardItems, userStats, purchaseReward } = useApp();
  
  // Filter rewards
  const availableRewards = rewardItems.filter(item => !item.unlocked);
  const unlockedRewards = rewardItems.filter(item => item.unlocked);

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <ShoppingCart size={18} className="mr-2" />
          Rewards Store
        </CardTitle>
        <CardDescription>Spend your points to unlock rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="available">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="available">Available</TabsTrigger>
            <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
          </TabsList>
          
          <TabsContent value="available">
            <ScrollArea className="h-[270px] pr-3 -mr-3">
              <div className="space-y-3 mt-2">
                {availableRewards.map((reward) => (
                  <Card key={reward.id} className="bg-secondary">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-sm">{reward.name}</CardTitle>
                      <CardDescription className="text-xs">{reward.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3 pt-2 flex justify-between items-center">
                      <div className="flex items-center">
                        <Trophy size={14} className="mr-1 text-mindful-purple" />
                        <span className="text-xs font-medium">{reward.pointCost} points</span>
                      </div>
                      <Button 
                        size="sm" 
                        variant={userStats.points >= reward.pointCost ? "default" : "outline"}
                        onClick={() => purchaseReward(reward.id)}
                        disabled={userStats.points < reward.pointCost}
                        className={userStats.points >= reward.pointCost ? "bg-mindful-purple hover:bg-mindful-purple-dark" : ""}
                      >
                        Unlock
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
                
                {availableRewards.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>You've unlocked all rewards!</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="unlocked">
            <ScrollArea className="h-[270px] pr-3 -mr-3">
              <div className="space-y-3 mt-2">
                {unlockedRewards.map((reward) => (
                  <Card key={reward.id} className="bg-mindful-green bg-opacity-30">
                    <CardHeader className="p-3 pb-0">
                      <CardTitle className="text-sm flex items-center">
                        <Check size={14} className="mr-1 text-green-600" />
                        {reward.name}
                      </CardTitle>
                      <CardDescription className="text-xs">{reward.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="p-3 pt-2">
                      <span className="text-xs text-green-600 font-medium">Unlocked</span>
                    </CardFooter>
                  </Card>
                ))}
                
                {unlockedRewards.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p>No rewards unlocked yet</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RewardsStore;

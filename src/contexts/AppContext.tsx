
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UsageData, UserSettings, UserStats, RewardItem } from '@/types';
import { 
  generateMockUsageData, 
  generateWeeklyUsageData, 
  defaultUserSettings,
  defaultUserStats,
  rewardItems as mockRewardItems,
  formatTime
} from '@/lib/mockData';
import { toast } from '@/components/ui/use-toast';

interface AppContextType {
  todayUsage: UsageData[];
  weeklyUsage: { [key: string]: UsageData[] };
  userSettings: UserSettings;
  userStats: UserStats;
  rewardItems: RewardItem[];
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateDailyLimit: (appName: string, limitInMinutes: number) => void;
  purchaseReward: (rewardId: string) => void;
  formatTime: (ms: number) => string;
  checkAndTriggerNotifications: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayUsage, setTodayUsage] = useState<UsageData[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<{ [key: string]: UsageData[] }>({});
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>(mockRewardItems);

  // Initialize mock data
  useEffect(() => {
    const usage = generateMockUsageData();
    const weekly = generateWeeklyUsageData();
    setTodayUsage(usage);
    setWeeklyUsage(weekly);
    
    // Simulate data updates every minute (for demo purposes)
    const interval = setInterval(() => {
      setTodayUsage(prevUsage => {
        return prevUsage.map(app => ({
          ...app,
          timeInMillis: app.timeInMillis + (Math.random() * 60 * 1000) // Add 0-60 seconds
        }));
      });
      
      // Check if notifications should be triggered
      checkAndTriggerNotifications();
      
    }, 60000); // every minute
    
    return () => clearInterval(interval);
  }, []);

  // Update user settings
  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

  // Update daily limit for an app
  const updateDailyLimit = (appName: string, limitInMinutes: number) => {
    setUserSettings(prev => ({
      ...prev,
      dailyLimits: {
        ...prev.dailyLimits,
        [appName]: limitInMinutes
      }
    }));
    
    toast({
      title: "Limit Updated",
      description: `New daily limit for ${appName}: ${limitInMinutes} minutes`,
    });
  };

  // Purchase a reward with points
  const purchaseReward = (rewardId: string) => {
    const reward = rewardItems.find(item => item.id === rewardId);
    
    if (reward && !reward.unlocked && userStats.points >= reward.pointCost) {
      // Update user stats
      setUserStats(prev => ({
        ...prev,
        points: prev.points - reward.pointCost,
        rewards: [...prev.rewards, rewardId]
      }));
      
      // Update reward items
      setRewardItems(prev => 
        prev.map(item => 
          item.id === rewardId ? { ...item, unlocked: true } : item
        )
      );
      
      toast({
        title: "Reward Unlocked!",
        description: `You've unlocked: ${reward.name}`,
      });
    } else if (reward && userStats.points < reward.pointCost) {
      toast({
        title: "Not Enough Points",
        description: `You need ${reward.pointCost - userStats.points} more points to unlock this reward.`,
        variant: "destructive",
      });
    }
  };

  // Check if we need to send notifications
  const checkAndTriggerNotifications = () => {
    if (!userSettings.notificationsEnabled) return;
    
    todayUsage.forEach(app => {
      const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
      const percentUsed = (app.timeInMillis / limitInMs) * 100;
      
      if (percentUsed >= 90 && percentUsed < 100) {
        toast({
          title: `Almost at ${app.appName} Limit`,
          description: `You've used ${Math.round(percentUsed)}% of your daily limit.`,
        });
      } else if (percentUsed >= 100) {
        toast({
          title: `${app.appName} Limit Exceeded!`,
          description: `Consider taking a break from ${app.appName}.`,
          variant: "destructive",
          action: (
            <div className="flex space-x-2 mt-2">
              <button 
                onClick={() => console.log('Block Now clicked')} 
                className="bg-destructive text-destructive-foreground py-1 px-3 rounded-md text-xs"
              >
                Block Now
              </button>
              <button 
                onClick={() => console.log('Snooze clicked')} 
                className="bg-secondary text-secondary-foreground py-1 px-3 rounded-md text-xs"
              >
                Snooze
              </button>
            </div>
          ),
        });
        
        // Deduct points for exceeding limit
        setUserStats(prev => ({
          ...prev,
          points: Math.max(0, prev.points - 5)
        }));
      }
    });
  };

  const value = {
    todayUsage,
    weeklyUsage,
    userSettings,
    userStats,
    rewardItems,
    updateUserSettings,
    updateDailyLimit,
    purchaseReward,
    formatTime,
    checkAndTriggerNotifications,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

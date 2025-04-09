
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
  lockApp: (appName: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayUsage, setTodayUsage] = useState<UsageData[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<{ [key: string]: UsageData[] }>({});
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>(mockRewardItems);
  const [lastPointUpdate, setLastPointUpdate] = useState<Date>(new Date());

  // Initialize mock data
  useEffect(() => {
    const usage = generateMockUsageData();
    const weekly = generateWeeklyUsageData();
    setTodayUsage(usage);
    setWeeklyUsage(weekly);
    
    // Simulate data updates every 15 minutes (for demo, we'll use a shorter interval)
    const interval = setInterval(() => {
      console.log("Updating usage data (simulating 15-minute interval)");
      setTodayUsage(prevUsage => {
        return prevUsage.map(app => ({
          ...app,
          timeInMillis: app.timeInMillis + (Math.random() * 10 * 60 * 1000) // Add 0-10 minutes
        }));
      });
      
      // Check if notifications should be triggered
      checkAndTriggerNotifications();
      
      // Award points for staying under limits
      updatePointsForUsage();
      
    }, 60000); // Every minute for demo purposes, would be 900000 (15 minutes) in production
    
    return () => clearInterval(interval);
  }, []);
  
  // Update points based on usage compared to limits
  const updatePointsForUsage = () => {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastPointUpdate.getTime();
    
    // Only update points every 5 minutes (for demo purposes)
    if (timeSinceLastUpdate < 5 * 60 * 1000) return;
    
    let pointsEarned = 0;
    
    todayUsage.forEach(app => {
      const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
      
      if (app.timeInMillis <= limitInMs) {
        // Award points for being under limit (10 points per 30 minutes under)
        const minutesUnderLimit = (limitInMs - app.timeInMillis) / (60 * 1000);
        const pointsForApp = Math.floor(minutesUnderLimit / 30) * 10;
        pointsEarned += pointsForApp;
      } else {
        // Deduct points for exceeding limit (5 points per app over limit)
        pointsEarned -= 5;
      }
    });
    
    if (pointsEarned !== 0) {
      setUserStats(prev => ({
        ...prev,
        points: Math.max(0, prev.points + pointsEarned)
      }));
      
      // Only show toast if points have changed
      if (pointsEarned > 0) {
        toast({
          title: "Points Earned!",
          description: `+${pointsEarned} points for responsible usage.`,
        });
      } else if (pointsEarned < 0) {
        toast({
          title: "Points Deducted",
          description: `${pointsEarned} points for exceeding limits.`,
          variant: "destructive",
        });
      }
    }
    
    setLastPointUpdate(now);
  };

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
                onClick={() => lockApp(app.appName)} 
                className="bg-destructive text-destructive-foreground py-1 px-3 rounded-md text-xs"
              >
                Lock Now
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
  
  // Mock app locking function (would integrate with DevicePolicyManager in a real Android app)
  const lockApp = (appName: string) => {
    toast({
      title: "App Locking Attempted",
      description: `In a native app, this would lock ${appName} using DevicePolicyManager.`,
    });
    
    // Show a follow-up toast with instructions
    setTimeout(() => {
      toast({
        title: "Root Permissions Required",
        description: "On a real device, you would need to grant root permissions for app locking.",
      });
    }, 2000);
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
    lockApp,
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

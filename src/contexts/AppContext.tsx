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
  requestUsageStatsPermission: () => void;
  requestDeviceAdminPermission: () => void;
  hasUsageStatsPermission: boolean;
  hasDeviceAdminPermission: boolean;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todayUsage, setTodayUsage] = useState<UsageData[]>([]);
  const [weeklyUsage, setWeeklyUsage] = useState<{ [key: string]: UsageData[] }>({});
  const [userSettings, setUserSettings] = useState<UserSettings>(defaultUserSettings);
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [rewardItems, setRewardItems] = useState<RewardItem[]>(mockRewardItems);
  const [lastPointUpdate, setLastPointUpdate] = useState<Date>(new Date());
  const [hasUsageStatsPermission, setHasUsageStatsPermission] = useState(false);
  const [hasDeviceAdminPermission, setHasDeviceAdminPermission] = useState(false);

  useEffect(() => {
    const usage = generateMockUsageData();
    const weekly = generateWeeklyUsageData();
    setTodayUsage(usage);
    setWeeklyUsage(weekly);
    
    const interval = setInterval(() => {
      console.log("Updating usage data (simulating 15-minute interval)");
      setTodayUsage(prevUsage => {
        return prevUsage.map(app => ({
          ...app,
          timeInMillis: app.timeInMillis + (Math.random() * 10 * 60 * 1000)
        }));
      });
      
      checkAndTriggerNotifications();
      
      updatePointsForUsage();
      
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const requestUsageStatsPermission = () => {
    toast({
      title: "Requesting Usage Stats Permission",
      description: "On a real device, this would open system settings to grant permission.",
    });
    
    setTimeout(() => {
      setHasUsageStatsPermission(true);
      toast({
        title: "Permission Granted",
        description: "Usage stats permission granted successfully.",
        variant: "success",
      });
    }, 2000);
  };

  const requestDeviceAdminPermission = () => {
    toast({
      title: "Requesting Device Admin Permission",
      description: "On a real device, this would prompt to add device admin.",
    });
    
    setTimeout(() => {
      setHasDeviceAdminPermission(true);
      toast({
        title: "Permission Granted",
        description: "Device admin permission granted successfully.",
        variant: "success",
      });
    }, 2000);
  };

  const lockApp = (appName: string) => {
    if (hasDeviceAdminPermission) {
      toast({
        title: "App Locked",
        description: `${appName} has been locked for 1 hour.`,
        variant: "success",
      });
      
      setUserStats(prev => ({
        ...prev,
        points: prev.points + 50
      }));
      
      toast({
        title: "Points Awarded",
        description: "+50 points for locking an app!",
      });
    } else {
      toast({
        title: "Permission Required",
        description: "Device admin permission is required to lock apps.",
        action: (
          <div className="mt-2">
            <button 
              onClick={requestDeviceAdminPermission} 
              className="bg-primary text-primary-foreground py-1 px-3 rounded-md text-xs"
            >
              Grant Permission
            </button>
          </div>
        ),
      });
    }
  };

  const updatePointsForUsage = () => {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastPointUpdate.getTime();
    
    if (timeSinceLastUpdate < 5 * 60 * 1000) return;
    
    let pointsEarned = 0;
    
    todayUsage.forEach(app => {
      const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
      
      if (app.timeInMillis <= limitInMs) {
        const minutesUnderLimit = (limitInMs - app.timeInMillis) / (60 * 1000);
        const pointsForApp = Math.floor(minutesUnderLimit / 30) * 10;
        pointsEarned += pointsForApp;
      } else {
        pointsEarned -= 5;
      }
    });
    
    if (pointsEarned !== 0) {
      setUserStats(prev => ({
        ...prev,
        points: Math.max(0, prev.points + pointsEarned)
      }));
      
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

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  };

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

  const purchaseReward = (rewardId: string) => {
    const reward = rewardItems.find(item => item.id === rewardId);
    
    if (reward && !reward.unlocked && userStats.points >= reward.pointCost) {
      setUserStats(prev => ({
        ...prev,
        points: prev.points - reward.pointCost,
        rewards: [...prev.rewards, rewardId]
      }));
      
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
    lockApp,
    requestUsageStatsPermission,
    requestDeviceAdminPermission,
    hasUsageStatsPermission,
    hasDeviceAdminPermission,
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

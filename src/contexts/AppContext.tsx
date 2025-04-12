import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { UsageData, UserSettings, UserStats, RewardItem } from '@/types';
import { 
  generateMockUsageData, 
  generateWeeklyUsageData, 
  defaultUserSettings,
  defaultUserStats,
  rewardItems as mockRewardItems,
  formatTime
} from '@/lib/mockData';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { 
  checkPermissions, 
  requestPermission, 
  blockApp, 
  isAppBlocked 
} from '@/lib/permissionManager';

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
  const [permissions, setPermissions] = useState(checkPermissions());
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in ms
  const DEMO_REFRESH_INTERVAL = 60 * 1000; // 1 minute in ms
  
  useEffect(() => {
    const storedPermissions = checkPermissions();
    setPermissions(storedPermissions);
  }, []);
  
  useEffect(() => {
    console.log("Starting background work simulation with optimized interval");
    
    const usage = generateMockUsageData();
    const weekly = generateWeeklyUsageData();
    setTodayUsage(usage);
    setWeeklyUsage(weekly);
    
    timerRef.current = setInterval(() => {
      console.log("Updating usage data (simulating 15-minute WorkManager interval)");
      
      setTodayUsage(prevUsage => {
        return prevUsage.map(app => {
          const usageIncrease = Math.random() * 15 * 60 * 1000;
          return {
            ...app,
            timeInMillis: app.timeInMillis + usageIncrease
          };
        });
      });
      
      checkAndTriggerNotifications();
      updatePointsForUsage();
      
    }, DEMO_REFRESH_INTERVAL);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const requestUsageStatsPermission = useCallback(async () => {
    const granted = await requestPermission('USAGE_STATS');
    if (granted) {
      setPermissions(prev => ({ ...prev, usageStats: true }));
    }
  }, []);

  const requestDeviceAdminPermission = useCallback(async () => {
    const granted = await requestPermission('DEVICE_ADMIN');
    if (granted) {
      setPermissions(prev => ({ ...prev, deviceAdmin: true }));
    }
  }, []);

  const lockApp = useCallback((appName: string) => {
    if (!permissions.deviceAdmin) {
      toast({
        title: "Permission Required",
        description: "Device admin permission is required to lock apps.",
        action: <Button size="sm" onClick={requestDeviceAdminPermission}>Grant Permission</Button>
      });
      return;
    }
    
    const success = blockApp(appName, 60 * 60 * 1000);
    
    if (success) {
      toast({
        title: "App Locked",
        description: `${appName} has been locked for 1 hour.`,
      });
      
      setUserStats(prev => ({
        ...prev,
        points: prev.points + 50
      }));
      
      toast({
        title: "Points Awarded",
        description: "+50 points for locking an app!",
      });
    }
  }, [permissions.deviceAdmin, requestDeviceAdminPermission]);

  const updatePointsForUsage = useCallback(() => {
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
  }, [lastPointUpdate, todayUsage, userSettings.dailyLimits]);

  const updateUserSettings = useCallback((settings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...settings }));
  }, []);

  const updateDailyLimit = useCallback((appName: string, limitInMinutes: number) => {
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
  }, []);

  const purchaseReward = useCallback((rewardId: string) => {
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
  }, [rewardItems, userStats.points, userStats.rewards]);

  const checkAndTriggerNotifications = useCallback(() => {
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
          action: <Button size="sm" variant="destructive" onClick={() => lockApp(app.appName)}>Lock Now</Button>
        });
        
        setUserStats(prev => ({
          ...prev,
          points: Math.max(0, prev.points - 5)
        }));
      }
    });
  }, [lockApp, todayUsage, userSettings.dailyLimits, userSettings.notificationsEnabled]);

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
    hasUsageStatsPermission: permissions.usageStats,
    hasDeviceAdminPermission: permissions.deviceAdmin,
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

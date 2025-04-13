
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
  focusCoins: number;
  addFocusCoins: (amount: number) => void;
  calculateScrollDistance: (app: string) => string;
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
  const [focusCoins, setFocusCoins] = useState<number>(0);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Update to 15 minutes interval (900,000ms) instead of the previous faster intervals
  const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes in ms
  const DEMO_REFRESH_INTERVAL = 60 * 1000; // 1 minute in ms for demo purposes
  
  useEffect(() => {
    const storedPermissions = checkPermissions();
    setPermissions(storedPermissions);
    
    // Load focus coins from localStorage
    const savedCoins = localStorage.getItem('focusCoins');
    if (savedCoins) {
      setFocusCoins(parseInt(savedCoins, 10));
    }
  }, []);
  
  useEffect(() => {
    console.log("Starting background work simulation with optimized 15-minute interval");
    
    // If no permission, show mock data
    const usage = generateMockUsageData();
    const weekly = generateWeeklyUsageData();
    setTodayUsage(usage);
    setWeeklyUsage(weekly);
    
    timerRef.current = setInterval(() => {
      console.log("Updating usage data (simulating 15-minute WorkManager interval)");
      
      setTodayUsage(prevUsage => {
        return prevUsage.map(app => {
          // For demo, random increase. In real app, this would be actual usage data
          const usageIncrease = Math.random() * 15 * 60 * 1000;
          return {
            ...app,
            timeInMillis: app.timeInMillis + usageIncrease
          };
        });
      });
      
      checkAndTriggerNotifications();
      updateFocusCoinsForUsage();
      
    }, DEMO_REFRESH_INTERVAL); // Using demo interval for faster feedback
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Save focus coins to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('focusCoins', focusCoins.toString());
  }, [focusCoins]);
  
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

  // New method to calculate scroll distance
  const calculateScrollDistance = useCallback((appName: string) => {
    const app = todayUsage.find(a => a.appName === appName);
    if (!app) return "0 m";
    
    // Average scroll per minute: ~300 pixels
    // Average human height: ~1.7m
    // Let's say 500 scrolls = 1km
    
    const minutesUsed = app.timeInMillis / (60 * 1000);
    const estimatedScrolls = minutesUsed * 70; // ~70 scrolls per minute
    const distanceInMeters = Math.round(estimatedScrolls * 2); // 2m per scroll
    
    if (distanceInMeters >= 1000) {
      return `${(distanceInMeters / 1000).toFixed(1)} km`;
    }
    
    return `${distanceInMeters} m`;
  }, [todayUsage]);

  // New method to add focus coins
  const addFocusCoins = useCallback((amount: number) => {
    setFocusCoins(prev => prev + amount);
    
    if (amount > 0) {
      toast({
        title: "FocusCoins Earned!",
        description: `+${amount} FocusCoins added to your account`,
      });
    }
  }, []);

  // Updated to award FocusCoins instead of generic points
  const updateFocusCoinsForUsage = useCallback(() => {
    const now = new Date();
    const timeSinceLastUpdate = now.getTime() - lastPointUpdate.getTime();
    
    // Only update every 5 minutes in demo (would be 15 minutes in production)
    if (timeSinceLastUpdate < 5 * 60 * 1000) return;
    
    let coinsEarned = 0;
    
    todayUsage.forEach(app => {
      const limitInMs = (userSettings.dailyLimits[app.appName] || 60) * 60 * 1000;
      
      if (app.timeInMillis <= limitInMs) {
        // Award 10 FocusCoins for every 15 minutes under limit
        const minutesUnderLimit = (limitInMs - app.timeInMillis) / (60 * 1000);
        const coinsForApp = Math.floor(minutesUnderLimit / 15) * 10;
        coinsEarned += coinsForApp;
      }
    });
    
    if (coinsEarned > 0) {
      addFocusCoins(coinsEarned);
      
      toast({
        title: "FocusCoins Earned!",
        description: `+${coinsEarned} FocusCoins for staying under your limits!`,
      });
    }
    
    setLastPointUpdate(now);
  }, [lastPointUpdate, todayUsage, userSettings.dailyLimits, addFocusCoins]);

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
      
      // Custom fun notifications with memes/messages for FocusPulse
      if (percentUsed >= 90 && percentUsed < 100) {
        toast({
          title: `Almost at ${app.appName} Limit`,
          description: `You've scrolled ${calculateScrollDistance(app.appName)} today. That's a lot of thumb exercise!`,
        });
      } else if (percentUsed >= 100) {
        // Fun notification when over limit
        const funnyMessages = [
          `Another ${app.appName} reel? Your real-life dog misses you!`,
          `You've been on ${app.appName} for a while - that's half a chapter in a book!`,
          `Your time on ${app.appName} is breaking your pet's heart.`,
          `Keep scrolling and you'll reach the moon by next week!`
        ];
        
        const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
        
        toast({
          title: `${app.appName} Limit Exceeded!`,
          description: randomMessage,
          variant: "destructive",
          action: <Button size="sm" variant="destructive" onClick={() => lockApp(app.appName)}>Take a Break</Button>
        });
      }
    });
  }, [calculateScrollDistance, lockApp, todayUsage, userSettings.dailyLimits, userSettings.notificationsEnabled]);

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
    focusCoins,
    addFocusCoins,
    calculateScrollDistance,
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


export interface UsageData {
  appName: string;
  timeInMillis: number;
  color: string;
  iconName?: string;
}

export interface UserSettings {
  dailyLimits: {
    [key: string]: number; // app name -> daily limit in minutes
  };
  notificationsEnabled: boolean;
  username?: string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  image?: string;
  unlocked: boolean;
}

export interface UserStats {
  points: number;
  streak: number;
  highestStreak: number;
  daysUnderLimit: number;
  rewards: string[]; // IDs of unlocked rewards
}

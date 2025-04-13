
export interface UsageData {
  appName: string;
  timeInMillis: number;
  color: string;
  iconName?: string;
  scrollMetrics?: {
    distance: string;
    count: number;
  };
}

export interface UserSettings {
  dailyLimits: {
    [key: string]: number; // app name -> daily limit in minutes
  };
  notificationsEnabled: boolean;
  username?: string;
  theme?: 'light' | 'dark' | 'system';
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointCost: number;
  coinCost?: number;
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

export interface FunNotification {
  title: string;
  message: string;
  imageUrl?: string;
}

export interface FocusChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  progress: number;
}

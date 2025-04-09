
import { UsageData, UserSettings, RewardItem, UserStats } from '@/types';

// Mock data generator for usage stats
export const generateMockUsageData = (): UsageData[] => {
  const apps = [
    { 
      appName: 'Instagram', 
      color: '#E1306C',
      iconName: 'instagram' 
    },
    { 
      appName: 'Facebook', 
      color: '#4267B2',
      iconName: 'facebook' 
    },
    { 
      appName: 'TikTok', 
      color: '#000000',
      iconName: 'video' 
    }
  ];

  return apps.map(app => ({
    ...app,
    timeInMillis: Math.floor(Math.random() * (3.5 * 60 - 30) + 30) * 60 * 1000, // 30 min to 3.5 hours in ms
  }));
};

// Generate usage data for multiple days
export const generateWeeklyUsageData = (): { [key: string]: UsageData[] } => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const result: { [key: string]: UsageData[] } = {};
  
  days.forEach(day => {
    result[day] = generateMockUsageData();
  });
  
  return result;
};

// Default user settings
export const defaultUserSettings: UserSettings = {
  dailyLimits: {
    'Instagram': 60, // 1 hour
    'Facebook': 45,  // 45 minutes
    'TikTok': 30,    // 30 minutes
  },
  notificationsEnabled: true
};

// Mock reward items
export const rewardItems: RewardItem[] = [
  {
    id: 'dark-theme',
    name: 'Dark Mode Theme',
    description: 'Unlock a sleek dark theme for the app.',
    pointCost: 100,
    unlocked: false,
  },
  {
    id: 'achievement-badge-1',
    name: 'Digital Detox Badge',
    description: 'Show off your commitment to mindful social media usage.',
    pointCost: 150,
    unlocked: false,
  },
  {
    id: 'custom-colors',
    name: 'Custom Color Themes',
    description: 'Personalize the app with your favorite colors.',
    pointCost: 200,
    unlocked: false,
  },
  {
    id: 'advanced-stats',
    name: 'Advanced Usage Analytics',
    description: 'Get detailed insights into your social media patterns.',
    pointCost: 300,
    unlocked: false,
  }
];

// Default user stats
export const defaultUserStats: UserStats = {
  points: 50,
  streak: 0,
  highestStreak: 0,
  daysUnderLimit: 0,
  rewards: []
};

// Helper to convert milliseconds to formatted time
export const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${remainingMinutes}m`;
  }
  return `${minutes}m`;
};

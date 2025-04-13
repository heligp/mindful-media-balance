
import React, { useState, useEffect } from 'react';
import UsagePieChart from '@/components/UsagePieChart';
import AppUsageCard from '@/components/AppUsageCard';
import FocusCoinsDisplay from '@/components/FocusCoinsDisplay';
import RewardsStore from '@/components/RewardsStore';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import GuardianMascot from '@/components/GuardianMascot';
import Onboarding from '@/components/Onboarding';
import ShockOverlay from '@/components/ShockOverlay';
import { Button } from '@/components/ui/button';
import { MessageSquarePlus } from 'lucide-react';

const Index = () => {
  const { todayUsage, hasUsageStatsPermission, requestUsageStatsPermission } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if onboarding has been completed before
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });
  const [showShockOverlay, setShowShockOverlay] = useState(false);
  const [shockAppName, setShockAppName] = useState('');
  const [isShockMinimized, setIsShockMinimized] = useState(false);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  // Simulate triggering the shock overlay occasionally
  useEffect(() => {
    if (todayUsage.length > 0 && Math.random() > 0.7) {
      const randomAppIndex = Math.floor(Math.random() * todayUsage.length);
      const randomApp = todayUsage[randomAppIndex];
      
      // Only show for apps with significant usage
      if (randomApp.timeInMillis > 10 * 60 * 1000) { // > 10 minutes
        setTimeout(() => {
          setShockAppName(randomApp.appName);
          setShowShockOverlay(true);
          setIsShockMinimized(false);
        }, 10000); // Show after 10 seconds on the page
      }
    }
  }, [todayUsage]);

  return (
    <div className="min-h-screen pb-24">
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <div className="container max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">FocusPulse</h1>
          <p className="text-muted-foreground">Your digital wellbeing companion</p>
        </header>
        
        {!hasUsageStatsPermission && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-amber-800 dark:text-amber-200">Usage Permission Required</h3>
            <p className="text-amber-700 dark:text-amber-300 text-sm mb-3">
              To track your actual app usage, FocusPulse needs permission to access usage stats.
              Currently showing demo data.
            </p>
            <Button 
              size="sm" 
              onClick={requestUsageStatsPermission}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              Grant Permission
            </Button>
          </div>
        )}
        
        <div className="space-y-6">
          <GuardianMascot />
          
          <FocusCoinsDisplay />
          
          <UsagePieChart data={todayUsage} />
          
          <div className="space-y-4">
            <h2 className="text-lg font-medium">App Usage</h2>
            {todayUsage.map((app) => (
              <AppUsageCard key={app.appName} app={app} />
            ))}
          </div>
          
          <RewardsStore />
        </div>
      </div>
      
      {/* Floating button to manually trigger shock overlay for testing */}
      <Button 
        className="fixed bottom-20 right-4 rounded-full shadow-lg z-30"
        size="icon"
        onClick={() => {
          if (todayUsage.length > 0) {
            setShockAppName(todayUsage[0].appName);
            setShowShockOverlay(true);
            setIsShockMinimized(false);
          }
        }}
      >
        <MessageSquarePlus size={20} />
      </Button>
      
      {/* Shock overlay */}
      {showShockOverlay && !isShockMinimized && (
        <ShockOverlay 
          appName={shockAppName}
          onClose={() => setShowShockOverlay(false)}
          onMinimize={() => setIsShockMinimized(true)}
        />
      )}
      
      {/* Minimized indicator */}
      {showShockOverlay && isShockMinimized && (
        <Button 
          variant="outline"
          className="fixed bottom-20 right-16 h-8 px-2 text-xs border-amber-500 text-amber-600 dark:text-amber-400 z-40"
          onClick={() => setIsShockMinimized(false)}
        >
          Time Alert
        </Button>
      )}
      
      <Navbar />
    </div>
  );
};

export default Index;

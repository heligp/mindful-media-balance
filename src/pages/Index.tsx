
import React, { useState, useEffect } from 'react';
import UsagePieChart from '@/components/UsagePieChart';
import AppUsageCard from '@/components/AppUsageCard';
import PointsDisplay from '@/components/PointsDisplay';
import RewardsStore from '@/components/RewardsStore';
import { useApp } from '@/contexts/AppContext';
import Navbar from '@/components/Navbar';
import GuardianMascot from '@/components/GuardianMascot';
import Onboarding from '@/components/Onboarding';

const Index = () => {
  const { todayUsage } = useApp();
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if onboarding has been completed before
    return localStorage.getItem('onboardingCompleted') !== 'true';
  });

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    localStorage.setItem('onboardingCompleted', 'true');
  };

  return (
    <div className="min-h-screen pb-24">
      {showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}
      
      <div className="container max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">TimeGuardian</h1>
          <p className="text-muted-foreground">Your digital wellbeing companion</p>
        </header>
        
        <div className="space-y-6">
          <GuardianMascot />
          
          <PointsDisplay />
          
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
      
      <Navbar />
    </div>
  );
};

export default Index;


import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft, ShieldCheck, Clock, Award, Settings } from 'lucide-react';
import PrivacyPolicy from './PrivacyPolicy';
import TermsOfService from './TermsOfService';
import { toast } from '@/components/ui/use-toast';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const slides = [
    {
      title: "Welcome to TimeGuardian",
      icon: <ShieldCheck size={64} className="text-mindful-purple" />,
      content: (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Take Control of Your Digital Life</h2>
          <p>TimeGuardian helps you monitor and manage your screen time with powerful insights and tools.</p>
        </div>
      ),
      showSkip: true,
    },
    {
      title: "Track Your Time",
      icon: <Clock size={64} className="text-mindful-purple" />,
      content: (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Real-time App Monitoring</h2>
          <p>See how much time you spend on social media and set personalized limits for a healthier digital balance.</p>
        </div>
      ),
      showSkip: true,
    },
    {
      title: "Earn Rewards",
      icon: <Award size={64} className="text-mindful-purple" />,
      content: (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Get Rewarded for Mindful Usage</h2>
          <p>Earn points when you stay under your limits and unlock special rewards in our store.</p>
        </div>
      ),
      showSkip: true,
    },
    {
      title: "Enable Permissions",
      icon: <Settings size={64} className="text-mindful-purple" />,
      content: (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Required App Permissions</h2>
          <p>TimeGuardian needs access to usage statistics and device admin rights to help you manage your screen time effectively.</p>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Usage Stats Permission",
                  description: "This would redirect to system settings in a real mobile app.",
                });
              }}
            >
              Enable Usage Stats Access
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => {
                toast({
                  title: "Device Admin Permission",
                  description: "This would request device admin rights in a real mobile app.",
                });
              }}
            >
              Enable Device Admin
            </Button>
          </div>
        </div>
      ),
      showSkip: false,
    },
    {
      title: "Privacy Policy",
      content: (
        <PrivacyPolicy 
          onAccept={() => setCurrentStep(currentStep + 1)}
          onDecline={() => {
            toast({
              title: "Privacy Policy",
              description: "You must accept the privacy policy to use TimeGuardian.",
              variant: "destructive",
            });
          }}
        />
      ),
      showSkip: false,
    },
    {
      title: "Terms of Service",
      content: (
        <TermsOfService 
          onAccept={() => setCurrentStep(currentStep + 1)}
          onDecline={() => {
            toast({
              title: "Terms of Service",
              description: "You must accept the terms of service to use TimeGuardian.",
              variant: "destructive",
            });
          }}
        />
      ),
      showSkip: false,
    },
    {
      title: "All Set!",
      icon: <ShieldCheck size={64} className="text-mindful-purple" />,
      content: (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">You're Ready to Go!</h2>
          <p>Start monitoring your app usage and taking control of your screen time.</p>
          <Button onClick={onComplete} className="w-full">
            Get Started
          </Button>
        </div>
      ),
      showSkip: false,
    },
  ];

  const currentSlide = slides[currentStep];

  const nextStep = () => {
    if (currentStep < slides.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const skip = () => {
    // Skip to the required steps (privacy policy and terms)
    setCurrentStep(4);
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 pb-4 px-6">
          <div className="relative">
            {/* Progress indicator */}
            <div className="flex justify-center mb-6">
              {slides.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 w-10 mx-1 rounded-full ${
                    index <= currentStep ? "bg-mindful-purple" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>
            
            {/* Content */}
            <div className="min-h-[400px] flex flex-col items-center justify-center">
              {currentSlide.icon && (
                <div className="mb-6">
                  {currentSlide.icon}
                </div>
              )}
              
              <div className="w-full">
                {currentSlide.content}
              </div>
            </div>
            
            {/* Navigation buttons */}
            <div className="flex justify-between mt-6">
              {currentStep > 0 && !(currentStep === 4 || currentStep === 5) ? (
                <Button variant="outline" onClick={prevStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              
              <div className="flex space-x-2">
                {currentSlide.showSkip && (
                  <Button variant="ghost" onClick={skip}>
                    Skip
                  </Button>
                )}
                
                {!(currentStep === 4 || currentStep === 5 || currentStep === slides.length - 1) && (
                  <Button onClick={nextStep}>
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;

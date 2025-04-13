
import React, { useState, useEffect } from 'react';
import { X, MinusCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';

interface ShockOverlayProps {
  appName: string;
  onClose: () => void;
  onMinimize: () => void;
}

const ShockOverlay: React.FC<ShockOverlayProps> = ({ appName, onClose, onMinimize }) => {
  const [message, setMessage] = useState<string>("");
  const { addFocusCoins } = useApp();
  
  const shockMessages = [
    `Another ${appName} reel? Your real-life dog misses you!`,
    `You've been on ${appName} for 30 minutes: that's half a chapter in a book!`,
    `If you were doing pushups instead of scrolling, you'd have done 120 by now.`,
    `Your brain on ${appName}: 🧠 → 🥴`,
    `Fun fact: This time on ${appName} could have made you $5 on a side hustle.`,
    `Every scroll pushes a notification from someone who actually loves you further down.`,
    `Your future self called. They're disappointed about this ${appName} session.`,
    `In the time you've spent here, you could have cooked a delicious meal.`,
    `Plot twist: The real content was the life happening around you all along.`
  ];

  useEffect(() => {
    // Pick a random message when the component mounts
    const randomIndex = Math.floor(Math.random() * shockMessages.length);
    setMessage(shockMessages[randomIndex]);
  }, [appName]);

  const handleTakeBreak = () => {
    // Award the user with FocusCoins for taking a break
    addFocusCoins(15);
    onClose();
  };

  return (
    <Card className="fixed bottom-20 right-4 w-64 shadow-lg z-50 bg-white dark:bg-gray-800 border border-amber-500">
      <div className="absolute -top-2 -right-2">
        <Button size="icon" variant="outline" className="h-6 w-6 rounded-full bg-white" onClick={onClose}>
          <X className="h-3 w-3" />
        </Button>
      </div>
      
      <div className="p-4">
        <div className="flex items-start gap-3 mb-3">
          <AlertCircle className="text-amber-500 mt-0.5" size={18} />
          <div>
            <h4 className="font-medium text-sm mb-1">Time Check</h4>
            <p className="text-xs text-muted-foreground">{message}</p>
          </div>
        </div>
        
        <div className="flex justify-between gap-2 mt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs" 
            onClick={onMinimize}
          >
            <MinusCircle className="h-3 w-3 mr-1" />
            Minimize
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="text-xs bg-amber-500 hover:bg-amber-600" 
            onClick={handleTakeBreak}
          >
            Take a Break (+15 coins)
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ShockOverlay;

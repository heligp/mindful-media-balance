
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart2, Settings, Home } from 'lucide-react';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const handleTabChange = (value: string) => {
    navigate(value);
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background pb-safe z-50">
      <Tabs 
        defaultValue={location.pathname} 
        value={location.pathname} 
        onValueChange={handleTabChange} 
        className="w-full"
      >
        <TabsList className="w-full h-16 grid grid-cols-3">
          <TabsTrigger value="/" className="data-[state=active]:bg-transparent data-[state=active]:text-mindful-purple flex flex-col items-center text-xs">
            <Home className="h-5 w-5 mb-1" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="/stats" className="data-[state=active]:bg-transparent data-[state=active]:text-mindful-purple flex flex-col items-center text-xs">
            <BarChart2 className="h-5 w-5 mb-1" />
            Stats
          </TabsTrigger>
          <TabsTrigger value="/settings" className="data-[state=active]:bg-transparent data-[state=active]:text-mindful-purple flex flex-col items-center text-xs">
            <Settings className="h-5 w-5 mb-1" />
            Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default Navbar;

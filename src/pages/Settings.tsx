
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useApp } from '@/contexts/AppContext';
import { Bell, Info, Lock, Shield } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Navbar from '@/components/Navbar';
import { toast } from '@/components/ui/use-toast';

const SettingsPage = () => {
  const { userSettings, updateUserSettings } = useApp();
  
  const handleNotificationsChange = (enabled: boolean) => {
    updateUserSettings({ notificationsEnabled: enabled });
    
    if (enabled) {
      toast({
        title: "Notifications Enabled",
        description: "You'll receive alerts when you approach app usage limits."
      });
    }
  };
  
  const handlePermissionRequest = () => {
    toast({
      title: "Permission Requested",
      description: "This would normally request usage stats permission on an actual Android device."
    });
  };
  
  const resetAllData = () => {
    toast({
      title: "Data Reset",
      description: "This would normally reset all app data on an actual device.",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen pb-24">
      <div className="container max-w-md mx-auto px-4 py-6">
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your experience</p>
        </header>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notifications
              </CardTitle>
              <CardDescription>Configure when you want to be alerted</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="notifications" className="text-sm font-medium">
                  Enable notifications
                </label>
                <Switch 
                  id="notifications" 
                  checked={userSettings.notificationsEnabled}
                  onCheckedChange={handleNotificationsChange}
                />
              </div>
              
              <div className="pt-2">
                <p className="text-sm font-medium mb-2">Notification threshold</p>
                <div className="flex text-xs justify-between mb-1">
                  <span>75%</span>
                  <span>90%</span>
                  <span>100%</span>
                </div>
                <Slider 
                  defaultValue={[90]} 
                  max={100} 
                  min={50}
                  step={5}
                  disabled={!userSettings.notificationsEnabled}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  You'll be notified when you reach this percentage of your daily limit
                </p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                Permissions
              </CardTitle>
              <CardDescription>Manage app permissions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Usage Stats Permission</p>
                  <p className="text-xs text-muted-foreground">Required to track app usage</p>
                </div>
                <Button size="sm" onClick={handlePermissionRequest}>Request</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Notification Permission</p>
                  <p className="text-xs text-muted-foreground">Required for alerts</p>
                </div>
                <Button size="sm" onClick={handlePermissionRequest}>Request</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm">All data is stored locally on your device</p>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={resetAllData}
                >
                  Reset All Data
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">Mindful Media Balance</p>
            <p className="text-xs text-muted-foreground">Version 1.0</p>
          </div>
        </div>
      </div>
      
      <Navbar />
    </div>
  );
};

export default SettingsPage;

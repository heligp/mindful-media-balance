
/**
 * Simulates Android's DevicePolicyManager for app blocking and permissions
 * In a real native app, this would interface with the actual Android APIs
 */

import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";

// Permission types
export type PermissionType = 'USAGE_STATS' | 'DEVICE_ADMIN';

// Status of permissions
export interface PermissionsStatus {
  usageStats: boolean;
  deviceAdmin: boolean;
}

// Storage key for permissions
const PERMISSIONS_STORAGE_KEY = 'timeguardian_permissions';

// Simulate permission check with localStorage
export const checkPermissions = (): PermissionsStatus => {
  try {
    const stored = localStorage.getItem(PERMISSIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to read permissions status', e);
  }
  
  return {
    usageStats: false,
    deviceAdmin: false
  };
};

// Save permissions to localStorage
const savePermissions = (status: PermissionsStatus): void => {
  try {
    localStorage.setItem(PERMISSIONS_STORAGE_KEY, JSON.stringify(status));
  } catch (e) {
    console.error('Failed to save permissions status', e);
  }
};

// Request permission by showing instructions
export const requestPermission = (permission: PermissionType): Promise<boolean> => {
  return new Promise((resolve) => {
    // In a real app, this would redirect to system settings
    // For our simulation, we'll just show a toast with instructions
    
    const permissions = checkPermissions();
    
    if (permission === 'USAGE_STATS') {
      const handleGrantPermission = () => {
        // Simulate granting the permission
        const newStatus = { ...permissions, usageStats: true };
        savePermissions(newStatus);
        toast({
          title: "Permission Granted",
          description: "Usage stats permission granted successfully."
        });
        resolve(true);
      };

      toast({
        title: "Usage Stats Permission Required",
        description: "On a real Android device, you would be redirected to Settings > Usage Access",
        action: <Button size="sm" onClick={handleGrantPermission}>Grant Permission</Button>
      });
    } else if (permission === 'DEVICE_ADMIN') {
      const handleGrantPermission = () => {
        // Simulate granting the permission
        const newStatus = { ...permissions, deviceAdmin: true };
        savePermissions(newStatus);
        toast({
          title: "Permission Granted",
          description: "Device admin permission granted successfully."
        });
        resolve(true);
      };

      toast({
        title: "Device Admin Permission Required",
        description: "On a real Android device, this would show the Device Admin activation screen",
        action: <Button size="sm" onClick={handleGrantPermission}>Grant Permission</Button>
      });
    }
    
    // In our simulation, we don't auto-resolve with false
    // as we want to wait for user interaction
  });
};

// Simulate app blocking with DevicePolicyManager
export const blockApp = (packageName: string, durationMs: number = 3600000): boolean => {
  const permissions = checkPermissions();
  
  if (!permissions.deviceAdmin) {
    toast({
      title: "Permission Required",
      description: "Device admin permission is required to block apps.",
      variant: "destructive"
    });
    return false;
  }
  
  // In a real app, this would call the DevicePolicyManager
  console.log(`[DevicePolicyManager] Blocking app ${packageName} for ${durationMs}ms`);
  
  // Store the blocked status in localStorage to simulate persistence
  try {
    const now = Date.now();
    const blockedUntil = now + durationMs;
    
    const blockedApps = JSON.parse(localStorage.getItem('blocked_apps') || '{}');
    blockedApps[packageName] = blockedUntil;
    localStorage.setItem('blocked_apps', JSON.stringify(blockedApps));
    
    return true;
  } catch (e) {
    console.error('Failed to save blocked app status', e);
    return false;
  }
};

// Check if an app is currently blocked
export const isAppBlocked = (packageName: string): boolean => {
  try {
    const blockedApps = JSON.parse(localStorage.getItem('blocked_apps') || '{}');
    const blockedUntil = blockedApps[packageName];
    
    if (!blockedUntil) return false;
    
    return Date.now() < blockedUntil;
  } catch (e) {
    console.error('Failed to check blocked app status', e);
    return false;
  }
};

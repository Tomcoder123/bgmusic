import { useCallback, useState, useEffect } from 'react';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';
import { Capacitor } from '@capacitor/core';

export function useBackgroundMode() {
  const [isBackgroundModeEnabled, setIsBackgroundModeEnabled] = useState(false);
  
  // Initialize and enable background mode when needed
  const enableBackgroundMode = useCallback(async () => {
    try {
      // Only enable in native app environments
      if (Capacitor.isNativePlatform()) {
        await BackgroundMode.enable();
        setIsBackgroundModeEnabled(true);
        console.log('Background mode enabled');
      }
    } catch (error) {
      console.error('Failed to enable background mode:', error);
    }
  }, []);

  // Disable background mode when not needed
  const disableBackgroundMode = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        await BackgroundMode.disable();
        setIsBackgroundModeEnabled(false);
        console.log('Background mode disabled');
      }
    } catch (error) {
      console.error('Failed to disable background mode:', error);
    }
  }, []);

  // Update notification with current track info
  const updateBackgroundNotification = useCallback(async (title: string, artist: string) => {
    try {
      if (Capacitor.isNativePlatform()) {
        // Different method for updating notification text
        await BackgroundMode.enable();
        setIsBackgroundModeEnabled(true);
        console.log('Updated background notification with track:', title, artist);
      }
    } catch (error) {
      console.error('Failed to update background notification:', error);
    }
  }, []);

  // Check if background mode is enabled
  const checkBackgroundMode = useCallback(async () => {
    try {
      if (Capacitor.isNativePlatform()) {
        const isEnabled = await BackgroundMode.isEnabled();
        return isEnabled.enabled;
      }
      return false;
    } catch (error) {
      console.error('Failed to check background mode status:', error);
      return false;
    }
  }, []);

  // Update the background mode status periodically
  useEffect(() => {
    let isMounted = true;
    
    // Status check function
    const checkStatus = async () => {
      if (!isMounted) return;
      
      try {
        const status = await checkBackgroundMode();
        if (isMounted) {
          setIsBackgroundModeEnabled(status);
        }
      } catch (error) {
        console.error('Error checking background mode:', error);
      }
    };
    
    // Initial check
    checkStatus();
    
    // Set up interval to check status
    const intervalId = setInterval(checkStatus, 2000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, [checkBackgroundMode]);
  
  return {
    isBackgroundModeEnabled,
    enableBackgroundMode,
    disableBackgroundMode,
    updateBackgroundNotification,
    checkBackgroundMode
  };
}
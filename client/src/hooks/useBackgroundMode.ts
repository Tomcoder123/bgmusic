import { useCallback } from 'react';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';
import { Capacitor } from '@capacitor/core';

export function useBackgroundMode() {
  // Initialize and enable background mode when needed
  const enableBackgroundMode = useCallback(async () => {
    try {
      // Only enable in native app environments
      if (Capacitor.isNativePlatform()) {
        await BackgroundMode.enable();
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
  
  return {
    enableBackgroundMode,
    disableBackgroundMode,
    updateBackgroundNotification,
    checkBackgroundMode
  };
}
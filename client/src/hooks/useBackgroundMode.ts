import { useEffect, useCallback } from 'react';
import { BackgroundMode } from '@anuradev/capacitor-background-mode';

export function useBackgroundMode() {
  // Initialize and enable background mode when needed
  const enableBackgroundMode = useCallback(async () => {
    try {
      await BackgroundMode.enable();
      console.log('Background mode enabled');
      
      // Set notification details
      await BackgroundMode.setDefaults({
        title: 'HearIt Music',
        text: 'Playing music in background',
        icon: 'notification_icon',
        color: '#007bff',
        resume: true,
        hidden: false,
        showWhen: true,
      });
      
      // Update notification based on current track (if needed)
      await BackgroundMode.configure({
        silent: false
      });
    } catch (error) {
      console.error('Failed to enable background mode:', error);
    }
  }, []);

  // Disable background mode when not needed
  const disableBackgroundMode = useCallback(async () => {
    try {
      await BackgroundMode.disable();
      console.log('Background mode disabled');
    } catch (error) {
      console.error('Failed to disable background mode:', error);
    }
  }, []);

  // Update notification with current track info
  const updateBackgroundNotification = useCallback(async (title: string, artist: string) => {
    try {
      await BackgroundMode.configure({
        title: 'HearIt Music',
        text: `${title} - ${artist}`,
      });
    } catch (error) {
      console.error('Failed to update background notification:', error);
    }
  }, []);

  // Check if background mode is enabled
  const checkBackgroundMode = useCallback(async () => {
    try {
      const isEnabled = await BackgroundMode.isEnabled();
      return isEnabled.enabled;
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
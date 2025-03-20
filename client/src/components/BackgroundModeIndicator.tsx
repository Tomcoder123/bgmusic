import React, { useContext, useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { PlayerContext } from '@/context/PlayerContext';
import { useBackgroundMode } from '@/hooks/useBackgroundMode';
import { Badge } from '@/components/ui/badge';

export default function BackgroundModeIndicator() {
  const { isPlaying, currentTrack } = useContext(PlayerContext);
  const { checkBackgroundMode } = useBackgroundMode();
  const [isBackgroundModeEnabled, setIsBackgroundModeEnabled] = useState(false);
  
  useEffect(() => {
    // Check if background mode is enabled
    const checkStatus = async () => {
      if (Capacitor.isNativePlatform()) {
        const enabled = await checkBackgroundMode();
        setIsBackgroundModeEnabled(enabled);
      }
    };
    
    // Initial check
    checkStatus();
    
    // Create an interval to periodically check status
    const interval = setInterval(checkStatus, 5000);
    
    return () => {
      clearInterval(interval);
    };
  }, [checkBackgroundMode]);
  
  // Only show on native platforms (Android/iOS)
  if (!Capacitor.isNativePlatform()) {
    return null;
  }
  
  if (!isPlaying || !currentTrack) {
    return null;
  }
  
  return (
    <div className="flex items-center justify-center mt-2">
      <Badge variant={isBackgroundModeEnabled ? "success" : "secondary"} className={isBackgroundModeEnabled ? "bg-green-500 hover:bg-green-600 text-white" : ""}>
        {isBackgroundModeEnabled ? 'Background Mode Active' : 'Background Mode Ready'}
      </Badge>
    </div>
  );
}
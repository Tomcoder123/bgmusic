import React, { createContext, useState, useEffect, useRef } from "react";
import { AudioQuality } from "@shared/schema";
import ReactPlayer from "react-player/youtube";
import { getUserPreferences, addRecentTrack } from "@/lib/youtube";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useBackgroundMode } from "@/hooks/useBackgroundMode";
import { Capacitor } from "@capacitor/core";

interface TrackInfo {
  id: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}

interface PlayerContextType {
  currentTrack: TrackInfo | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  progress: number;
  duration: number;
  audioQuality: AudioQuality;
  playTrack: (track: TrackInfo) => void;
  togglePlay: () => void;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number) => void;
  setAudioQuality: (quality: AudioQuality) => void;
  toggleTheme: () => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  currentTrack: null,
  isPlaying: false,
  isMuted: false,
  volume: 70,
  progress: 0,
  duration: 0,
  audioQuality: "medium",
  playTrack: () => {},
  togglePlay: () => {},
  toggleMute: () => {},
  setVolume: () => {},
  seekTo: () => {},
  setAudioQuality: () => {},
  toggleTheme: () => {},
});

interface PlayerProviderProps {
  children: React.ReactNode;
}

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState<TrackInfo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(70);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioQuality, setAudioQualityState] = useState<AudioQuality>("medium");
  const [theme, setTheme] = useState("dark");
  
  const playerRef = useRef<ReactPlayer | null>(null);
  
  // Initialize background mode hooks
  const { 
    enableBackgroundMode, 
    disableBackgroundMode, 
    updateBackgroundNotification 
  } = useBackgroundMode();
  
  // Load user preferences from API
  const { data: preferences } = useQuery({
    queryKey: ["/api/preferences"],
    queryFn: getUserPreferences
  });
  
  // Update preferences when available
  useEffect(() => {
    if (preferences) {
      setVolumeState(preferences.volume);
      setAudioQualityState(preferences.audioQuality);
    }
  }, [preferences]);
  
  // Track mutation to add played track to history
  const addTrackMutation = useMutation({
    mutationFn: addRecentTrack,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tracks/recent"] });
    },
  });
  
  // Enable background mode when a track is playing
  useEffect(() => {
    if (currentTrack && isPlaying) {
      enableBackgroundMode();
      
      if (Capacitor.isNativePlatform()) {
        updateBackgroundNotification(
          currentTrack.title,
          currentTrack.artist
        );
      }
    } else if (!isPlaying) {
      disableBackgroundMode();
    }
    
    return () => {
      // Clean up background mode when component unmounts
      disableBackgroundMode();
    };
  }, [currentTrack, isPlaying, enableBackgroundMode, disableBackgroundMode, updateBackgroundNotification]);
  
  // Play a track and save it to history
  const playTrack = (track: TrackInfo) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Add to recently played
    addTrackMutation.mutate({
      youtubeId: track.id,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      duration: track.duration,
    });
  };
  
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
  };
  
  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };
  
  const setAudioQuality = (quality: AudioQuality) => {
    setAudioQualityState(quality);
  };
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };
  
  // Get YouTube quality string based on user preference
  const getQualityLevel = () => {
    const qualityLevels = {
      low: "small",
      medium: "medium",
      high: "hd720"
    };
    return qualityLevels[audioQuality];
  };
  
  return (
    <PlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        isMuted,
        volume,
        progress,
        duration,
        audioQuality,
        playTrack,
        togglePlay,
        toggleMute,
        setVolume,
        seekTo,
        setAudioQuality,
        toggleTheme,
      }}
    >
      {children}
      
      {/* Hidden YouTube player - handles actual playback */}
      {currentTrack && (
        <div className="hidden">
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${currentTrack.id}`}
            playing={isPlaying}
            volume={volume / 100}
            muted={isMuted}
            onDuration={(dur) => setDuration(dur)}
            onProgress={(state) => setProgress(state.playedSeconds)}
            onEnded={() => setIsPlaying(false)}
            width="0"
            height="0"
            config={{
              youtube: getPlayerConfig()
            }}
          />
        </div>
      )}
    </PlayerContext.Provider>
  );
};

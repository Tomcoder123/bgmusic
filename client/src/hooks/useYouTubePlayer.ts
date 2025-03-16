import { useState, useEffect, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import { AudioQuality } from '@shared/schema';

interface UseYouTubePlayerProps {
  videoId?: string;
  quality?: AudioQuality;
  volume?: number;
  autoplay?: boolean;
}

export function useYouTubePlayer({
  videoId,
  quality = 'medium',
  volume = 70,
  autoplay = false,
}: UseYouTubePlayerProps = {}) {
  const [playing, setPlaying] = useState(autoplay);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loaded, setLoaded] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const [ready, setReady] = useState(false);
  
  const playerRef = useRef<ReactPlayer | null>(null);
  
  // Convert quality setting to YouTube quality parameter
  const getQualityParam = (): string => {
    switch (quality) {
      case 'low':
        return 'small';
      case 'medium':
        return 'medium';
      case 'high':
        return 'hd720';
      default:
        return 'medium';
    }
  };
  
  const play = () => setPlaying(true);
  const pause = () => setPlaying(false);
  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  
  const seekTo = (seconds: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(seconds);
    }
  };
  
  const handleProgress = (state: { played: number; playedSeconds: number; loaded: number; loadedSeconds: number }) => {
    setProgress(state.playedSeconds);
    setLoaded(state.loaded);
  };
  
  const handleDuration = (dur: number) => {
    setDuration(dur);
  };
  
  const handleError = (err: Error) => {
    console.error('YouTube player error:', err);
    setError(err);
  };
  
  const handleReady = () => {
    setReady(true);
  };
  
  // YouTube player config
  const config = {
    youtube: {
      playerVars: {
        autoplay: autoplay ? 1 : 0,
        controls: 0,
        disablekb: 1,
        fs: 0,
        iv_load_policy: 3,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        showinfo: 0,
        vq: getQualityParam(),
      },
    },
  };
  
  return {
    playing,
    muted,
    progress,
    duration,
    loaded,
    error,
    ready,
    playerRef,
    play,
    pause,
    togglePlay,
    toggleMute,
    seekTo,
    handleProgress,
    handleDuration,
    handleError,
    handleReady,
    config,
  };
}

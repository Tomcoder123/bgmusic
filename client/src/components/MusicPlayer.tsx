import { useContext, useState, useRef, useEffect } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { formatDuration } from "@/lib/youtube";
import { useMutation } from "@tanstack/react-query";
import { updateVolume } from "@/lib/youtube";
import { queryClient } from "@/lib/queryClient";

export default function MusicPlayer() {
  const { 
    currentTrack, 
    isPlaying, 
    togglePlay,
    progress,
    duration,
    volume,
    isMuted,
    toggleMute,
    setVolume,
    seekTo,
  } = useContext(PlayerContext);
  
  const progressRef = useRef<HTMLDivElement>(null);
  const volumeBarRef = useRef<HTMLDivElement>(null);
  
  const volumeMutation = useMutation({
    mutationFn: updateVolume,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
    }
  });
  
  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    
    seekTo(percentage * duration);
  };
  
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!volumeBarRef.current) return;
    
    const rect = volumeBarRef.current.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const newVolume = Math.min(Math.max(Math.round((clickPosition / rect.width) * 100), 0), 100);
    
    setVolume(newVolume);
    volumeMutation.mutate(newVolume);
  };
  
  // Get the appropriate volume icon based on volume level
  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <VolumeX />;
    if (volume < 50) return <Volume1 />;
    return <Volume2 />;
  };
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-muted shadow-lg z-10">
      {/* Progress bar */}
      <div 
        className="player-progress cursor-pointer" 
        onClick={handleProgressClick}
        ref={progressRef}
      >
        <div 
          className="progress-bar" 
          style={{ width: `${(progress / duration) * 100}%` }}
        ></div>
      </div>
      
      {/* Time info */}
      <div className="flex justify-between px-4 text-xs text-muted-foreground py-1">
        <span>{formatDuration(progress)}</span>
        <span>{formatDuration(duration)}</span>
      </div>
      
      {/* Controls */}
      <div className="px-4 py-3 flex items-center">
        {/* Track info (small screens) */}
        <div className="md:hidden flex items-center flex-1 min-w-0 mr-4">
          <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 mr-3">
            <img 
              src={currentTrack.thumbnailUrl} 
              alt="Now playing" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-medium truncate">{currentTrack.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{currentTrack.artist}</p>
          </div>
        </div>
        
        {/* Player controls */}
        <div className="player-controls flex justify-center items-center flex-1">
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            // Skip functionality would be added in a more complete implementation
            // onClick={() => skipPrevious()}
          >
            <SkipBack />
          </button>
          <button 
            className="p-2 mx-2 text-white bg-primary rounded-full w-12 h-12 flex items-center justify-center hover:bg-primary-light"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            // Skip functionality would be added in a more complete implementation
            // onClick={() => skipNext()}
          >
            <SkipForward />
          </button>
        </div>
        
        {/* Volume controls (shows on larger screens) */}
        <div className="hidden md:flex items-center space-x-2 flex-1 justify-end">
          <button 
            className="p-2 text-muted-foreground hover:text-foreground"
            onClick={toggleMute}
          >
            {getVolumeIcon()}
          </button>
          <div 
            className="w-24 h-1 bg-muted rounded-full overflow-hidden cursor-pointer"
            onClick={handleVolumeClick}
            ref={volumeBarRef}
          >
            <div 
              className="h-full bg-primary" 
              style={{ width: `${isMuted ? 0 : volume}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

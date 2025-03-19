import { useContext, useRef } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { 
  Pause, Play, SkipBack, SkipForward, 
  Volume1, Volume2, VolumeX, 
  Heart, ListMusic, MonitorSpeaker,
  Repeat, Shuffle
} from "lucide-react";
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
    if (isMuted || volume === 0) return <VolumeX size={18} />;
    if (volume < 50) return <Volume1 size={18} />;
    return <Volume2 size={18} />;
  };
  
  if (!currentTrack) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-md border-t border-border shadow-lg z-10">
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
      
      {/* Apple Music style player */}
      <div className="px-6 py-4 flex items-center gap-4">
        {/* Track info with artwork */}
        <div className="flex items-center min-w-0 pr-4 border-r border-border">
          <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0 mr-3 shadow-md">
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
          <button className="ml-4 text-muted-foreground hover:text-primary transition-colors">
            <Heart size={16} />
          </button>
        </div>
        
        {/* Main player controls */}
        <div className="flex flex-col items-center flex-1">
          {/* Control buttons */}
          <div className="player-controls flex items-center space-x-4">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Shuffle size={16} />
            </button>
            <button 
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipBack size={22} />
            </button>
            <button 
              className="p-2 mx-1 text-white bg-primary rounded-full w-10 h-10 flex items-center justify-center hover:bg-primary-light"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>
            <button 
              className="p-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <SkipForward size={22} />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Repeat size={16} />
            </button>
          </div>
          
          {/* Time indicator */}
          <div className="flex justify-between w-full text-xs text-muted-foreground mt-1.5">
            <span>{formatDuration(progress)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
        </div>
        
        {/* Right side controls - volume and extras */}
        <div className="flex items-center space-x-3 border-l border-border pl-2">
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <ListMusic size={18} />
          </button>
          <button className="text-muted-foreground hover:text-foreground transition-colors">
            <MonitorSpeaker size={18} />
          </button>
          
          {/* Volume control */}
          <div className="flex items-center space-x-2">
            <button 
              className="text-muted-foreground hover:text-foreground transition-colors"
              onClick={toggleMute}
            >
              {getVolumeIcon()}
            </button>
            <div 
              className="w-24 h-1.5 bg-muted rounded-full overflow-hidden cursor-pointer"
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
    </div>
  );
}

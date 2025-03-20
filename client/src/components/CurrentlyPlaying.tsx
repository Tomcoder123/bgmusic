import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { AudioQuality } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { updateAudioQuality } from "@/lib/youtube";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Repeat, Shuffle, MoreHorizontal } from "lucide-react";
import BackgroundModeIndicator from "@/components/BackgroundModeIndicator";
import { Capacitor } from "@capacitor/core";

export default function CurrentlyPlaying() {
  const { currentTrack, audioQuality, setAudioQuality, isPlaying } = useContext(PlayerContext);
  
  const qualityMutation = useMutation({
    mutationFn: updateAudioQuality,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/preferences'] });
    }
  });
  
  if (!currentTrack) return null;
  
  const handleQualityChange = (quality: AudioQuality) => {
    setAudioQuality(quality);
    qualityMutation.mutate(quality);
  };

  return (
    <div className="px-6 py-8 mb-6">
      <div className="flex flex-col md:flex-row items-center max-w-4xl mx-auto">
        {/* Album artwork - Apple Music style */}
        <div className="relative w-64 h-64 mb-6 md:mb-0 md:mr-8 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
          <img 
            src={currentTrack.thumbnailUrl} 
            alt={`${currentTrack.title} album art`} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"></div>
          
          {/* Playing indicator */}
          {isPlaying && (
            <div className="absolute right-3 bottom-3 bg-primary rounded-full p-2 animate-pulse">
              <div className="flex space-x-1">
                <div className="w-1 h-3 bg-white rounded-full animate-eq"></div>
                <div className="w-1 h-4 bg-white rounded-full animate-eq animation-delay-200"></div>
                <div className="w-1 h-2 bg-white rounded-full animate-eq animation-delay-500"></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Track info and controls - Apple Music style */}
        <div className="flex-1 flex flex-col items-center md:items-start">
          <h2 className="text-2xl md:text-3xl font-bold mb-1 text-center md:text-left">
            {currentTrack.title}
          </h2>
          <p className="text-lg md:text-xl text-primary mb-4 text-center md:text-left">
            {currentTrack.artist}
          </p>
          
          {/* Action buttons - Apple Music style */}
          <div className="flex space-x-4 mb-8 text-sm">
            <button className="flex items-center hover:text-primary transition-colors">
              <Heart size={18} className="mr-1.5" />
              <span>Add</span>
            </button>
            <button className="flex items-center hover:text-primary transition-colors">
              <Share2 size={18} className="mr-1.5" />
              <span>Share</span>
            </button>
            <button className="flex items-center hover:text-primary transition-colors">
              <MoreHorizontal size={18} className="mr-1.5" />
              <span>More</span>
            </button>
          </div>
          
          {/* Audio quality selector - Apple Music style */}
          <div className="w-full max-w-xs">
            <h3 className="text-sm font-medium mb-2 flex justify-between">
              <span>Audio Quality</span>
              {qualityMutation.isPending && <span className="text-primary text-xs">Updating...</span>}
            </h3>
            <div className="bg-card p-1 rounded-lg flex text-sm">
              {(['low', 'medium', 'high'] as AudioQuality[]).map((quality) => (
                <button
                  key={quality}
                  className={`quality-option flex-1 px-3 py-2 rounded-md transition-colors ${
                    audioQuality === quality 
                      ? 'bg-primary text-primary-foreground' 
                      : 'hover:bg-secondary/80'
                  }`}
                  onClick={() => handleQualityChange(quality)}
                  disabled={qualityMutation.isPending}
                >
                  {quality.charAt(0).toUpperCase() + quality.slice(1)}
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Higher quality uses more data and may buffer on slower connections.
            </p>
          </div>
        </div>
      </div>
      
      {/* Background Mode Indicator */}
      {Capacitor.isNativePlatform() && (
        <div className="max-w-4xl mx-auto mt-4 flex justify-center">
          <BackgroundModeIndicator />
        </div>
      )}
      
      {/* Apple Music style style divider */}
      <div className="max-w-4xl mx-auto mt-8 border-t border-border"></div>
    </div>
  );
}

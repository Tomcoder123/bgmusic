import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { AudioQuality } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { updateAudioQuality } from "@/lib/youtube";
import { queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";

export default function CurrentlyPlaying() {
  const { currentTrack, audioQuality, setAudioQuality } = useContext(PlayerContext);
  
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
    <div className="p-4 flex flex-col items-center mb-4">
      <div className="relative w-64 h-64 mb-4 shadow-lg rounded-md overflow-hidden">
        <img 
          src={currentTrack.thumbnailUrl} 
          alt={`${currentTrack.title} album art`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>
      <h2 className="text-xl font-semibold text-center">{currentTrack.title}</h2>
      <p className="text-muted-foreground text-center">{currentTrack.artist}</p>
      
      {/* Audio quality selector */}
      <div className="mt-4 flex justify-center gap-2 text-sm">
        <span className="text-muted-foreground mr-1">Quality:</span>
        {(['low', 'medium', 'high'] as AudioQuality[]).map((quality) => (
          <Button
            key={quality}
            variant={audioQuality === quality ? "default" : "outline"}
            className={`quality-option px-3 py-1 rounded-full border ${
              audioQuality === quality 
                ? 'bg-primary text-primary-foreground' 
                : 'border-primary text-primary hover:bg-primary/20'
            }`}
            onClick={() => handleQualityChange(quality)}
            size="sm"
            disabled={qualityMutation.isPending}
          >
            {quality.charAt(0).toUpperCase() + quality.slice(1)}
          </Button>
        ))}
      </div>
    </div>
  );
}

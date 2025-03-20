import { useQuery } from "@tanstack/react-query";
import { getRecentTracks } from "@/lib/youtubeApiWrapper";
import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { Track } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentlyPlayed() {
  const { playTrack } = useContext(PlayerContext);
  
  const { data: recentTracks, isLoading } = useQuery({
    queryKey: ["/api/tracks/recent"],
    queryFn: getRecentTracks,
  });
  
  const handlePlayTrack = (track: Track) => {
    playTrack({
      id: track.youtubeId,
      title: track.title,
      artist: track.artist,
      thumbnailUrl: track.thumbnailUrl,
      duration: track.duration,
    });
  };
  
  if (isLoading) {
    return (
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Recently Played</h2>
        <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
          {Array(4).fill(0).map((_, index) => (
            <div key={index} className="flex-shrink-0 w-40">
              <Skeleton className="w-40 h-40 mb-2 rounded-md" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!recentTracks?.length) {
    return null;
  }
  
  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Recently Played</h2>
      <div className="flex overflow-x-auto pb-4 gap-4 hide-scrollbar">
        {recentTracks.map((track) => (
          <div 
            key={track.id} 
            className="flex-shrink-0 w-40 cursor-pointer transition-transform hover:scale-105"
            onClick={() => handlePlayTrack(track)}
          >
            <div className="w-40 h-40 mb-2 rounded-md overflow-hidden">
              <img 
                src={track.thumbnailUrl} 
                alt={`${track.title} album art`} 
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-sm font-medium truncate">{track.title}</h3>
            <p className="text-xs text-muted-foreground truncate">{track.artist}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

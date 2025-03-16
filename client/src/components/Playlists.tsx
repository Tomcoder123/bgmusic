import { useQuery } from "@tanstack/react-query";
import { Plus, Music4 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Playlists() {
  const { data: playlists, isLoading } = useQuery({
    queryKey: ["/api/playlists"],
    queryFn: async () => {
      const response = await fetch("/api/playlists");
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      return response.json();
    },
  });
  
  if (isLoading) {
    return (
      <div className="px-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Library</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {Array(5).fill(0).map((_, index) => (
            <div key={index} className="flex flex-col">
              <Skeleton className="aspect-square rounded-xl mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  // Placeholder playlists when none exist yet
  const playlistsToShow = playlists && playlists.length > 0 ? playlists : [];
  
  return (
    <div className="px-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Your Library</h2>
        <button className="text-sm font-medium text-primary hover:underline">
          See All
        </button>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {/* Create new playlist button - Apple Music style */}
        <div className="group cursor-pointer">
          <div className="aspect-square bg-secondary rounded-xl flex items-center justify-center shadow-sm mb-3 group-hover:shadow-md transition-all relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <Plus className="text-primary text-4xl group-hover:scale-110 transition-transform" />
          </div>
          <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">Create New Playlist</h3>
          <p className="text-xs text-muted-foreground">Start your collection</p>
        </div>
        
        {playlistsToShow.map((playlist: any) => (
          <div 
            key={playlist.id} 
            className="group cursor-pointer"
          >
            <div className="aspect-square rounded-xl overflow-hidden shadow-sm mb-3 group-hover:shadow-md transition-all relative">
              {playlist.coverUrl ? (
                <img 
                  src={playlist.coverUrl} 
                  alt={`${playlist.title} playlist cover`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-card flex items-center justify-center">
                  <Music4 className="text-primary text-4xl opacity-70" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                <button className="bg-primary text-white rounded-full px-4 py-1.5 text-sm font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform">
                  Play
                </button>
              </div>
            </div>
            <h3 className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{playlist.title}</h3>
            <p className="text-xs text-muted-foreground">
              {playlist.trackCount || 0} songs
            </p>
          </div>
        ))}
        
        {/* Empty state when no playlists exist */}
        {playlistsToShow.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-8 opacity-80">
            <Music4 className="text-primary text-4xl mb-4" />
            <h3 className="text-base font-medium mb-1">No Playlists Yet</h3>
            <p className="text-sm text-muted-foreground text-center max-w-md">
              Create your first playlist to organize your favorite tracks and enjoy them anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

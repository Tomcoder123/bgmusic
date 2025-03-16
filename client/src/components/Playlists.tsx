import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
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
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Your Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="rounded-md overflow-hidden">
              <Skeleton className="aspect-square" />
              <div className="p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Your Playlists</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {playlists && playlists.map((playlist: any) => (
          <div 
            key={playlist.id} 
            className="bg-card rounded-md overflow-hidden cursor-pointer hover:bg-muted transition-colors"
          >
            <div className="aspect-square">
              <img 
                src={playlist.coverUrl} 
                alt={`${playlist.title} playlist cover`} 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">{playlist.title}</h3>
              <p className="text-xs text-muted-foreground truncate">
                {/* Placeholder since we don't have track count in the schema */}
                {Math.floor(Math.random() * 20) + 1} tracks
              </p>
            </div>
          </div>
        ))}
        
        {/* Create new playlist button */}
        <div className="bg-card rounded-md overflow-hidden cursor-pointer hover:bg-muted transition-colors">
          <div className="aspect-square bg-muted flex items-center justify-center">
            <Plus className="text-primary text-4xl" />
          </div>
          <div className="p-3">
            <h3 className="text-sm font-medium truncate">Create Playlist</h3>
            <p className="text-xs text-muted-foreground truncate">Add your favorite tracks</p>
          </div>
        </div>
      </div>
    </div>
  );
}

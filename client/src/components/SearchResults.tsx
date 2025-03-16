import { useState, useEffect } from "react";
import { searchYouTubeVideos } from "@/lib/youtube";
import { Music2, SearchX } from "lucide-react";
import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";
import { Skeleton } from "@/components/ui/skeleton";
import TrackItem from "./TrackItem";
import { YouTubeSearchResult } from "@shared/schema";

interface SearchResultsProps {
  searchQuery: string;
}

export default function SearchResults({ searchQuery }: SearchResultsProps) {
  const [results, setResults] = useState<YouTubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { playTrack } = useContext(PlayerContext);
  
  useEffect(() => {
    const fetchResults = async () => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        const searchResults = await searchYouTubeVideos(searchQuery);
        setResults(searchResults);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to search. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchResults();
  }, [searchQuery]);
  
  const handlePlayTrack = (result: YouTubeSearchResult) => {
    playTrack({
      id: result.id.videoId,
      title: result.snippet.title,
      artist: result.snippet.channelTitle,
      thumbnailUrl: result.snippet.thumbnails.high.url,
      duration: 0, // Since we don't have duration from search results
    });
  };
  
  if (!searchQuery.trim()) {
    return null;
  }
  
  if (error) {
    return (
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold apple-text-gradient">Search Results</h2>
          <span className="text-sm text-muted-foreground">Query: "{searchQuery}"</span>
        </div>
        <div className="py-6 text-center bg-card/50 rounded-lg">
          <p className="text-destructive">Error: {error}</p>
          <button 
            className="mt-4 apple-button text-sm"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold apple-text-gradient">Search Results</h2>
        {results.length > 0 && 
          <span className="text-sm text-muted-foreground">
            Found {results.length} results for "{searchQuery}"
          </span>
        }
      </div>
      
      {isLoading ? (
        // Apple Music style loading state
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, index) => (
            <div key={index} className="apple-card bg-card rounded-lg overflow-hidden flex p-3">
              <Skeleton className="w-16 h-16 rounded-md flex-shrink-0" />
              <div className="flex-1 pl-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : results.length === 0 ? (
        // Apple Music-style empty results state
        <div className="py-12 text-center bg-card/30 rounded-lg">
          <div className="mb-4 flex justify-center">
            <div className="p-4 rounded-full bg-secondary/80">
              <SearchX size={40} className="text-muted-foreground" />
            </div>
          </div>
          <h3 className="text-lg font-medium mb-2">No results found</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            We couldn't find any songs matching "{searchQuery}". 
            Try different keywords or check your spelling.
          </p>
          <div className="mt-6 flex justify-center">
            <button className="apple-button">Browse Trending</button>
          </div>
        </div>
      ) : (
        // Apple Music style search results grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((result) => (
            <TrackItem
              key={result.id.videoId}
              result={result}
              onClick={() => handlePlayTrack(result)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

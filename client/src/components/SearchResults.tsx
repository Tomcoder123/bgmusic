import { useState, useEffect } from "react";
import { searchYouTubeVideos, formatCount, formatPublishedAt, parseDuration } from "@/lib/youtube";
import { Eye } from "lucide-react";
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
      <div className="px-4 mb-6">
        <h2 className="text-lg font-semibold mb-3">Search Results</h2>
        <div className="py-6 text-center">
          <p className="text-destructive">Error: {error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="px-4 mb-6">
      <h2 className="text-lg font-semibold mb-3">Search Results</h2>
      
      {isLoading ? (
        // Loading state
        <>
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-card rounded-md mb-3 overflow-hidden flex">
              <Skeleton className="w-16 h-16" />
              <div className="flex-1 p-3">
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            </div>
          ))}
        </>
      ) : results.length === 0 ? (
        // Empty results state
        <div className="py-12 text-center">
          <div className="text-5xl text-muted-foreground mb-4 flex justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none"
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
              <path d="M8 11h6" />
            </svg>
          </div>
          <p className="text-muted-foreground">No results found for your search.</p>
          <p className="text-muted-foreground text-sm mt-1">Try different keywords or check your spelling.</p>
        </div>
      ) : (
        // Search results
        <>
          {results.map((result) => (
            <TrackItem
              key={result.id.videoId}
              result={result}
              onClick={() => handlePlayTrack(result)}
            />
          ))}
        </>
      )}
    </div>
  );
}

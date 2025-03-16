import { YouTubeSearchResult } from "@shared/schema";
import { Eye } from "lucide-react";
import { formatCount, formatPublishedAt } from "@/lib/youtube";

interface TrackItemProps {
  result: YouTubeSearchResult;
  onClick: () => void;
}

export default function TrackItem({ result, onClick }: TrackItemProps) {
  return (
    <div 
      className="bg-card rounded-md mb-3 overflow-hidden flex cursor-pointer hover:bg-muted transition-colors"
      onClick={onClick}
    >
      <div className="w-16 h-16 flex-shrink-0">
        <img 
          src={result.snippet.thumbnails.medium.url} 
          alt={`${result.snippet.title} thumbnail`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 p-3 overflow-hidden">
        <h3 className="text-sm font-medium truncate">{result.snippet.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{result.snippet.channelTitle}</p>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          <span>{formatCount(result.statistics?.viewCount || "0")} views</span>
          <span className="mx-2">•</span>
          <span>{formatPublishedAt(result.snippet.publishedAt)}</span>
        </div>
      </div>
    </div>
  );
}

import { YouTubeSearchResult } from "@shared/schema";
import { Eye, Play, Plus, MoreHorizontal } from "lucide-react";
import { formatCount, formatPublishedAt } from "@/lib/youtube";

interface TrackItemProps {
  result: YouTubeSearchResult;
  onClick: () => void;
}

export default function TrackItem({ result, onClick }: TrackItemProps) {
  return (
    <div 
      className="apple-card p-3 overflow-hidden flex items-center group"
    >
      {/* Thumbnail with play button overlay - Apple Music style */}
      <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0 rounded-md overflow-hidden relative shadow-md">
        <img 
          src={result.snippet.thumbnails.medium.url} 
          alt={`${result.snippet.title} thumbnail`} 
          className="w-full h-full object-cover"
        />
        <div 
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
          <div className="bg-black/50 rounded-full p-1.5">
            <Play size={16} className="text-white fill-white ml-0.5" />
          </div>
        </div>
      </div>
      
      {/* Track info - Apple Music style */}
      <div className="flex-1 px-3 overflow-hidden">
        <h3 className="text-sm font-medium truncate">{result.snippet.title}</h3>
        <p className="text-xs text-muted-foreground truncate">{result.snippet.channelTitle}</p>
        <div className="flex items-center mt-1 text-xs text-muted-foreground">
          <Eye className="h-3 w-3 mr-1" />
          <span>{formatCount(result.statistics?.viewCount || "0")} views</span>
          <span className="mx-2">•</span>
          <span>{formatPublishedAt(result.snippet.publishedAt)}</span>
        </div>
      </div>
      
      {/* Action buttons - Apple Music style */}
      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
          onClick={onClick}
          aria-label="Play"
        >
          <Play size={16} className="fill-current" />
        </button>
        <button
          className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label="Add to playlist"
        >
          <Plus size={16} />
        </button>
        <button
          className="p-1.5 text-muted-foreground hover:text-primary rounded-full hover:bg-secondary transition-colors"
          onClick={(e) => e.stopPropagation()}
          aria-label="More options"
        >
          <MoreHorizontal size={16} />
        </button>
      </div>
    </div>
  );
}

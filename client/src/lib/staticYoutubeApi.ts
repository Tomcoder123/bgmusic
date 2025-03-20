import { AudioQuality, YouTubeSearchResult } from "@shared/schema";

/**
 * Static implementation of YouTube API that works on GitHub Pages
 * without requiring a backend server
 */

// In-memory storage for recently played tracks
let recentTracks: any[] = [];
// User preferences
const userPreferences = {
  audioQuality: "medium" as AudioQuality,
  volume: 70
};

/**
 * Search YouTube videos using fetch directly to YouTube API
 */
export async function searchYouTubeVideos(query: string): Promise<YouTubeSearchResult[]> {
  if (!query) return [];
  
  try {
    // For GitHub Pages deployment, we'll use a public YouTube API proxy
    // Or the client can directly use their own YouTube API key
    const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
    
    if (!apiKey) {
      console.error("YouTube API key not found");
      return [];
    }
    
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`YouTube API Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items.map((item: any) => ({
      id: { videoId: item.id.videoId },
      snippet: {
        title: item.snippet.title,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        thumbnails: {
          medium: { url: item.snippet.thumbnails.medium.url },
          high: { url: item.snippet.thumbnails.high.url }
        }
      }
    }));
  } catch (error) {
    console.error("Error searching YouTube videos:", error);
    return [];
  }
}

/**
 * Add a track to recently played (memory only in static version)
 */
export async function addRecentTrack(trackData: {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}) {
  // Check if track already exists
  const existingIndex = recentTracks.findIndex(
    track => track.youtubeId === trackData.youtubeId
  );
  
  // Remove if exists
  if (existingIndex !== -1) {
    recentTracks.splice(existingIndex, 1);
  }
  
  // Add to beginning
  recentTracks.unshift({
    ...trackData,
    id: Date.now(),
    timestamp: new Date().toISOString()
  });
  
  // Limit to 10 tracks
  if (recentTracks.length > 10) {
    recentTracks = recentTracks.slice(0, 10);
  }
  
  return recentTracks[0];
}

/**
 * Get recently played tracks
 */
export async function getRecentTracks() {
  return recentTracks;
}

/**
 * Update audio quality preference
 */
export async function updateAudioQuality(quality: AudioQuality) {
  userPreferences.audioQuality = quality;
  return userPreferences;
}

/**
 * Update volume preference
 */
export async function updateVolume(volume: number) {
  userPreferences.volume = volume;
  return userPreferences;
}

/**
 * Get user preferences
 */
export async function getUserPreferences() {
  return userPreferences;
}

/**
 * Utility to parse YouTube duration string into seconds
 */
export function parseDuration(duration: string): number {
  // PT1H30M15S -> 1h 30m 15s
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  return hours * 3600 + minutes * 60 + seconds;
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Format view count with K/M suffix
 */
export function formatCount(count: string | number): string {
  const num = typeof count === 'string' ? parseInt(count, 10) : count;
  
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return num.toString();
}

/**
 * Format published date to relative time
 */
export function formatPublishedAt(publishedAt: string): string {
  const published = new Date(publishedAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - published.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minutes ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hours ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} days ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} months ago`;
  }
  
  return `${Math.floor(diffInMonths / 12)} years ago`;
}
import { type YouTubeSearchResult, AudioQuality } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Function to search YouTube videos
export async function searchYouTubeVideos(query: string): Promise<YouTubeSearchResult[]> {
  if (!query.trim()) {
    return [];
  }
  
  const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Error searching videos: ${response.statusText}`);
  }
  
  return response.json();
}

// Function to add a track to recently played
export async function addRecentTrack(trackData: {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}) {
  return apiRequest("POST", "/api/tracks/recent", trackData);
}

// Function to get recently played tracks
export async function getRecentTracks() {
  const response = await fetch("/api/tracks/recent", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching recent tracks: ${response.statusText}`);
  }
  
  return response.json();
}

// Function to update audio quality preference
export async function updateAudioQuality(quality: AudioQuality) {
  return apiRequest("PATCH", "/api/preferences/quality", { quality });
}

// Function to update volume preference
export async function updateVolume(volume: number) {
  return apiRequest("PATCH", "/api/preferences/volume", { volume });
}

// Function to get user preferences
export async function getUserPreferences() {
  const response = await fetch("/api/preferences", {
    credentials: "include",
  });
  
  if (!response.ok) {
    throw new Error(`Error fetching preferences: ${response.statusText}`);
  }
  
  return response.json();
}

// Convert YouTube duration string (ISO 8601) to seconds
export function parseDuration(duration: string): number {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match && match[1]) ? parseInt(match[1].replace('H', '')) : 0;
  const minutes = (match && match[2]) ? parseInt(match[2].replace('M', '')) : 0;
  const seconds = (match && match[3]) ? parseInt(match[3].replace('S', '')) : 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Format seconds to MM:SS or HH:MM:SS
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds === 0) return "0:00";
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  } else {
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  }
}

// Format a number for display (e.g., 1000000 -> 1M)
export function formatCount(count: string | number): string {
  const num = typeof count === 'string' ? parseInt(count) : count;
  if (isNaN(num)) return "0";
  
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B';
  } else if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  
  return num.toString();
}

// Format publish date to relative time (e.g., "2 years ago")
export function formatPublishedAt(publishedAt: string): string {
  const published = new Date(publishedAt);
  const now = new Date();
  
  const seconds = Math.floor((now.getTime() - published.getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  
  if (years > 0) {
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  } else if (months > 0) {
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else if (days > 0) {
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (hours > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else {
    return 'Just now';
  }
}

import { type YouTubeSearchResult, AudioQuality } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Check if we're on GitHub Pages or similar static hosting
const isStaticHosting = window.location.hostname.includes('github.io') || 
                       window.location.hostname.includes('.pages.dev');

// Function to search YouTube videos
export async function searchYouTubeVideos(query: string): Promise<YouTubeSearchResult[]> {
  if (!query.trim()) {
    return [];
  }
  
  // If we're on GitHub Pages, use direct YouTube API
  if (isStaticHosting) {
    const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.error("YouTube API key not found in environment variables");
      return [];
    }
    
    try {
      // Search for videos
      const searchResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=10&q=${encodeURIComponent(query)}&type=video&videoCategoryId=10&key=${API_KEY}`
      );
      
      if (!searchResponse.ok) {
        throw new Error(`YouTube API error: ${searchResponse.statusText}`);
      }
      
      const searchData = await searchResponse.json();
      
      if (!searchData.items || !searchData.items.length) {
        return [];
      }
      
      // Get video details for statistics and duration
      const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');
      const detailsResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${videoIds}&key=${API_KEY}`
      );
      
      if (!detailsResponse.ok) {
        throw new Error(`YouTube API error: ${detailsResponse.statusText}`);
      }
      
      const detailsData = await detailsResponse.json();
      
      // Combine the results
      return searchData.items.map((item: any) => {
        const details = detailsData.items.find(
          (detail: any) => detail.id === item.id.videoId
        );
        
        return {
          id: {
            videoId: item.id.videoId
          },
          snippet: {
            title: item.snippet.title,
            channelTitle: item.snippet.channelTitle,
            publishedAt: item.snippet.publishedAt,
            thumbnails: {
              medium: {
                url: item.snippet.thumbnails.medium.url
              },
              high: {
                url: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url
              }
            }
          },
          statistics: {
            viewCount: details?.statistics?.viewCount || "0"
          },
          contentDetails: {
            duration: details?.contentDetails?.duration || "PT0M0S"
          }
        };
      });
    } catch (error) {
      console.error("Error searching YouTube:", error);
      return [];
    }
  } else {
    // Use the backend API when running on Replit
    const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Error searching videos: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// In-memory storage for static hosting (GitHub Pages)
const staticStorage = {
  recentTracks: [],
  preferences: { audioQuality: "medium" as AudioQuality, volume: 70 }
};

// Function to add a track to recently played
export async function addRecentTrack(trackData: {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}) {
  if (isStaticHosting) {
    // For GitHub Pages, store in memory or localStorage
    const track = {
      id: Date.now(),
      ...trackData
    };
    
    // Add to beginning of array, keep only last 20 tracks
    staticStorage.recentTracks = [track, ...staticStorage.recentTracks.slice(0, 19)];
    
    // Optionally persist to localStorage
    try {
      localStorage.setItem('hearit_recent_tracks', JSON.stringify(staticStorage.recentTracks));
    } catch (e) {
      console.warn('Could not save recent tracks to localStorage', e);
    }
    
    return track;
  } else {
    // For Replit, use the server API
    return apiRequest("POST", "/api/tracks/recent", trackData);
  }
}

// Function to get recently played tracks
export async function getRecentTracks() {
  if (isStaticHosting) {
    // For GitHub Pages, get from memory or localStorage
    // Try to load from localStorage first
    try {
      const savedTracks = localStorage.getItem('hearit_recent_tracks');
      if (savedTracks) {
        staticStorage.recentTracks = JSON.parse(savedTracks);
      }
    } catch (e) {
      console.warn('Could not load recent tracks from localStorage', e);
    }
    
    return staticStorage.recentTracks;
  } else {
    // For Replit, use the server API
    const response = await fetch("/api/tracks/recent", {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching recent tracks: ${response.statusText}`);
    }
    
    return response.json();
  }
}

// Function to update audio quality preference
export async function updateAudioQuality(quality: AudioQuality) {
  if (isStaticHosting) {
    // For GitHub Pages, store in memory or localStorage
    staticStorage.preferences.audioQuality = quality;
    
    // Persist to localStorage
    try {
      localStorage.setItem('hearit_preferences', JSON.stringify(staticStorage.preferences));
    } catch (e) {
      console.warn('Could not save preferences to localStorage', e);
    }
    
    return staticStorage.preferences;
  } else {
    // For Replit, use the server API
    return apiRequest("PATCH", "/api/preferences/quality", { quality });
  }
}

// Function to update volume preference
export async function updateVolume(volume: number) {
  if (isStaticHosting) {
    // For GitHub Pages, store in memory or localStorage
    staticStorage.preferences.volume = volume;
    
    // Persist to localStorage
    try {
      localStorage.setItem('hearit_preferences', JSON.stringify(staticStorage.preferences));
    } catch (e) {
      console.warn('Could not save preferences to localStorage', e);
    }
    
    return staticStorage.preferences;
  } else {
    // For Replit, use the server API
    return apiRequest("PATCH", "/api/preferences/volume", { volume });
  }
}

// Function to get user preferences
export async function getUserPreferences() {
  if (isStaticHosting) {
    // For GitHub Pages, get from memory or localStorage
    // Try to load from localStorage first
    try {
      const savedPreferences = localStorage.getItem('hearit_preferences');
      if (savedPreferences) {
        staticStorage.preferences = JSON.parse(savedPreferences);
      }
    } catch (e) {
      console.warn('Could not load preferences from localStorage', e);
    }
    
    return staticStorage.preferences;
  } else {
    // For Replit, use the server API
    const response = await fetch("/api/preferences", {
      credentials: "include",
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching preferences: ${response.statusText}`);
    }
    
    return response.json();
  }
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

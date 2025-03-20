import { AudioQuality, YouTubeSearchResult } from "@shared/schema";
import * as serverApi from "./youtube";
import * as staticApi from "./staticYoutubeApi";

// Determine if we're running on GitHub Pages
const isStaticHosting = () => {
  return window.location.hostname.includes('github.io') || 
         import.meta.env.VITE_USE_STATIC_API === 'true';
};

// Use the appropriate implementation
const api = isStaticHosting() ? staticApi : serverApi;

// Export all functions from the selected API
export const {
  searchYouTubeVideos,
  addRecentTrack,
  getRecentTracks,
  updateAudioQuality,
  updateVolume,
  getUserPreferences,
  parseDuration,
  formatDuration,
  formatCount,
  formatPublishedAt
} = api;
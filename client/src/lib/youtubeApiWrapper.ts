/**
 * This wrapper automatically selects the appropriate YouTube API implementation
 * based on the environment (GitHub Pages deployment vs regular app)
 */

import * as regularApi from './youtube';
import * as staticApi from './staticYoutubeApi';
import { YouTubeSearchResult, AudioQuality, Track } from '@shared/schema';

// Check if we're in GitHub Pages mode or static mode
const isStaticMode = () => {
  return window.location.hostname.includes('github.io') || 
         import.meta.env.VITE_USE_STATIC_API === 'true';
};

// Select the appropriate API implementation
const api = isStaticMode() ? staticApi : regularApi;

// Re-export all functions from the selected API
export const searchYouTubeVideos = (query: string): Promise<YouTubeSearchResult[]> => {
  return api.searchYouTubeVideos(query);
};

export const addRecentTrack = (trackData: {
  youtubeId: string;
  title: string;
  artist: string;
  thumbnailUrl: string;
  duration: number;
}): Promise<any> => {
  return api.addRecentTrack(trackData);
};

export const getRecentTracks = (): Promise<Track[]> => {
  return api.getRecentTracks();
};

export const updateAudioQuality = (quality: AudioQuality): Promise<any> => {
  return api.updateAudioQuality(quality);
};

export const updateVolume = (volume: number): Promise<any> => {
  return api.updateVolume(volume);
};

export const getUserPreferences = (): Promise<{
  audioQuality: AudioQuality;
  volume: number;
}> => {
  return api.getUserPreferences();
};

// Also re-export utility functions
export const parseDuration = (duration: string): number => {
  return api.parseDuration(duration);
};

export const formatDuration = (seconds: number): string => {
  return api.formatDuration(seconds);
};

export const formatCount = (count: string | number): string => {
  return api.formatCount(count);
};

export const formatPublishedAt = (publishedAt: string): string => {
  return api.formatPublishedAt(publishedAt);
};
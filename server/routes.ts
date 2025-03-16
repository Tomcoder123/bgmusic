import { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertTrackSchema, insertUserPreferencesSchema, AudioQuality } from "@shared/schema";
import axios from "axios";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || "";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Search YouTube videos
  app.get("/api/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            maxResults: 10,
            q: query,
            type: "video",
            videoCategoryId: "10", // Music category
            key: YOUTUBE_API_KEY,
          },
        }
      );

      if (!response.data.items || !Array.isArray(response.data.items)) {
        return res.status(500).json({ message: "Invalid YouTube API response" });
      }

      // Get video IDs for additional information
      const videoIds = response.data.items.map((item: any) => item.id.videoId).join(",");
      
      // Get additional video details to get statistics like view count
      const videoDetails = await axios.get(
        `https://www.googleapis.com/youtube/v3/videos`,
        {
          params: {
            part: "statistics,contentDetails",
            id: videoIds,
            key: YOUTUBE_API_KEY,
          },
        }
      );

      // Combine search results with video details
      const searchResults = response.data.items.map((item: any) => {
        const details = videoDetails.data.items.find(
          (detail: any) => detail.id === item.id.videoId
        );
        
        // Format response to match YouTubeSearchResult interface in schema.ts
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
                url: item.snippet.thumbnails.high.url || item.snippet.thumbnails.medium.url
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

      res.json(searchResults);
    } catch (error) {
      console.error("YouTube API search error:", error);
      res.status(500).json({ message: "Failed to fetch YouTube search results" });
    }
  });

  // Get recent tracks
  app.get("/api/tracks/recent", async (req, res) => {
    try {
      const recentTracks = await storage.getRecentTracks();
      res.json(recentTracks);
    } catch (error) {
      console.error("Error fetching recent tracks:", error);
      res.status(500).json({ message: "Failed to fetch recent tracks" });
    }
  });

  // Add track to recent list
  app.post("/api/tracks/recent", async (req, res) => {
    try {
      const trackData = insertTrackSchema.parse(req.body);
      const track = await storage.addRecentTrack(trackData);
      res.status(201).json(track);
    } catch (error) {
      console.error("Error adding recent track:", error);
      res.status(500).json({ message: "Failed to add track to recent" });
    }
  });

  // Get user preferences
  app.get("/api/preferences", async (req, res) => {
    try {
      // Using userId 1 since we don't have auth in this prototype
      const preferences = await storage.getUserPreferences(1);
      res.json(preferences || { audioQuality: "medium", volume: 70 });
    } catch (error) {
      console.error("Error fetching preferences:", error);
      res.status(500).json({ message: "Failed to fetch preferences" });
    }
  });

  // Update audio quality
  app.patch("/api/preferences/quality", async (req, res) => {
    try {
      const qualitySchema = z.object({
        quality: z.enum(["low", "medium", "high"]),
      });
      
      const { quality } = qualitySchema.parse(req.body);
      
      // Using userId 1 since we don't have auth in this prototype
      const updatedPreferences = await storage.updateAudioQuality(1, quality);
      res.json(updatedPreferences);
    } catch (error) {
      console.error("Error updating audio quality:", error);
      res.status(500).json({ message: "Failed to update audio quality" });
    }
  });

  // Update volume
  app.patch("/api/preferences/volume", async (req, res) => {
    try {
      const volumeSchema = z.object({
        volume: z.number().min(0).max(100),
      });
      
      const { volume } = volumeSchema.parse(req.body);
      
      // Using userId 1 since we don't have auth in this prototype
      const updatedPreferences = await storage.updateVolume(1, volume);
      res.json(updatedPreferences);
    } catch (error) {
      console.error("Error updating volume:", error);
      res.status(500).json({ message: "Failed to update volume" });
    }
  });

  // Get playlists
  app.get("/api/playlists", async (req, res) => {
    try {
      // Using userId 1 since we don't have auth in this prototype
      const playlists = await storage.getPlaylists(1);
      res.json(playlists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
      res.status(500).json({ message: "Failed to fetch playlists" });
    }
  });

  // Create playlist
  app.post("/api/playlists", async (req, res) => {
    try {
      const playlistSchema = z.object({
        title: z.string().min(1),
        coverUrl: z.string().url(),
      });
      
      const playlistData = playlistSchema.parse(req.body);
      
      // Using userId 1 since we don't have auth in this prototype
      const playlist = await storage.createPlaylist({
        ...playlistData,
        userId: 1,
      });
      
      res.status(201).json(playlist);
    } catch (error) {
      console.error("Error creating playlist:", error);
      res.status(500).json({ message: "Failed to create playlist" });
    }
  });

  return httpServer;
}

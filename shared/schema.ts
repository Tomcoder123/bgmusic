import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table with authentication info
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Tracks table to store recently played or saved tracks
export const tracks = pgTable("tracks", {
  id: serial("id").primaryKey(),
  youtubeId: text("youtube_id").notNull(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  thumbnailUrl: text("thumbnail_url").notNull(),
  duration: integer("duration").notNull(), // in seconds
  addedAt: timestamp("added_at").defaultNow().notNull(),
});

// Playlists table
export const playlists = pgTable("playlists", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  coverUrl: text("cover_url").notNull(),
  userId: integer("user_id").notNull(),
});

// PlaylistTracks junction table
export const playlistTracks = pgTable("playlist_tracks", {
  id: serial("id").primaryKey(),
  playlistId: integer("playlist_id").notNull(),
  trackId: integer("track_id").notNull(),
  position: integer("position").notNull(),
});

// User preferences
export const userPreferences = pgTable("user_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(),
  audioQuality: text("audio_quality").notNull().default("medium"),
  volume: integer("volume").notNull().default(70),
  recentSearches: json("recent_searches").default([]),
});

// ======= Insert Schemas =======

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTrackSchema = createInsertSchema(tracks).pick({
  youtubeId: true,
  title: true,
  artist: true,
  thumbnailUrl: true,
  duration: true,
});

export const insertPlaylistSchema = createInsertSchema(playlists).pick({
  title: true,
  coverUrl: true,
  userId: true,
});

export const insertPlaylistTrackSchema = createInsertSchema(playlistTracks).pick({
  playlistId: true,
  trackId: true,
  position: true,
});

export const insertUserPreferencesSchema = createInsertSchema(userPreferences).pick({
  userId: true,
  audioQuality: true,
  volume: true,
});

// ======= Types =======

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertTrack = z.infer<typeof insertTrackSchema>;
export type Track = typeof tracks.$inferSelect;

export type InsertPlaylist = z.infer<typeof insertPlaylistSchema>;
export type Playlist = typeof playlists.$inferSelect;

export type InsertPlaylistTrack = z.infer<typeof insertPlaylistTrackSchema>;
export type PlaylistTrack = typeof playlistTracks.$inferSelect;

export type InsertUserPreferences = z.infer<typeof insertUserPreferencesSchema>;
export type UserPreferences = typeof userPreferences.$inferSelect;

// ======= YouTube API Response Types =======

export interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    channelTitle: string;
    publishedAt: string;
    thumbnails: {
      medium: {
        url: string;
      };
      high: {
        url: string;
      };
    };
  };
  statistics?: {
    viewCount: string;
  };
}

export type AudioQuality = "low" | "medium" | "high";

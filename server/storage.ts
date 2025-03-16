import { 
  User, InsertUser, 
  Track, InsertTrack, 
  Playlist, InsertPlaylist, 
  PlaylistTrack, InsertPlaylistTrack, 
  UserPreferences, InsertUserPreferences,
  AudioQuality,
  users
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Track methods
  getRecentTracks(limit?: number): Promise<Track[]>;
  addRecentTrack(track: InsertTrack): Promise<Track>;
  
  // Playlist methods
  getPlaylists(userId: number): Promise<Playlist[]>;
  getPlaylistById(id: number): Promise<Playlist | undefined>;
  createPlaylist(playlist: InsertPlaylist): Promise<Playlist>;
  
  // Playlist tracks methods
  getPlaylistTracks(playlistId: number): Promise<Track[]>;
  addTrackToPlaylist(playlistTrack: InsertPlaylistTrack): Promise<PlaylistTrack>;
  
  // User preferences methods
  getUserPreferences(userId: number): Promise<UserPreferences | undefined>;
  updateAudioQuality(userId: number, quality: AudioQuality): Promise<UserPreferences>;
  updateVolume(userId: number, volume: number): Promise<UserPreferences>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tracks: Map<number, Track>;
  private playlists: Map<number, Playlist>;
  private playlistTracks: Map<number, PlaylistTrack>;
  private userPreferences: Map<number, UserPreferences>;
  
  private usersId: number;
  private tracksId: number;
  private playlistsId: number;
  private playlistTracksId: number;
  private userPreferencesId: number;

  constructor() {
    this.users = new Map();
    this.tracks = new Map();
    this.playlists = new Map();
    this.playlistTracks = new Map();
    this.userPreferences = new Map();
    
    this.usersId = 1;
    this.tracksId = 1;
    this.playlistsId = 1;
    this.playlistTracksId = 1;
    this.userPreferencesId = 1;
    
    // Add some sample playlists
    this.createPlaylist({
      title: "Workout Mix",
      coverUrl: "https://images.unsplash.com/photo-1458560871784-56d23406c091",
      userId: 1
    });
    
    this.createPlaylist({
      title: "Chill Vibes",
      coverUrl: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1",
      userId: 1
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.usersId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Track methods
  async getRecentTracks(limit: number = 10): Promise<Track[]> {
    return Array.from(this.tracks.values())
      .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
      .slice(0, limit);
  }
  
  async addRecentTrack(insertTrack: InsertTrack): Promise<Track> {
    // Check if track with same YouTube ID exists
    const existingTrack = Array.from(this.tracks.values()).find(
      track => track.youtubeId === insertTrack.youtubeId
    );
    
    if (existingTrack) {
      // Update the added date to bring it to the top of recent tracks
      const updatedTrack = { ...existingTrack, addedAt: new Date() };
      this.tracks.set(existingTrack.id, updatedTrack);
      return updatedTrack;
    } else {
      const id = this.tracksId++;
      const track: Track = { 
        ...insertTrack, 
        id, 
        addedAt: new Date() 
      };
      this.tracks.set(id, track);
      return track;
    }
  }
  
  // Playlist methods
  async getPlaylists(userId: number): Promise<Playlist[]> {
    return Array.from(this.playlists.values())
      .filter(playlist => playlist.userId === userId);
  }
  
  async getPlaylistById(id: number): Promise<Playlist | undefined> {
    return this.playlists.get(id);
  }
  
  async createPlaylist(insertPlaylist: InsertPlaylist): Promise<Playlist> {
    const id = this.playlistsId++;
    const playlist: Playlist = { ...insertPlaylist, id };
    this.playlists.set(id, playlist);
    return playlist;
  }
  
  // Playlist tracks methods
  async getPlaylistTracks(playlistId: number): Promise<Track[]> {
    const playlistTracksEntries = Array.from(this.playlistTracks.values())
      .filter(pt => pt.playlistId === playlistId)
      .sort((a, b) => a.position - b.position);
    
    const tracks: Track[] = [];
    for (const entry of playlistTracksEntries) {
      const track = this.tracks.get(entry.trackId);
      if (track) tracks.push(track);
    }
    
    return tracks;
  }
  
  async addTrackToPlaylist(insertPlaylistTrack: InsertPlaylistTrack): Promise<PlaylistTrack> {
    const id = this.playlistTracksId++;
    const playlistTrack: PlaylistTrack = { ...insertPlaylistTrack, id };
    this.playlistTracks.set(id, playlistTrack);
    return playlistTrack;
  }
  
  // User preferences methods
  async getUserPreferences(userId: number): Promise<UserPreferences | undefined> {
    return this.userPreferences.get(userId) || this.createDefaultPreferences(userId);
  }
  
  async updateAudioQuality(userId: number, quality: AudioQuality): Promise<UserPreferences> {
    const preferences = await this.getUserPreferences(userId);
    
    if (preferences) {
      const updatedPreferences = { ...preferences, audioQuality: quality };
      this.userPreferences.set(userId, updatedPreferences);
      return updatedPreferences;
    } else {
      return this.createDefaultPreferences(userId, { audioQuality: quality });
    }
  }
  
  async updateVolume(userId: number, volume: number): Promise<UserPreferences> {
    const preferences = await this.getUserPreferences(userId);
    
    if (preferences) {
      const updatedPreferences = { ...preferences, volume };
      this.userPreferences.set(userId, updatedPreferences);
      return updatedPreferences;
    } else {
      return this.createDefaultPreferences(userId, { volume });
    }
  }
  
  // Helper for creating default preferences
  private async createDefaultPreferences(
    userId: number, 
    overrides: Partial<Omit<UserPreferences, 'id' | 'userId'>> = {}
  ): Promise<UserPreferences> {
    const id = this.userPreferencesId++;
    const preferences: UserPreferences = { 
      id, 
      userId, 
      audioQuality: overrides.audioQuality || "medium", 
      volume: overrides.volume !== undefined ? overrides.volume : 70, 
      recentSearches: overrides.recentSearches || []
    };
    
    this.userPreferences.set(userId, preferences);
    return preferences;
  }
}

export const storage = new MemStorage();

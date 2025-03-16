import { useState } from "react";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";
import CurrentlyPlaying from "@/components/CurrentlyPlaying";
import RecentlyPlayed from "@/components/RecentlyPlayed";
import SearchResults from "@/components/SearchResults";
import Playlists from "@/components/Playlists";
import MusicPlayer from "@/components/MusicPlayer";
import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { currentTrack } = useContext(PlayerContext);
  
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <SearchBar onSearch={handleSearch} />
      
      {/* Main content area with overflow */}
      <main className="flex-1 overflow-y-auto pb-24">
        {currentTrack && <CurrentlyPlaying />}
        <RecentlyPlayed />
        <SearchResults searchQuery={searchQuery} />
        <Playlists />
      </main>
      
      <MusicPlayer />
    </div>
  );
}

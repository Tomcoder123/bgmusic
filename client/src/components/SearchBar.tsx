import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  
  useEffect(() => {
    setShowClearButton(searchQuery.length > 0);
    
    // Debounce search to avoid excessive API calls
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        onSearch(searchQuery);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchQuery, onSearch]);
  
  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
  };
  
  return (
    <div className="px-4 py-3 bg-card shadow-sm">
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for songs, artists, or albums" 
          className="w-full bg-muted pl-10 pr-4 py-2 rounded-full text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        {showClearButton && (
          <button 
            className="absolute right-3 top-2.5 text-muted-foreground"
            onClick={handleClear}
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

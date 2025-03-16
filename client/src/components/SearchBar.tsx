import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showClearButton, setShowClearButton] = useState(false);
  const [focused, setFocused] = useState(false);
  
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
    <div className="px-6 py-3">
      <div className="relative max-w-xl mx-auto">
        <input 
          type="text" 
          placeholder="Search for songs, artists, or albums" 
          className={`w-full bg-secondary/70 pl-10 pr-4 py-2.5 rounded-lg text-sm text-foreground 
                     focus:outline-none border-0 transition-all duration-300
                     ${focused ? 'ring-2 ring-primary/50 bg-secondary' : ''}`}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
        <Search className="absolute left-3 top-3 h-4.5 w-4.5 text-primary opacity-70" />
        {showClearButton && (
          <button 
            className="absolute right-3 top-2.5 bg-muted rounded-full p-0.5
                      text-muted-foreground hover:bg-secondary transition-colors"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      
      {/* Apple Music style search filters - simplified to focus on songs only */}
      <div className="flex justify-center mt-3 text-xs font-medium">
        <button className="apple-button text-xs py-1 px-3">Songs</button>
      </div>
    </div>
  );
}

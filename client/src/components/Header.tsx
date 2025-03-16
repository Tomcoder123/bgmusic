import { Moon, Music } from "lucide-react";
import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";

export default function Header() {
  const { toggleTheme } = useContext(PlayerContext);
  
  return (
    <header className="bg-card px-6 py-4 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center">        
        <span className="text-primary mr-3">
          <Music 
            size={24}
            strokeWidth={2}
            className="apple-text-gradient"
          />
        </span>
        <h1 className="text-xl font-semibold apple-text-gradient">HearIt</h1>
      </div>
      
      <button 
        className="p-2 rounded-full hover:bg-secondary transition-colors"
        onClick={toggleTheme}
      >
        <Moon className="text-muted-foreground" size={18} />
      </button>
    </header>
  );
}

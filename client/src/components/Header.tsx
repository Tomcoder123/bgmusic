import { Moon } from "lucide-react";
import { useContext } from "react";
import { PlayerContext } from "@/context/PlayerContext";

export default function Header() {
  const { toggleTheme } = useContext(PlayerContext);
  
  return (
    <header className="bg-card px-4 py-3 flex items-center justify-between shadow-md">
      <div className="flex items-center">
        <span className="text-primary mr-2">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        </span>
        <h1 className="text-xl font-semibold">MeloTube</h1>
      </div>
      <button className="p-2" onClick={toggleTheme}>
        <Moon className="text-muted-foreground" />
      </button>
    </header>
  );
}

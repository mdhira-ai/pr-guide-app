import React from "react";
import { Moon, Sun, Computer } from "lucide-react";
import { cn } from "@/lib/utils";

interface DarkModeSwitchProps {
  className?: string;
  darkMode: boolean;
  toggleDarkMode: () => void;
  resetToSystemPreference?: () => void;
}

export function DarkModeSwitch({ 
  className, 
  darkMode, 
  toggleDarkMode,
  resetToSystemPreference 
}: DarkModeSwitchProps) {
  const [showOptions, setShowOptions] = React.useState(false);
  
  // Close the dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowOptions(false);
    };
    
    if (showOptions) {
      document.addEventListener('click', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showOptions]);

  return (
    <div className="relative">
      <button
        onClick={toggleDarkMode}
        onContextMenu={(e) => {
          e.preventDefault();
          setShowOptions(!showOptions);
        }}
        className={cn(
          "rounded-full p-2 transition-colors focus:outline-none",
          darkMode ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-slate-200 text-slate-800 hover:bg-slate-300",
          className
        )}
        title={`${darkMode ? "Switch to light mode" : "Switch to dark mode"} (Right-click for more options)`}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>
      
      {showOptions && resetToSystemPreference && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-card border border-border z-10">
          <div className="py-1" role="menu" aria-orientation="vertical">
            <button
              className="flex items-center w-full px-4 py-2 text-sm text-left hover:bg-accent"
              onClick={() => {
                resetToSystemPreference();
                setShowOptions(false);
              }}
            >
              <Computer size={16} className="mr-2" />
              <span>Use system preference</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

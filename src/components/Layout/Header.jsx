// frontend/src/components/Layout/Header.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import { User, Sun, Moon, LogOut, ChevronDown, Settings } from "lucide-react";

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fermer le dropdown en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
    setIsDropdownOpen(false);
  };

  return (
    <header className="glass-panel border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="AVO Carbon Group" 
              className="h-8 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => navigate(0)}
            />
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-white/70 dark:bg-white/10 hover:bg-white/90 dark:hover:bg-white/20 border border-border transition-all hover:scale-105 active:scale-95"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5 text-secondary" />
              ) : (
                <Moon className="w-5 h-5 text-muted-foreground" />
              )}
            </button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-all duration-200"
                >
                  <div className="hidden md:flex flex-col items-end space-y-1">
                    <span className="text-sm font-medium text-foreground leading-tight">
                      {user.full_name || user.email}
                    </span>
                    <span className="text-xs text-muted-foreground leading-tight">
                      {user.role || "User"}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg ring-2 ring-white/20">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.full_name || user.email}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <ChevronDown 
                      className={`w-4 h-4 text-muted-foreground absolute -bottom-1 -right-1 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-border overflow-hidden animate-in slide-in-from-top-5 duration-200 z-50">
                    <div className="p-4 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">
                        {user.full_name || user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {user.email}
                      </p>
                      {user.role && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                          {user.role}
                        </span>
                      )}
                    </div>
                    
                    <div className="p-2">
                      <button
                        onClick={() => {
                          navigate("/profile");
                          setIsDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors text-left group"
                      >
                        <Settings className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-primary transition-colors">
                          Profile Settings
                        </span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors text-left group mt-1"
                      >
                        <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors" />
                        <span className="text-sm text-foreground group-hover:text-red-600 dark:group-hover:text-red-400 font-medium transition-colors">
                          <LogOut className="w-4 h-4" />
                          Logout
                        </span>
                      </button>
                    </div>
                    
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 border-t border-border">
                      <p className="text-xs text-muted-foreground">
                        v{process.env.REACT_APP_VERSION || "1.0.0"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-medium hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

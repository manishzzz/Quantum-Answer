import React, { useState, useRef, useEffect } from 'react';
import { User, Question } from '../types';
import UserProfile from './UserProfile';
import { PlusIcon, LoginIcon, UserPlusIcon, LeaderboardIcon } from './Icons';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

interface HeaderProps {
    isAuthenticated: boolean;
    currentUser: User | null;
    onLogoClick: () => void;
    onAskQuestionClick: () => void;
    onMyContributionsClick: () => void;
    onSettingsClick: () => void;
    onSignOut: () => void;
    onNavigateToLogin: () => void;
    onNavigateToSignUp: () => void;
    onLeaderboardClick: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    searchResults: Question[];
    onSelectQuestion: (questionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isAuthenticated,
  currentUser,
  onLogoClick, 
  onAskQuestionClick,
  onMyContributionsClick,
  onSettingsClick,
  onSignOut,
  onNavigateToLogin,
  onNavigateToSignUp,
  onLeaderboardClick,
  searchQuery,
  onSearchChange,
  searchResults,
  onSelectQuestion,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
            setIsProfileOpen(false);
        }
        if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
            setIsSearchFocused(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const handleSelectAndClose = (questionId: string) => {
    onSelectQuestion(questionId);
    setIsSearchFocused(false);
    onSearchChange('');
  }
  
  const handleContributionsClick = () => {
    onMyContributionsClick();
    setIsProfileOpen(false);
  }
  
  const handleSettingsClick = () => {
    onSettingsClick();
    setIsProfileOpen(false);
  }

  return (
    <header className="bg-brand-surface/80 border-b border-brand-border sticky top-0 z-30 backdrop-blur-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-6">
            <button onClick={onLogoClick} className="flex items-center space-x-2 group">
              <span className="text-2xl font-bold text-brand-secondary group-hover:text-brand-primary transition-colors">
                Quantum
              </span>
              <span className="text-2xl font-bold text-brand-primary group-hover:text-brand-secondary transition-colors">
                Answer
              </span>
            </button>
          </div>
          
          <div className="flex-1 flex justify-center px-8">
            <div className="w-full max-w-xl relative" ref={searchRef}>
              <SearchBar 
                query={searchQuery}
                onQueryChange={onSearchChange}
                onFocus={() => setIsSearchFocused(true)}
              />
              {isSearchFocused && searchQuery && (
                <SearchResults 
                  results={searchResults}
                  onSelectResult={handleSelectAndClose}
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated && currentUser ? (
              <>
                <button
                    onClick={onLeaderboardClick}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-surface text-brand-secondary font-semibold rounded-lg hover:bg-brand-border transition-colors"
                >
                    <LeaderboardIcon />
                    <span>Leaderboards</span>
                </button>
                <button
                    onClick={onAskQuestionClick}
                    className="hidden md:flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-lg hover:shadow-brand-primary/50"
                >
                    <PlusIcon />
                    <span>Ask Question</span>
                </button>
                <div className="relative" ref={profileMenuRef}>
                  <button
                    onClick={() => setIsProfileOpen(prev => !prev)}
                    className="flex items-center space-x-2 rounded-full hover:opacity-80 transition-opacity"
                    aria-label="Open user profile"
                    aria-haspopup="true"
                    aria-expanded={isProfileOpen}
                  >
                    <img 
                      src={currentUser.avatarUrl} 
                      alt={currentUser.name} 
                      className="w-10 h-10 rounded-full border-2 border-brand-border hover:border-brand-primary transition-colors"
                    />
                  </button>
                  {isProfileOpen && (
                    <UserProfile 
                      user={currentUser} 
                      onMyContributionsClick={handleContributionsClick}
                      onSettingsClick={handleSettingsClick}
                      onSignOut={onSignOut}
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                 <button
                    onClick={onNavigateToLogin}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-surface text-brand-secondary font-semibold rounded-lg hover:bg-brand-border transition-colors"
                  >
                    <LoginIcon />
                    <span>Sign In</span>
                  </button>
                  <button
                    onClick={onNavigateToSignUp}
                    className="flex items-center gap-2 px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-300"
                  >
                    <UserPlusIcon />
                    <span>Sign Up</span>
                  </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
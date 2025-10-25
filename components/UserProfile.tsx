import React from 'react';
import { User } from '../types';
import { ReputationIcon, SignOutIcon } from './Icons';

interface UserProfileProps {
  user: User;
  onMyContributionsClick: () => void;
  onSettingsClick: () => void;
  onSignOut: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onMyContributionsClick, onSettingsClick, onSignOut }) => {
  return (
    <div className="absolute top-full right-0 mt-2 w-64 bg-brand-surface-glass rounded-xl shadow-2xl border border-white/10 z-20 animate-fade-in backdrop-blur-xl" style={{ animationDuration: '150ms' }}>
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
          <div>
            <p className="font-bold text-lg text-brand-secondary">{user.name}</p>
            <div className="flex items-center text-sm text-yellow-400">
              <ReputationIcon className="w-4 h-4" />
              <span className="ml-1 font-semibold">{user.reputation} Reputation</span>
            </div>
          </div>
        </div>
      </div>
      <div className="py-2">
        <button
          onClick={onMyContributionsClick}
          className="w-full text-left block px-4 py-2 text-sm text-brand-secondary hover:bg-white/10 transition-colors"
          role="menuitem"
        >
          My Contributions
        </button>
        <button
          onClick={onSettingsClick}
          className="w-full text-left block px-4 py-2 text-sm text-brand-secondary hover:bg-white/10 transition-colors"
          role="menuitem"
        >
          Settings
        </button>
      </div>
      <div className="py-2 border-t border-white/10">
        <button onClick={onSignOut} className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors" role="menuitem">
          <SignOutIcon />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default UserProfile;

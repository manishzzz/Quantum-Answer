import React from 'react';
import { AnswerVersion, User } from '../types';
import { ReputationIcon } from './Icons';

interface TimelineProps {
  versions: AnswerVersion[];
  users: User[];
  activeIndex: number;
  onSelectVersion: (index: number) => void;
  isLoading?: boolean;
}

const Timeline: React.FC<TimelineProps> = ({ versions, users, activeIndex, onSelectVersion, isLoading = false }) => {
  return (
    <div className={`bg-brand-surface rounded-xl border border-brand-border p-4 transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      <ul className="space-y-2">
        {versions.map((version, index) => {
          const author = users.find(u => u.id === version.authorId);
          if (!author) return null;

          const isActive = activeIndex === index;

          return (
            <li key={version.id}>
              <button
                onClick={() => onSelectVersion(index)}
                className={`w-full text-left p-3 rounded-lg transition-all duration-300 transform-gpu ${
                  isActive
                    ? 'bg-brand-primary text-white shadow-lg scale-105'
                    : 'bg-brand-surface hover:bg-brand-border hover:scale-102'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={author.avatarUrl} alt={author.name} className={`w-9 h-9 rounded-full border-2 ${isActive ? 'border-white/50' : 'border-brand-border'}`} />
                    <div>
                      <p className={`font-semibold ${isActive ? 'text-white' : 'text-brand-secondary'}`}>Version {index + 1}</p>
                      <p className={`text-xs ${isActive ? 'text-indigo-200' : 'text-brand-muted'}`}>by {author.name}</p>
                    </div>
                  </div>
                   <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isActive ? 'bg-white/20 text-yellow-300' : 'bg-yellow-900/50 text-yellow-400'}`}>
                      <ReputationIcon className="w-3 h-3" />
                      <span className="ml-1">{author.reputation}</span>
                   </div>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  );
};

export default Timeline;
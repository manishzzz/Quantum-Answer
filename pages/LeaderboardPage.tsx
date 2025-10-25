import React, { useState, useMemo } from 'react';
import { Question, User } from '../types';
import { ArrowLeftIcon, ReputationIcon, TrophyIcon } from '../components/Icons';

interface LeaderboardPageProps {
  users: User[];
  questions: Question[];
  onNavigateBack: () => void;
}

type SortKey = 'reputation' | 'questions' | 'answers';

interface UserStats extends User {
  questionsAsked: number;
  answersContributed: number;
}

const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ users, questions, onNavigateBack }) => {
  const [sortKey, setSortKey] = useState<SortKey>('reputation');

  const userStats: UserStats[] = useMemo(() => {
    return users.map(user => ({
      ...user,
      questionsAsked: questions.filter(q => q.authorId === user.id).length,
      answersContributed: questions.reduce((acc, q) => {
        return acc + q.versions.filter(v => v.authorId === user.id).length;
      }, 0),
    }));
  }, [users, questions]);

  const sortedUsers = useMemo(() => {
    return [...userStats].sort((a, b) => {
      switch (sortKey) {
        case 'questions':
          return b.questionsAsked - a.questionsAsked;
        case 'answers':
          return b.answersContributed - a.answersContributed;
        case 'reputation':
        default:
          return b.reputation - a.reputation;
      }
    });
  }, [userStats, sortKey]);

  const getRankHighlight = (rank: number) => {
    switch (rank) {
      case 0: return 'border-yellow-400 bg-yellow-900/20 shadow-lg shadow-yellow-500/10';
      case 1: return 'border-gray-400 bg-gray-900/20 shadow-lg shadow-gray-500/10';
      case 2: return 'border-orange-400 bg-orange-900/20 shadow-lg shadow-orange-500/10';
      default: return 'border-brand-border bg-brand-surface';
    }
  };
  
  const getTrophyColor = (rank: number) => {
    switch (rank) {
      case 0: return 'text-yellow-400';
      case 1: return 'text-gray-400';
      case 2: return 'text-orange-400';
      default: return 'text-brand-muted';
    }
  }

  const TabButton = ({ id, label }: { id: SortKey, label: string }) => (
    <button
      onClick={() => setSortKey(id)}
      className={`px-4 py-2 font-semibold transition-colors rounded-md ${sortKey === id ? 'bg-brand-primary text-white' : 'text-brand-muted hover:bg-brand-surface'}`}
    >
      {label}
    </button>
  );

  return (
    <div className="animate-fade-in max-w-4xl mx-auto">
      <button onClick={onNavigateBack} className="flex items-center gap-2 text-brand-muted hover:text-brand-secondary transition-colors mb-6">
        <ArrowLeftIcon />
        <span>Back</span>
      </button>
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-brand-secondary">Leaderboards</h1>
        <p className="text-lg text-brand-muted mt-2">See who's leading the evolution of knowledge.</p>
      </div>

      <div className="flex justify-center mb-8">
        <div className="inline-flex items-center bg-brand-surface-glass p-2 rounded-lg border border-brand-border space-x-2">
          <TabButton id="reputation" label="Reputation" />
          <TabButton id="questions" label="Questions Asked" />
          <TabButton id="answers" label="Answers Contributed" />
        </div>
      </div>

      <div className="space-y-3">
        {sortedUsers.map((user, index) => {
          let value;
          switch (sortKey) {
            case 'questions': value = `${user.questionsAsked} Questions`; break;
            case 'answers': value = `${user.answersContributed} Answers`; break;
            default: value = `${user.reputation} Reputation`;
          }
          
          return (
            <div 
              key={user.id}
              className={`flex items-center p-4 rounded-xl border transition-all duration-300 transform-gpu hover:scale-102 ${getRankHighlight(index)}`}
            >
              <div className={`w-12 text-2xl font-bold text-center ${getTrophyColor(index)} flex-shrink-0 flex items-center justify-center gap-2`}>
                {index < 3 ? <TrophyIcon /> : `#${index + 1}`}
              </div>
              <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full mx-4" />
              <div className="flex-grow">
                <p className="font-bold text-lg text-brand-secondary">{user.name}</p>
              </div>
              <div className="flex items-center text-lg font-semibold">
                {sortKey === 'reputation' && <ReputationIcon className={`mr-2 ${getTrophyColor(index)}`} />}
                <span className={sortKey === 'reputation' ? getTrophyColor(index) : 'text-brand-secondary'}>
                  {value}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeaderboardPage;
import React from 'react';
import { Question, User, QuestionStatus } from '../types';
import { ReputationIcon, LikeIcon, SparklesIcon, TagIcon } from './Icons';

interface QuestionCardProps {
  question: Question;
  author: User;
  onSelect: () => void;
  onTagClick: (tag: string) => void;
  recommendationReason?: string;
}

const getStatusBadgeStyle = (status: QuestionStatus) => {
    switch (status) {
        case 'evolving':
            return 'bg-blue-600/80 text-blue-100 border-blue-500';
        case 'resolved':
            return 'bg-green-600/80 text-green-100 border-green-500';
        case 'archived':
            return 'bg-gray-600/80 text-gray-100 border-gray-500';
    }
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, author, onSelect, onTagClick, recommendationReason }) => {
  const totalLikes = question.versions.reduce((sum, v) => sum + v.likes, 0);
  const evolutionCount = question.versions.length;
  
  const handleTagClick = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation(); // Prevent the card's onSelect from firing
    onTagClick(tag);
  };

  return (
    <div 
        onClick={onSelect}
        className="h-full bg-brand-surface-glass border border-white/10 rounded-xl p-6 cursor-pointer group relative overflow-hidden transition-all duration-300 hover:border-brand-primary/50 hover:scale-105 backdrop-blur-xl flex flex-col"
    >
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-brand-primary/20 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-500 animate-spin-slow"></div>
        <div className="relative z-10 flex flex-col h-full">
            {recommendationReason && (
              <div className="mb-3 p-2 bg-brand-primary/20 border border-brand-primary/50 rounded-lg text-sm text-indigo-300 flex items-start gap-2">
                <SparklesIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span className="italic">{recommendationReason}</span>
              </div>
            )}
            
            <h2 className="text-2xl font-bold text-brand-secondary mb-3 group-hover:text-brand-primary transition-colors">{question.title}</h2>
            
            <div className="flex items-center text-sm text-brand-muted mb-4">
                <img src={author.avatarUrl} alt={author.name} className="w-6 h-6 rounded-full mr-2"/>
                <span>{author.name}</span>
                <span className="mx-2">•</span>
                <div className="flex items-center text-yellow-400">
                    <ReputationIcon className="w-4 h-4" />
                    <span className="ml-1 font-semibold">{author.reputation}</span>
                </div>
            </div>

            {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {question.tags.map(tag => (
                        <button 
                            key={tag}
                            onClick={(e) => handleTagClick(e, tag)}
                            className="px-2.5 py-1 text-xs font-semibold text-brand-muted bg-brand-surface rounded-full hover:bg-brand-primary hover:text-white transition-colors"
                        >
                            #{tag}
                        </button>
                    ))}
                </div>
            )}

            <div className="flex-grow"></div>

            <div className="mt-auto pt-4 flex items-center justify-between text-brand-muted border-t border-white/10">
                <div className={`px-2 py-0.5 text-xs font-bold rounded-full capitalize border ${getStatusBadgeStyle(question.status)}`}>
                    {question.status}
                </div>
                <div className="text-sm">
                    <span className="font-bold text-brand-secondary">{evolutionCount}</span> {evolutionCount > 1 ? 'Evolutions' : 'Evolution'}
                </div>
                <div className="flex items-center text-sm">
                     <LikeIcon />
                    <span className="ml-2 font-bold text-brand-secondary">{totalLikes}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default QuestionCard;
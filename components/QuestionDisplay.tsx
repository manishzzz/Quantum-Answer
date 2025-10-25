import React, { useState, useRef, useEffect } from 'react';
import { Question, User, QuestionStatus } from '../types';
import { ShareIcon, ReputationIcon, EllipsisVerticalIcon, TagIcon } from './Icons';
import ShareMenu from './ShareMenu';

interface QuestionDisplayProps {
  question: Question;
  author: User;
  currentUser: User | null;
  onStatusChange: (newStatus: QuestionStatus) => void;
}

const getStatusBadgeStyle = (status: QuestionStatus) => {
    switch (status) {
        case 'evolving':
            return 'bg-blue-600/80 text-blue-100 border-blue-400';
        case 'resolved':
            return 'bg-green-600/80 text-green-100 border-green-400';
        case 'archived':
            return 'bg-gray-600/80 text-gray-100 border-gray-400';
    }
};

const StatusBadge: React.FC<{ status: QuestionStatus, className?: string }> = ({ status, className = ''}) => (
    <div className={`px-3 py-1 text-sm font-bold rounded-full capitalize border ${getStatusBadgeStyle(status)} ${className}`}>
        {status}
    </div>
);


const QuestionDisplay: React.FC<QuestionDisplayProps> = ({ question, author, currentUser, onStatusChange }) => {
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const statusMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (shareMenuRef.current && !shareMenuRef.current.contains(event.target as Node)) {
            setIsShareMenuOpen(false);
        }
        if (statusMenuRef.current && !statusMenuRef.current.contains(event.target as Node)) {
            setIsStatusMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isAuthor = currentUser?.id === question.authorId;
  const availableStatuses: QuestionStatus[] = ['evolving', 'resolved', 'archived'];

  return (
    <div className="p-8 bg-brand-surface rounded-xl border border-brand-border shadow-xl">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <StatusBadge status={question.status} />
            <h1 className="text-4xl font-extrabold text-brand-secondary">{question.title}</h1>
          </div>
          <div className="flex items-center text-md text-brand-muted space-x-6 mb-4 flex-wrap">
            <div className="flex items-center">
              <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full mr-3" />
              <span>Asked by <span className="font-bold text-brand-secondary">{author.name}</span></span>
            </div>
            <div className="flex items-center text-yellow-400">
              <ReputationIcon />
              <span className="ml-2 font-bold">{author.reputation}</span>
            </div>
          </div>
          {question.tags && question.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
                <TagIcon className="h-5 w-5 text-brand-muted" />
                {question.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 text-sm font-semibold text-brand-muted bg-brand-bg rounded-full">
                        {tag}
                    </span>
                ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
            {isAuthor && (
                <div className="relative" ref={statusMenuRef}>
                    <button
                        onClick={() => setIsStatusMenuOpen(prev => !prev)}
                        className="p-3 rounded-full hover:bg-brand-border transition-colors text-brand-muted hover:text-brand-secondary"
                        aria-label="Change status"
                    >
                        <EllipsisVerticalIcon />
                    </button>
                    {isStatusMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-brand-surface-glass rounded-xl shadow-2xl border border-white/10 z-20 animate-fade-in backdrop-blur-xl">
                            <div className="p-2">
                                <p className="px-2 py-1 text-xs font-semibold text-brand-muted">Set Status</p>
                                {availableStatuses.map(status => (
                                    <button 
                                        key={status}
                                        onClick={() => {
                                            onStatusChange(status);
                                            setIsStatusMenuOpen(false);
                                        }}
                                        className="w-full text-left capitalize px-2 py-1.5 text-sm rounded-md text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors"
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
            <div className="relative" ref={shareMenuRef}>
            <button
                onClick={() => setIsShareMenuOpen(prev => !prev)}
                className="p-3 rounded-full hover:bg-brand-border transition-colors text-brand-muted hover:text-brand-secondary"
                aria-label="Share question"
                aria-haspopup="true"
                aria-expanded={isShareMenuOpen}
            >
                <ShareIcon />
            </button>
            {isShareMenuOpen && (
                <ShareMenu questionTitle={question.title} url={window.location.href} />
            )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
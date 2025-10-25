import React, { useState } from 'react';
import { AnswerVersion, DiffSegment, User, Comment } from '../types';
import { AiIcon, ReputationIcon, LikeIcon, EditIcon, HistoryIcon, ChevronDownIcon, ChevronUpIcon, CommentIcon } from './Icons';
import CommentList from './CommentList';
import CommentForm from './CommentForm';

interface AnswerViewerProps {
  diff: DiffSegment[];
  version: AnswerVersion;
  author: User;
  onLike: (versionId: string) => void;
  onAddComment: (versionId: string, content: string) => void;
  currentUser: User | null;
  isLatestVersion: boolean;
  onEdit: (versionId: string) => void;
  onEvolve: () => void;
  history: AnswerVersion[];
  allUsers: User[];
}

const AnswerViewer: React.FC<AnswerViewerProps> = ({ 
  diff, 
  version, 
  author, 
  onLike,
  onAddComment,
  currentUser,
  isLatestVersion,
  onEdit,
  onEvolve,
  history,
  allUsers,
}) => {
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);

  const getSegmentStyle = (type: DiffSegment['type']) => {
    switch (type) {
      case 'added':
        return 'bg-diff-add text-diff-add-text rounded px-2 py-0.5';
      case 'removed':
        return 'bg-diff-remove text-diff-remove-text line-through rounded px-2 py-0.5';
      default:
        return '';
    }
  };

  const getBadgeStyle = (type: string) => {
    switch (type.toLowerCase()) {
      case 'expansion':
        return 'bg-blue-600/30 text-blue-300 border-blue-500';
      case 'clarification':
        return 'bg-green-600/30 text-green-300 border-green-500';
      case 'refutation':
      case 'correction':
        return 'bg-red-600/30 text-red-300 border-red-500';
      case 'addition':
        return 'bg-purple-600/30 text-purple-300 border-purple-500';
      case 'foundation':
        return 'bg-gray-600/30 text-gray-300 border-gray-500';
      default:
        return 'bg-brand-muted/30 text-brand-secondary border-brand-border';
    }
  };

  const hasLiked = currentUser ? version.likedBy.includes(currentUser.id) : false;

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-brand-border">
        <div className="flex items-center space-x-4">
          <img src={author.avatarUrl} alt={author.name} className="w-12 h-12 rounded-full"/>
          <div>
            <div className="flex items-center space-x-3">
              <p className="font-semibold text-lg text-brand-secondary">{author.name}</p>
              <div className="flex items-center text-xs text-yellow-400 font-bold bg-yellow-900/50 px-2 py-0.5 rounded-full">
                <ReputationIcon className="w-3 h-3" />
                <span className="ml-1">{author.reputation}</span>
              </div>
            </div>
            <p className="text-sm text-brand-muted">{version.timestamp.toLocaleString()}</p>
          </div>
        </div>
        <button 
          onClick={() => currentUser && onLike(version.id)}
          disabled={!currentUser}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200
            ${hasLiked 
              ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/50' 
              : 'bg-brand-border text-brand-secondary hover:bg-brand-primary hover:text-white'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <LikeIcon />
          <span>{version.likes}</span>
        </button>
      </div>
      
      <div className="prose prose-invert max-w-none text-brand-secondary leading-loose text-lg mb-6 whitespace-pre-wrap">
        {diff.map((segment, index) => (
          <span key={index} className={getSegmentStyle(segment.type)}>
            {segment.value}
          </span>
        ))}
      </div>

      {version.aiSummary && (
        <div className="mt-8 pt-4 border-t border-brand-border bg-black bg-opacity-20 rounded-lg p-5">
          <div className="flex items-start space-x-4">
            <div className="text-brand-primary flex-shrink-0 pt-1">
               <AiIcon />
            </div>
            <div>
              <h3 className="text-md font-semibold text-brand-primary tracking-wider uppercase">Meaning Drift Summary</h3>
              <div className="mt-2 flex items-center gap-3 flex-wrap">
                <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${getBadgeStyle(version.aiSummary.type)}`}>
                  {version.aiSummary.type}
                </span>
                <p className="text-brand-secondary italic">{version.aiSummary.text}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-brand-border space-y-4">
        {history.length > 0 && (
            <div>
                <button
                    onClick={() => setIsHistoryVisible(!isHistoryVisible)}
                    className="w-full flex justify-between items-center text-left text-brand-muted hover:text-brand-secondary transition-colors"
                    aria-expanded={isHistoryVisible}
                >
                    <div className="flex items-center gap-2">
                        <HistoryIcon />
                        <span className="font-semibold">{isHistoryVisible ? 'Hide' : 'Show'} Edit History ({history.length})</span>
                    </div>
                    {isHistoryVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
                </button>
                {isHistoryVisible && (
                    <div className="mt-4 pl-4 border-l-2 border-brand-border space-y-4 animate-fade-in" style={{animationDuration: '300ms'}}>
                        {[...history].reverse().map(histVersion => {
                            const histAuthor = allUsers.find(u => u.id === histVersion.authorId);
                            if (!histAuthor) return null;
                            return (
                                <div key={histVersion.id} className="flex items-center space-x-3">
                                    <img src={histAuthor.avatarUrl} alt={histAuthor.name} className="w-8 h-8 rounded-full" />
                                    <div>
                                        <p className="text-sm font-semibold text-brand-secondary">{histAuthor.name}</p>
                                        <p className="text-xs text-brand-muted">{histVersion.timestamp.toLocaleString()}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        )}

        <div>
            <button
                onClick={() => setIsCommentsVisible(!isCommentsVisible)}
                className="w-full flex justify-between items-center text-left text-brand-muted hover:text-brand-secondary transition-colors"
                aria-expanded={isCommentsVisible}
            >
                <div className="flex items-center gap-2">
                    <CommentIcon />
                    <span className="font-semibold">{isCommentsVisible ? 'Hide' : 'Show'} Comments ({version.comments.length})</span>
                </div>
                {isCommentsVisible ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </button>
            {isCommentsVisible && (
                <div className="mt-4 pl-4 border-l-2 border-brand-border space-y-4 animate-fade-in" style={{animationDuration: '300ms'}}>
                    <CommentList comments={version.comments} users={allUsers} />
                    {currentUser && <CommentForm onSubmit={(content) => onAddComment(version.id, content)} />}
                </div>
            )}
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-brand-border text-center space-x-4">
        {currentUser && isLatestVersion && currentUser.id !== author.id && (
          <button
            onClick={onEvolve}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-green-500/50"
          >
            Evolve This Answer
          </button>
        )}
        {currentUser && currentUser.id === author.id && (
          <button
            onClick={() => onEdit(version.id)}
            className="px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-300 inline-flex items-center gap-2 shadow-lg hover:shadow-brand-primary/50"
          >
            <EditIcon />
            Edit My Version
          </button>
        )}
      </div>
    </div>
  );
};

export default AnswerViewer;
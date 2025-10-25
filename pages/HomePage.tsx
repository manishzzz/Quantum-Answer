import React, { useState, useMemo } from 'react';
import { Question, User, UserDigest } from '../types';
import QuestionCard from '../components/QuestionCard';
import { SparklesIcon, TagIcon, CloseIcon } from '../components/Icons';

interface HomePageProps {
  questions: Question[];
  users: User[];
  onQuestionSelect: (questionId: string) => void;
  currentUser: User | null;
  userDigest: UserDigest | null;
  isDigestLoading: boolean;
  activeTagFilter: string | null;
  onTagFilterChange: (tag: string | null) => void;
}

const QuestionCardSkeleton: React.FC = () => (
    <div className="h-full bg-brand-surface border border-brand-border rounded-xl p-6 relative overflow-hidden animate-pulse">
        <div className="h-6 bg-brand-border rounded w-3/4 mb-3"></div>
        <div className="h-6 bg-brand-border rounded w-1/2 mb-4"></div>
        <div className="flex items-center mb-4">
            <div className="w-6 h-6 bg-brand-border rounded-full mr-2"></div>
            <div className="h-4 bg-brand-border rounded w-1/4"></div>
        </div>
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-brand-border">
            <div className="h-4 bg-brand-border rounded w-1/3"></div>
            <div className="h-4 bg-brand-border rounded w-1/4"></div>
        </div>
    </div>
);


const HomePage: React.FC<HomePageProps> = ({ 
  questions, 
  users, 
  onQuestionSelect, 
  currentUser, 
  userDigest, 
  isDigestLoading,
  activeTagFilter,
  onTagFilterChange
}) => {
  const [activeTab, setActiveTab] = useState<'forYou' | 'latest'>('forYou');

  const TabButton: React.FC<{tab: 'forYou' | 'latest', label: string, icon?: React.ReactNode}> = ({ tab, label, icon }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold rounded-md transition-colors flex items-center gap-2 ${
        activeTab === tab 
          ? 'bg-brand-primary text-white' 
          : 'text-brand-muted hover:bg-brand-surface hover:text-brand-secondary'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  const renderForYouFeed = () => {
    if (isDigestLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => <QuestionCardSkeleton key={i} />)}
        </div>
      );
    }

    if (!userDigest || userDigest.length === 0) {
        return (
            <div className="text-center py-16 bg-brand-surface rounded-lg border border-dashed border-brand-border">
                <h3 className="text-xl font-semibold text-brand-secondary">Your digest is being prepared!</h3>
                <p className="text-brand-muted mt-2 max-w-xl mx-auto">
                    Interact with more questions to help us learn what you're interested in. For now, check out the latest questions.
                </p>
            </div>
        );
    }
    
    return (
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {userDigest.map((item, index) => {
          const question = questions.find(q => q.id === item.questionId);
          if (!question) return null;
          const author = users.find(u => u.id === question.authorId);
          if (!author) return null;
          
          return (
            <div key={item.questionId} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms`}}>
              <QuestionCard
                question={question}
                author={author}
                onSelect={() => onQuestionSelect(question.id)}
                recommendationReason={item.reason}
                onTagClick={onTagFilterChange}
              />
            </div>
          );
        })}
      </div>
    );
  };
  
  const renderLatestFeed = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {questions.map((question, index) => {
        const author = users.find(u => u.id === question.authorId);
        if (!author) return null;
        return (
          <div key={question.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms`}}>
            <QuestionCard
              question={question}
              author={author}
              onSelect={() => onQuestionSelect(question.id)}
              onTagClick={onTagFilterChange}
            />
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        {currentUser ? (
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-extrabold text-brand-secondary">
              {activeTab === 'forYou' ? "For You" : "Latest Questions"}
            </h1>
            <div className="inline-flex items-center bg-brand-surface-glass p-2 rounded-lg border border-brand-border space-x-2">
              <TabButton tab="forYou" label="For You" icon={<SparklesIcon />} />
              <TabButton tab="latest" label="Latest" />
            </div>
          </div>
        ) : (
          <h1 className="text-4xl font-extrabold text-brand-secondary">Evolving Questions</h1>
        )}
      </div>

      {activeTagFilter && (
        <div className="mb-8 flex items-center justify-between bg-brand-surface p-3 rounded-lg border border-brand-primary/50">
            <p className="font-semibold text-brand-secondary">
                Filtering by: <span className="text-brand-primary">#{activeTagFilter}</span>
            </p>
            <button onClick={() => onTagFilterChange(null)} className="flex items-center gap-2 text-sm text-brand-muted hover:text-white transition-colors">
                Clear <CloseIcon />
            </button>
        </div>
      )}

      {currentUser ? (
        activeTab === 'forYou' ? renderForYouFeed() : renderLatestFeed()
      ) : (
        renderLatestFeed()
      )}
    </div>
  );
};

export default HomePage;
import React, { useState, useMemo } from 'react';
import { Question, User, Achievement } from '../types';
import { MOCK_ACHIEVEMENTS } from '../constants';
import { ReputationIcon, ArrowLeftIcon } from '../components/Icons';
import QuestionCard from '../components/QuestionCard';

interface ProfilePageProps {
  currentUser: User;
  questions: Question[];
  users: User[];
  onQuestionSelect: (questionId: string) => void;
  onNavigateBack: () => void;
}

type ActiveTab = 'questions' | 'contributions' | 'achievements';

const ProfilePage: React.FC<ProfilePageProps> = ({ currentUser, questions, users, onQuestionSelect, onNavigateBack }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('questions');

  const { userQuestions, userContributions } = useMemo(() => {
    const userQuestions = questions.filter(q => q.authorId === currentUser.id);
    const userContributions = questions.filter(q => 
      q.authorId !== currentUser.id && q.versions.some(v => v.authorId === currentUser.id)
    );
    return { userQuestions, userContributions };
  }, [questions, currentUser.id]);

  const TabButton: React.FC<{tab: ActiveTab, label: string, count?: number}> = ({ tab, label, count }) => (
    <button 
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 font-semibold rounded-md transition-colors ${
        activeTab === tab 
          ? 'bg-brand-primary text-white' 
          : 'text-brand-muted hover:bg-brand-surface hover:text-brand-secondary'
      }`}
    >
      {label}
      {count !== undefined && <span className="text-xs bg-black/20 px-2 py-0.5 rounded-full ml-2">{count}</span>}
    </button>
  );

  const renderContent = () => {
    if (activeTab === 'achievements') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {MOCK_ACHIEVEMENTS.map(ach => {
            const isUnlocked = currentUser.unlockedAchievements.includes(ach.id);
            const Icon = ach.icon;
            return (
              <div 
                key={ach.id} 
                className={`p-6 rounded-xl border text-center transition-all duration-300 group relative
                  ${isUnlocked 
                    ? 'bg-brand-surface border-yellow-400/50 shadow-lg shadow-yellow-500/10' 
                    : 'bg-brand-surface/50 border-brand-border opacity-60'
                  }`}
              >
                <div className={`mx-auto mb-4 transition-colors ${isUnlocked ? 'text-yellow-400' : 'text-brand-muted'}`}>
                    <Icon className="h-16 w-16" />
                </div>
                <h3 className={`font-bold text-lg ${isUnlocked ? 'text-brand-secondary' : 'text-brand-muted'}`}>{ach.name}</h3>
                <div className="absolute bottom-full mb-2 w-max max-w-xs left-1/2 -translate-x-1/2 p-2 bg-black text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {ach.description}
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    const questionsToShow = activeTab === 'questions' ? userQuestions : userContributions;
    
    if (questionsToShow.length === 0) {
      return (
         <div className="text-center py-16 bg-brand-surface rounded-lg border border-dashed border-brand-border">
            <h3 className="text-xl font-semibold text-brand-secondary">No activity yet!</h3>
            <p className="text-brand-muted mt-2">
                {activeTab === 'questions' 
                    ? "You haven't asked any questions. Start a new evolution!" 
                    : "You haven't contributed to any answers. Find a question to evolve!"}
            </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {questionsToShow.map((question, index) => {
          const author = users.find(u => u.id === question.authorId);
          if (!author) return null;
          return (
            <div key={question.id} className="animate-slide-in-up" style={{ animationDelay: `${index * 100}ms`}}>
              {/* FIX: Added onTagClick prop to satisfy QuestionCardProps. The profile page does not have tag filtering, so a no-op function is sufficient. */}
              <QuestionCard
                question={question}
                author={author}
                onSelect={() => onQuestionSelect(question.id)}
                onTagClick={() => {}}
              />
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
       <button onClick={onNavigateBack} className="flex items-center gap-2 text-brand-muted hover:text-brand-secondary transition-colors mb-6">
            <ArrowLeftIcon />
            <span>Back to Home</span>
        </button>
      
      <div className="bg-brand-surface rounded-xl border border-brand-border p-8 mb-8 flex flex-col md:flex-row items-center gap-8 shadow-xl">
        <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-32 h-32 rounded-full border-4 border-brand-primary shadow-2xl" />
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold text-brand-secondary">{currentUser.name}</h1>
          <div className="mt-2 flex items-center justify-center md:justify-start text-lg text-yellow-400">
            <ReputationIcon className="w-6 h-6" />
            <span className="ml-2 font-bold">{currentUser.reputation}</span>
            <span className="ml-2 text-brand-muted font-normal">Reputation</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="inline-flex items-center bg-brand-surface-glass p-2 rounded-lg border border-brand-border space-x-2">
          <TabButton tab="questions" label="Questions Asked" count={userQuestions.length} />
          <TabButton tab="contributions" label="Answers Contributed" count={userContributions.length} />
          <TabButton tab="achievements" label="Achievements" count={currentUser.unlockedAchievements.length} />
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

export default ProfilePage;
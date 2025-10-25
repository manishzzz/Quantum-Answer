import React, { useState, useEffect } from 'react';
import { Question, User, DiffSegment, Comment, QuestionStatus } from '../types';
import { getWordDiff } from '../utils/diff';
import { useTimelapse } from '../hooks/useTimelapse';
import QuestionDisplay from '../components/QuestionDisplay';
import AnswerViewer from '../components/AnswerViewer';
import Timeline from '../components/Timeline';
import Editor from '../components/Editor';
import { PlayIcon, PauseIcon, ArrowLeftIcon } from '../components/Icons';

interface QuestionPageProps {
  question: Question;
  users: User[];
  currentUser: User | null;
  onNavigateBack: () => void;
  isAuthenticated: boolean;
  onNavigateToLogin: () => void;
  onLikeVersion: (questionId: string, versionId: string) => void;
  onAddComment: (questionId: string, versionId: string, content: string) => void;
  onEditorSubmit: (questionId: string, newContent: string, sourceVersionId: string | null) => Promise<string | null>;
  onStatusChange: (questionId: string, newStatus: QuestionStatus) => void;
}

const QuestionPage: React.FC<QuestionPageProps> = ({ 
    question, users, currentUser, onNavigateBack, isAuthenticated, onNavigateToLogin,
    onLikeVersion, onAddComment, onEditorSubmit, onStatusChange
}) => {
  const [activeVersionIndex, setActiveVersionIndex] = useState<number>(question.versions.length - 1);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingSourceVersionId, setEditingSourceVersionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { isPlaying, play, pause, currentIndex } = useTimelapse(question.versions.length, setActiveVersionIndex);

  useEffect(() => {
    setActiveVersionIndex(currentIndex);
  }, [currentIndex]);
  
  useEffect(() => {
    setActiveVersionIndex(question.versions.length - 1);
  }, [question.id, question.versions.length])

  const handleSelectVersion = (index: number) => {
    if (isPlaying) pause();
    setActiveVersionIndex(index);
  };
  
  const handleStartEditing = (versionId: string) => {
    if (!isAuthenticated) return;
    setEditingSourceVersionId(versionId);
    setIsEditing(true);
  };

  const handleStartEvolving = () => {
    if (!isAuthenticated) return;
    setEditingSourceVersionId(null);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditingSourceVersionId(null);
  };

  const handleSubmit = async (newContent: string) => {
    setIsLoading(true);
    setError(null);
    const errorResult = await onEditorSubmit(question.id, newContent, editingSourceVersionId);
    if (errorResult) {
      setError(errorResult);
    } else {
      handleCancelEditing();
    }
    setIsLoading(false);
  };

  const activeVersion = question.versions[activeVersionIndex];
  const previousVersion = activeVersionIndex > 0 ? question.versions[activeVersionIndex - 1] : null;
  const diff: DiffSegment[] = previousVersion
    ? getWordDiff(previousVersion.content, activeVersion.content)
    : getWordDiff('', activeVersion.content);

  const questionAuthor = users.find(u => u.id === question.authorId);
  const activeVersionAuthor = users.find(u => u.id === activeVersion.authorId);
  const versionHistory = question.versions.slice(0, activeVersionIndex);
  
  const editorInitialContent = () => {
    if (!isEditing) return '';
    const sourceVersion = editingSourceVersionId 
      ? question.versions.find(v => v.id === editingSourceVersionId)
      : question.versions[question.versions.length - 1];
    return sourceVersion?.content || '';
  }

  if (!questionAuthor || !activeVersionAuthor) {
    return <div>Loading user data...</div>;
  }
  
  return (
    <div className="animate-fade-in">
        <button onClick={onNavigateBack} className="flex items-center gap-2 text-brand-muted hover:text-brand-secondary transition-colors mb-6">
            <ArrowLeftIcon />
            <span>Back to All Questions</span>
        </button>
        <QuestionDisplay 
            question={question} 
            author={questionAuthor} 
            currentUser={currentUser}
            onStatusChange={(newStatus) => onStatusChange(question.id, newStatus)}
        />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-3">
                <h2 className="text-xl font-bold mb-4 text-brand-secondary">Answer Timeline</h2>
                <Timeline 
                    versions={question.versions}
                    users={users}
                    activeIndex={activeVersionIndex}
                    onSelectVersion={handleSelectVersion}
                    isLoading={isLoading}
                />
                <div className="mt-6 flex justify-center">
                    <button
                        onClick={isPlaying ? pause : play}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-6 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all duration-300 shadow-lg hover:shadow-brand-primary/50 disabled:bg-gray-600 disabled:shadow-none"
                    >
                        {isPlaying ? <PauseIcon /> : <PlayIcon />}
                        <span>{isPlaying ? 'Pause' : 'Play Time-Lapse'}</span>
                    </button>
                </div>
            </div>
          
            <div className="lg:col-span-9">
                {!isAuthenticated && (
                  <div className="bg-brand-surface rounded-xl border border-dashed border-brand-primary p-6 text-center mb-6">
                    <h3 className="text-xl font-bold text-brand-secondary">Join the Evolution</h3>
                    <p className="text-brand-muted mt-2 mb-4">You are viewing this question as a guest. Sign in to like, comment, and contribute your own answer.</p>
                    <button onClick={onNavigateToLogin} className="px-6 py-2 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-brand-primary/50">
                      Sign In to Participate
                    </button>
                  </div>
                )}
                {isEditing && isAuthenticated ? (
                    <Editor
                        initialContent={editorInitialContent()}
                        onSubmit={handleSubmit}
                        onCancel={handleCancelEditing}
                        isLoading={isLoading}
                    />
                ) : (
                    <div className="bg-brand-surface rounded-xl border border-brand-border p-6 animate-fade-in">
                        <AnswerViewer 
                            diff={diff} 
                            version={activeVersion} 
                            author={activeVersionAuthor}
                            onLike={(versionId) => onLikeVersion(question.id, versionId)}
                            onAddComment={(versionId, content) => onAddComment(question.id, versionId, content)}
                            currentUser={currentUser}
                            isLatestVersion={activeVersionIndex === question.versions.length - 1}
                            onEdit={handleStartEditing}
                            onEvolve={handleStartEvolving}
                            history={versionHistory}
                            allUsers={users}
                        />
                    </div>
                )}
                {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
            </div>
        </div>
    </div>
  );
};

export default QuestionPage;
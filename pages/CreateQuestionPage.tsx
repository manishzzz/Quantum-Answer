import React, { useState } from 'react';
import { CloseIcon } from '../components/Icons';

interface CreateQuestionPageProps {
  onSubmit: (title: string, initialContent: string, tags: string[]) => void;
  onCancel: () => void;
}

const CreateQuestionPage: React.FC<CreateQuestionPageProps> = ({ onSubmit, onCancel }) => {
  const [title, setTitle] = useState('');
  const [initialContent, setInitialContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const canSubmit = title.trim().length > 10 && initialContent.trim().length > 20;

  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canSubmit) {
      onSubmit(title, initialContent, tags);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-slide-in-up">
      <div className="bg-brand-surface rounded-xl border border-brand-border p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold text-brand-secondary mb-2">Ask a New Question</h1>
        <p className="text-brand-muted mb-8">Start an evolution of knowledge. Your initial answer will be the foundation for others to build upon.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-lg font-semibold text-brand-secondary mb-2">
              Question Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., What is the future of decentralized finance?"
              className="w-full p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary text-lg focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
            />
            <p className="text-sm text-brand-muted mt-2">A clear, specific question gets the best answers. Minimum 10 characters.</p>
          </div>
          
          <div>
            <label htmlFor="tags" className="block text-lg font-semibold text-brand-secondary mb-2">
              Tags
            </label>
            <div className="flex flex-wrap items-center gap-2 p-2 bg-brand-bg border-2 border-brand-border rounded-md">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-2 bg-brand-primary text-white text-sm font-semibold px-3 py-1 rounded-full">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="text-indigo-200 hover:text-white">
                    <CloseIcon className="h-3 w-3" />
                  </button>
                </span>
              ))}
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyDown}
                placeholder={tags.length < 5 ? 'Add up to 5 tags...' : '5 tags max'}
                className="flex-1 bg-transparent p-1 focus:outline-none text-brand-secondary"
                disabled={tags.length >= 5}
              />
            </div>
             <p className="text-sm text-brand-muted mt-2">Use commas or Enter to add a tag. Tags help others discover your question.</p>
          </div>

          <div>
            <label htmlFor="initialContent" className="block text-lg font-semibold text-brand-secondary mb-2">
              Your Initial Answer
            </label>
            <textarea
              id="initialContent"
              value={initialContent}
              onChange={(e) => setInitialContent(e.target.value)}
              placeholder="Provide a starting point for the conversation. What's your take?"
              className="w-full h-48 p-3 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary text-lg leading-relaxed focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
              rows={8}
            />
            <p className="text-sm text-brand-muted mt-2">This is Version 1. Be bold! Minimum 20 characters.</p>
          </div>

          <div className="pt-4 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-3 bg-brand-border text-brand-secondary font-semibold rounded-lg hover:bg-brand-muted/30 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="px-8 py-3 bg-brand-primary text-white font-semibold rounded-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-brand-primary/50 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed"
            >
              Start Evolution
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestionPage;
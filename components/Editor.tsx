import React, { useState } from 'react';

interface EditorProps {
  initialContent: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const Editor: React.FC<EditorProps> = ({ initialContent, onSubmit, onCancel, isLoading }) => {
  const [content, setContent] = useState(initialContent);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(content);
  };

  return (
    <div className="bg-brand-surface rounded-xl border border-brand-primary p-6 shadow-2xl shadow-brand-primary/20 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-brand-secondary">Evolve the Answer</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-72 p-4 bg-brand-bg border-2 border-brand-border rounded-md text-brand-secondary text-lg leading-relaxed focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all"
          placeholder="Contribute your perspective, refine the details, or offer a new direction..."
          disabled={isLoading}
        />
        <div className="mt-6 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-5 py-2 bg-brand-border text-brand-secondary font-semibold rounded-lg hover:bg-brand-muted/30 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading || content.trim() === initialContent.trim()}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500 transition-all shadow-lg hover:shadow-green-500/50 disabled:bg-gray-600 disabled:shadow-none disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              'Submit Evolution'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Editor;
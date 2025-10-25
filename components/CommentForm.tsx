import React, { useState } from 'react';

interface CommentFormProps {
  onSubmit: (content: string) => void;
}

const CommentForm: React.FC<CommentFormProps> = ({ onSubmit }) => {
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-start space-x-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="w-full p-2 bg-brand-bg border border-brand-border rounded-md text-brand-secondary focus:ring-1 focus:ring-brand-primary focus:outline-none transition-shadow text-sm"
        rows={2}
      />
      <button
        type="submit"
        disabled={!content.trim()}
        className="px-4 py-2 bg-brand-primary text-white font-semibold rounded-lg text-sm hover:bg-indigo-500 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        Post
      </button>
    </form>
  );
};

export default CommentForm;
import React from 'react';
import { Comment, User } from '../types';

interface CommentListProps {
  comments: Comment[];
  users: User[];
}

const CommentList: React.FC<CommentListProps> = ({ comments, users }) => {
  if (comments.length === 0) {
    return <p className="text-sm text-brand-muted italic py-4">No comments yet. Be the first to share your thoughts!</p>;
  }

  return (
    <div className="space-y-4">
      {comments.map(comment => {
        const author = users.find(u => u.id === comment.authorId);
        if (!author) return null;
        return (
          <div key={comment.id} className="flex items-start space-x-3">
            <img src={author.avatarUrl} alt={author.name} className="w-8 h-8 rounded-full mt-1" />
            <div className="flex-1 bg-brand-bg p-3 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-sm text-brand-secondary">{author.name}</p>
                <p className="text-xs text-brand-muted">{comment.timestamp.toLocaleDateString()}</p>
              </div>
              <p className="text-sm text-brand-muted mt-1">{comment.content}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CommentList;
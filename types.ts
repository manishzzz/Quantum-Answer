// FIX: Import React to resolve 'Cannot find namespace' error for React.FC.
import React from 'react';

export interface AiSummary {
  type: string;
  text: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.FC<{ className?: string }>;
}

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  reputation: number;
  unlockedAchievements: string[]; // array of achievement IDs
}

export interface Comment {
    id: string;
    authorId: string;
    content: string;
    timestamp: Date;
}

export interface AnswerVersion {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  aiSummary: AiSummary;
  likes: number;
  comments: Comment[];
  likedBy: string[]; // Array of user IDs
}

export type QuestionStatus = 'evolving' | 'resolved' | 'archived';

export interface Question {
  id:string;
  title: string;
  authorId: string;
  status: QuestionStatus;
  versions: AnswerVersion[];
  tags: string[]; // Added for content discovery
  finalAnswer?: string; // NEW - AI-synthesized summary
}

export type DiffSegmentType = 'added' | 'removed' | 'common';

export interface DiffSegment {
  value: string;
  type: DiffSegmentType;
}

// Types for AI Digest
export interface UserDigestItem {
  questionId: string;
  reason: string;
}

export type UserDigest = UserDigestItem[];
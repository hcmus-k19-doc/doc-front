import React from 'react';

export interface CommentItem {
  id?: number;
  author: string;
  avatar: React.ReactNode;
  content: React.ReactNode;
  datetime: string;
}

export interface CommentListProps {
  comments: CommentItem[];
}

export interface EditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

export interface DocCommentProps {
  docId: number;
}

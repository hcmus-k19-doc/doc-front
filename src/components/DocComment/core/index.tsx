import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
  onChange: (e: any, editor: ClassicEditor) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

export interface DocCommentProps {
  docId: number;
}

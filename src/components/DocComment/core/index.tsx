import React from 'react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ProcessingDocumentTypeEnum } from 'models/doc-main-models';

export interface CommentItem {
  id?: number;
  author: string;
  avatar: React.ReactNode;
  content: React.ReactNode;
  datetime: string;
}

export interface CommentListProps {
  comments: CommentItem[];
  loading?: boolean;
}

export interface EditorProps {
  onChange: (e: any, editor: ClassicEditor) => void;
  onSubmit: () => void;
  submitting: boolean;
  value: string;
}

export interface DocCommentProps {
  docId: number;
  processingDocumentType: ProcessingDocumentTypeEnum;
}

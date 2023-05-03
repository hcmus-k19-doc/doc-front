import React, { useState } from 'react';
import { Comment } from '@ant-design/compatible';
import { Button, Form, List, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { t } from 'i18next';
import { useCommentMutation, useCommentsRes } from 'shared/hooks/DocComment';

import { CommentListProps, DocCommentProps, EditorProps } from './core';

import './index.css';

function Editor({ onChange, onSubmit, submitting, value }: EditorProps) {
  return (
    <>
      <Form.Item>
        <TextArea rows={4} onChange={onChange} value={value} />
      </Form.Item>
      <Form.Item>
        <Button htmlType='submit' loading={submitting} onClick={onSubmit} type='primary'>
          {t('incomingDocDetailPage.comment.button.title')}
        </Button>
      </Form.Item>
    </>
  );
}

function CommentList({ comments }: CommentListProps) {
  return (
    <List
      dataSource={comments}
      header={`${comments.length} ${comments.length > 1 ? 'replies' : 'reply'}`}
      itemLayout='horizontal'
      renderItem={(props) => <Comment className='comment' {...props} />}
    />
  );
}

export default function DocComment({ docId }: DocCommentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState('');
  const { comments, isFetching } = useCommentsRes(docId);
  const commentMutation = useCommentMutation(docId);

  const handleSubmit = () => {
    if (!value) return;

    setSubmitting(true);

    commentMutation.mutate(value);
    if (commentMutation.isIdle) {
      setSubmitting(false);
      setValue('');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <>
      {comments.length <= 0 && <Skeleton loading={isFetching} active avatar></Skeleton>}
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value}
          />
        }
      />
    </>
  );
}

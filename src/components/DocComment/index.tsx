import React, { useState } from 'react';
import { Comment } from '@ant-design/compatible';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
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
      renderItem={(props) => (
        <Comment
          className='comment'
          {...{
            ...props,
            content: (
              <div
                dangerouslySetInnerHTML={{
                  __html: props.content?.toLocaleString() || '',
                }}
              />
            ),
          }}
        />
      )}
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

    setSubmitting(false);
    setValue('');
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {comments.length <= 0 && <Skeleton loading={isFetching} active avatar></Skeleton>}
      {comments.length > 0 && <CommentList comments={comments} />}
      <Comment
        content={
          <>
            <CKEditor
              editor={ClassicEditor}
              data={value}
              onChange={(event, editor) => {
                handleChange(editor.getData());
              }}
            />

            <Form.Item className='flex w-full flex-wrap mt-4 content-center'>
              <Button htmlType='submit' loading={submitting} onClick={handleSubmit} type='primary'>
                {t('incomingDocDetailPage.comment.button.title')}
              </Button>
            </Form.Item>
          </>
        }
      />
    </>
  );
}

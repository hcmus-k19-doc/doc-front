import React, { useState } from 'react';
import { Comment } from '@ant-design/compatible';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';
import { Button, Form, List, Skeleton } from 'antd';
import { t } from 'i18next';
import { CommentDto } from 'models/doc-main-models';
import { useCommentMutation, useCommentsRes } from 'shared/hooks/DocComment';

import { CommentListProps, DocCommentProps, EditorProps } from './core';

import './index.css';

function Editor({ onChange, onSubmit, submitting, value }: EditorProps) {
  return (
    <>
      <CKEditor editor={ClassicEditor} data={value} onChange={onChange} />

      <Form.Item className='flex w-full flex-wrap mt-4 content-center'>
        <Button
          htmlType='submit'
          loading={submitting}
          onClick={onSubmit}
          type='primary'
          size='large'>
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

export default function DocComment({ docId, processingDocumentType }: DocCommentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState<Partial<CommentDto>>({ content: '', processingDocumentType });
  const { comments, isFetching } = useCommentsRes(processingDocumentType, docId);
  const commentMutation = useCommentMutation(processingDocumentType, docId);

  const handleSubmit = () => {
    if (!value.content) return;

    setSubmitting(true);

    commentMutation.mutate(value);

    setSubmitting(false);
    setValue({ content: '', processingDocumentType });
  };

  const handleChange = (event: EventInfo<string, unknown>, editor: ClassicEditor) => {
    setValue({ ...value, content: editor.getData() });
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
            value={value.content || ''}
          />
        }
      />
    </>
  );
}

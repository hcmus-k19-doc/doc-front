import React, { useState } from 'react';
import { Comment } from '@ant-design/compatible';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import EventInfo from '@ckeditor/ckeditor5-utils/src/eventinfo';
import { Button, Empty, Form, List, Pagination, Skeleton } from 'antd';
import { t } from 'i18next';
import { CommentDto } from 'models/doc-main-models';
import commentService from 'services/CommentService';
import { useCommentMutation, useCommentsRes, useDocCommentReq } from 'shared/hooks/DocComment';

import { CommentItem, CommentListProps, DocCommentProps, EditorProps } from './core';

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

function CommentList({ comments, loading }: CommentListProps) {
  return (
    <Skeleton loading={loading}>
      <List
        loading={loading}
        dataSource={comments}
        header={`${comments.length} ${
          comments.length > 1 ? t('common.comment.replies_title') : t('common.comment.reply_title')
        }`}
        itemLayout='horizontal'
        renderItem={(props) => (
          <Comment
            className='comment'
            {...{
              ...props,
              content: (
                <div
                  dangerouslySetInnerHTML={{
                    __html: props.content?.toLocaleString() ?? '',
                  }}
                />
              ),
            }}
          />
        )}
      />
    </Skeleton>
  );
}

export default function DocComment({ docId, processingDocumentType }: DocCommentProps) {
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState<Partial<CommentDto>>({ content: '', processingDocumentType });
  const { data, isFetching, isLoading } = useCommentsRes(processingDocumentType, docId);
  const commentMutation = useCommentMutation(processingDocumentType, docId);
  const [commentReqQuery, setCommentReqQuery] = useDocCommentReq();

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

  function handleOnChange(page: number, pageSize: number) {
    setCommentReqQuery({ ...commentReqQuery, page, pageSize });
  }

  const commentsLength = data?.comments?.length ?? 0;
  return (
    <>
      {commentsLength <= 0 && (
        <Empty description={t('common.comment.no_comment')} />
        // <Skeleton loading={isFetching} active avatar></Skeleton>
      )}
      {commentsLength > 0 && (
        <CommentList comments={data?.comments as CommentItem[]} loading={isLoading} />
      )}
      <Pagination
        className='flex justify-end'
        current={commentReqQuery.page}
        defaultCurrent={1}
        showSizeChanger={false}
        showLessItems={true}
        total={data?.totalElements}
        pageSize={commentService.COMMENT_PAGE_SIZE}
        onChange={handleOnChange}
      />

      <Comment
        content={
          <Editor
            onChange={handleChange}
            onSubmit={handleSubmit}
            submitting={submitting}
            value={value.content ?? ''}
          />
        }
      />
    </>
  );
}

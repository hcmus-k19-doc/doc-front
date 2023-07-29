import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from 'components/DocComment/core';
import { CommentDto, ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import moment from 'moment';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import commentService from 'services/CommentService';

import { PaginationState } from '../../models/states';
import { IncomingDocQueryState } from '../IncomingDocumentListQuery/core/states';

const QUERY_COMMENT_KEY = 'QUERY.COMMENT';

type DocCommentQueryState = PaginationState;

const queryState = atom<DocCommentQueryState>({
  key: 'DOC_COMMENT_QUERY_STATE',
  default: {
    page: 1,
    pageSize: commentService.COMMENT_PAGE_SIZE,
  },
});

export const useDocCommentReq = () => useRecoilState(queryState);

export function useCommentsRes(processingDocumentType: ProcessingDocumentTypeEnum, docId: number) {
  const query = useRecoilValue<IncomingDocQueryState>(queryState);

  return useQuery({
    queryKey: [QUERY_COMMENT_KEY, processingDocumentType, docId, query.page, query.pageSize],
    queryFn: async () => {
      const { data } = await commentService.getCommentsByTypeAndDocumentId(
        processingDocumentType,
        docId,
        query.page,
        query.pageSize
      );

      const res: CommentItem[] = data.payload.map(
        (item) =>
          ({
            id: item.id,
            author: item.createdBy,
            avatar: <FontAwesomeIcon icon={faUser} size='xl' />,
            content: item.content,
            datetime: moment(item.createdDate).fromNow(),
          } as CommentItem)
      );

      return {
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        comments: res,
      };
    },
  });
}

export function useCommentMutation(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['MUTATION.COMMENT'],
    mutationFn: async (commentDto: Partial<CommentDto>) => {
      const { data } = await commentService.createComment(commentDto, documentId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QUERY_COMMENT_KEY, processingDocumentType, documentId]);
    },
  });
}

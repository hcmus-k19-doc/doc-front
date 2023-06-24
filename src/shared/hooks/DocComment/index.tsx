import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from 'components/DocComment/core';
import { CommentDto, ProcessingDocumentTypeEnum } from 'models/doc-main-models';
import moment from 'moment';
import commentService from 'services/CommentService';

const QUERY_COMMENT_KEY = 'QUERY.COMMENT';

export function useCommentsRes(processingDocumentType: ProcessingDocumentTypeEnum, docId: number) {
  const {
    data: comments,
    isFetching,
    isLoading,
  } = useQuery({
    queryKey: [QUERY_COMMENT_KEY, processingDocumentType, docId],
    queryFn: async () => {
      const { data } = await commentService.getCommentsByTypeAndDocumentId(
        processingDocumentType,
        docId
      );
      const res: CommentItem[] = data.map(
        (item) =>
          ({
            id: item.id,
            author: item.createdBy,
            avatar: <FontAwesomeIcon icon={faUser} size='xl' />,
            content: item.content,
            datetime: moment(item.createdDate).fromNow(),
          } as CommentItem)
      );

      return res;
    },
  });

  if (!comments) {
    return {
      comments: [],
      isFetching,
    };
  }

  return {
    comments,
    isFetching,
  };
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

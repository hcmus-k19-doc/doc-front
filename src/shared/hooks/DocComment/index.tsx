import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { CommentItem } from 'components/DocComment/core';
import moment from 'moment';
import commentService from 'services/CommentService';

export function useCommentsRes(docId: number) {
  const { data: comments, isFetching } = useQuery({
    queryKey: ['QUERIES.COMMENT', docId],
    queryFn: async () => {
      const { data } = await commentService.getCommentsByIncomingDocumentId(docId);
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
    comments: comments,
    isFetching,
  };
}

export function useCommentMutation(incomingDocumentId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['MUTATION.COMMENT'],
    mutationFn: async (content: string) => {
      const { data } = await commentService.createComment(content, incomingDocumentId);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['QUERIES.COMMENT', incomingDocumentId]);
    },
  });
}

import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { CommentDto, DocPaginationDto, ProcessingDocumentTypeEnum } from 'models/doc-main-models';

const COMMENT_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/comments`;
const COMMENT_PAGE_SIZE = 10;

async function getCommentsByTypeAndDocumentId(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number,
  page: number,
  pageSize: number
) {
  return await axios.get<DocPaginationDto<CommentDto>>(
    `${COMMENT_URL}/${processingDocumentType}/${documentId}`,
    {
      params: {
        page: page - 1,
        pageSize: pageSize,
      },
    }
  );
}

async function createComment(commentDto: Partial<CommentDto>, documentId: number) {
  return await axios.post<CommentDto>(`${COMMENT_URL}/${documentId}`, commentDto);
}

const commentService = {
  getCommentsByTypeAndDocumentId,
  createComment,
  COMMENT_PAGE_SIZE,
};

export default commentService;

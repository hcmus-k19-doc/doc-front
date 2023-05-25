import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { CommentDto, ProcessingDocumentTypeEnum } from 'models/doc-main-models';

const COMMENT_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/comments`;

async function getCommentsByTypeAndDocumentId(
  processingDocumentType: ProcessingDocumentTypeEnum,
  documentId: number
) {
  return await axios.get<CommentDto[]>(`${COMMENT_URL}/${processingDocumentType}/${documentId}`);
}

async function createComment(commentDto: Partial<CommentDto>, documentId: number) {
  return await axios.post<CommentDto>(`${COMMENT_URL}/${documentId}`, commentDto);
}

const commentService = {
  getCommentsByTypeAndDocumentId,
  createComment,
};

export default commentService;

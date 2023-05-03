import axios from 'axios';
import { REACT_APP_DOC_MAIN_SERVICE_URL } from 'config/constant';
import { CommentDto } from 'models/doc-main-models';

const COMMENT_URL = `${REACT_APP_DOC_MAIN_SERVICE_URL}/comments`;

async function getCommentsByIncomingDocumentId(documentId: number) {
  return await axios.get<CommentDto[]>(`${COMMENT_URL}/incoming-documents/${documentId}`);
}

async function createComment(content: string, incomingDocumentId: number) {
  return await axios.post<CommentDto>(`${COMMENT_URL}/incoming-documents/${incomingDocumentId}`, {
    content,
  });
}

const commentService = {
  getCommentsByIncomingDocumentId,
  createComment,
};

export default commentService;

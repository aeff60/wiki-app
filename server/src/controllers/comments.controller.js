import * as commentsService from '../services/comments.service.js';

export async function listComments(req, res, next) {
  try {
    const comments = await commentsService.listComments(req.params.pageId);
    res.json(comments);
  } catch (err) {
    next(err);
  }
}

export async function createComment(req, res, next) {
  try {
    const comment = await commentsService.createComment(req.params.pageId, req.user.id, req.body);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
}

export async function updateComment(req, res, next) {
  try {
    const comment = await commentsService.updateComment(req.params.commentId, req.user, req.body.content);
    res.json(comment);
  } catch (err) {
    next(err);
  }
}

export async function deleteComment(req, res, next) {
  try {
    await commentsService.deleteComment(req.params.commentId, req.user);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

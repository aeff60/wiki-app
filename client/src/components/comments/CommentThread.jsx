import { useState, useEffect, useCallback } from 'react';
import * as commentsApi from '../../api/comments.js';
import { CommentItem } from './CommentItem.jsx';
import { CommentForm } from './CommentForm.jsx';
import { useToast } from '../../hooks/useToast.js';

export function CommentThread({ pageId }) {
  const [comments, setComments] = useState([]);
  const toast = useToast();

  const load = useCallback(() => {
    commentsApi.listComments(pageId).then((r) => setComments(r.data)).catch(() => {});
  }, [pageId]);

  useEffect(() => { load(); }, [load]);

  const handlePost = async (content) => {
    await commentsApi.createComment(pageId, { content });
    load();
    toast.success('Comment posted');
  };

  const handleReply = async (content, parentId) => {
    await commentsApi.createComment(pageId, { content, parent_id: parentId });
    load();
  };

  const handleEdit = async (commentId, content) => {
    await commentsApi.updateComment(pageId, commentId, { content });
    load();
  };

  const handleDelete = async (commentId) => {
    await commentsApi.deleteComment(pageId, commentId);
    load();
  };

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (id) => comments.filter((c) => c.parent_id === id);

  return (
    <section className="mt-10 border-t border-gray-200 pt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Comments ({comments.filter((c) => !c.is_deleted).length})
      </h2>
      <CommentForm onSubmit={handlePost} />
      {topLevel.length > 0 && (
        <div className="mt-4 divide-y divide-gray-100">
          {topLevel.map((comment) => (
            <div key={comment.id}>
              <CommentItem
                comment={comment}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {getReplies(comment.id).map((reply) => (
                <div key={reply.id} className="pl-9 border-l-2 border-gray-100 ml-3">
                  <CommentItem
                    comment={reply}
                    onReply={handleReply}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

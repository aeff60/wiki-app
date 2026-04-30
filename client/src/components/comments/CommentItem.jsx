import { useState } from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../hooks/useAuth.js';
import { usePermissions } from '../../hooks/usePermissions.js';
import { CommentForm } from './CommentForm.jsx';

export function CommentItem({ comment, onReply, onEdit, onDelete }) {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const [editing, setEditing] = useState(false);
  const [replying, setReplying] = useState(false);

  const canModify = comment.author_id === user?.id || isAdmin;

  if (comment.is_deleted) {
    return (
      <div className="py-2 px-3 text-sm text-gray-400 italic">
        This comment has been removed.
      </div>
    );
  }

  return (
    <div className="py-3">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0">
          {comment.author_name?.[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-900">{comment.author_name}</span>
            <span className="text-xs text-gray-400">{format(new Date(comment.created_at), 'MMM d, yyyy HH:mm')}</span>
          </div>
          {editing ? (
            <CommentForm
              initialValue={comment.content}
              onSubmit={async (c) => { await onEdit(comment.id, c); setEditing(false); }}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <p className="text-sm text-gray-700 mt-0.5 whitespace-pre-wrap">{comment.content}</p>
          )}
          <div className="flex gap-3 mt-1">
            <button onClick={() => setReplying((r) => !r)} className="text-xs text-gray-400 hover:text-gray-600">Reply</button>
            {canModify && !editing && (
              <>
                <button onClick={() => setEditing(true)} className="text-xs text-gray-400 hover:text-gray-600">Edit</button>
                <button onClick={() => onDelete(comment.id)} className="text-xs text-red-400 hover:text-red-600">Delete</button>
              </>
            )}
          </div>
          {replying && (
            <div className="mt-2 pl-3 border-l-2 border-gray-100">
              <CommentForm
                placeholder="Write a reply…"
                onSubmit={async (c) => { await onReply(c, comment.id); setReplying(false); }}
                onCancel={() => setReplying(false)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

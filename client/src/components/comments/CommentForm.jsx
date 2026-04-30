import { useState } from 'react';
import { Button } from '../ui/Button.jsx';

export function CommentForm({ onSubmit, placeholder = 'Write a comment…', initialValue = '', onCancel }) {
  const [content, setContent] = useState(initialValue);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    try {
      await onSubmit(content.trim());
      setContent('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      />
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
          {submitting ? 'Posting…' : 'Post'}
        </Button>
        {onCancel && <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Cancel</Button>}
      </div>
    </form>
  );
}

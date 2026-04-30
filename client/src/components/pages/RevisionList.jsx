import { format } from 'date-fns';
import { Badge } from '../ui/Badge.jsx';
import { Button } from '../ui/Button.jsx';

export function RevisionList({ revisions, currentRevision, onRestore }) {
  return (
    <div className="space-y-2">
      {revisions.map((rev) => (
        <div key={rev.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-medium text-gray-900">v{rev.revision_number}</span>
              {rev.id === currentRevision && <Badge color="blue">Current</Badge>}
              {rev.change_summary && (
                <span className="text-sm text-gray-600 truncate">{rev.change_summary}</span>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {rev.author_name} · {format(new Date(rev.created_at), 'MMM d, yyyy HH:mm')}
            </p>
          </div>
          {rev.id !== currentRevision && onRestore && (
            <Button variant="secondary" size="sm" onClick={() => onRestore(rev.id)}>
              Restore
            </Button>
          )}
        </div>
      ))}
    </div>
  );
}

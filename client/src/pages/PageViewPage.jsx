import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getPage, deletePage } from '../api/pages.js';
import { getSpace } from '../api/spaces.js';
import { usePermissions } from '../hooks/usePermissions.js';
import { useToast } from '../hooks/useToast.js';
import { MarkdownRenderer } from '../components/editor/MarkdownRenderer.jsx';
import { CommentThread } from '../components/comments/CommentThread.jsx';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb.jsx';
import { Badge } from '../components/ui/Badge.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function PageViewPage() {
  const { spaceId, pageId } = useParams();
  const [page, setPage] = useState(null);
  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isEditor } = usePermissions();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getPage(spaceId, pageId), getSpace(spaceId)])
      .then(([pRes, sRes]) => { setPage(pRes.data); setSpace(sRes.data); })
      .finally(() => setLoading(false));
  }, [spaceId, pageId]);

  const handleDelete = async () => {
    if (!confirm('Delete this page?')) return;
    try {
      await deletePage(spaceId, pageId);
      toast.success('Page deleted');
      navigate(`/spaces/${spaceId}`);
    } catch {
      toast.error('Failed to delete page');
    }
  };

  if (loading) return <PageSpinner />;
  if (!page) return <p className="text-gray-500">Page not found.</p>;

  return (
    <div>
      <PageBreadcrumb items={[
        { label: 'Spaces', href: '/spaces' },
        { label: space?.name || spaceId, href: `/spaces/${spaceId}` },
        { label: page.title },
      ]} />

      <div className="flex items-start justify-between mb-2">
        <h1 className="text-3xl font-bold text-gray-900">{page.title}</h1>
        {isEditor && (
          <div className="flex gap-2 flex-shrink-0 ml-4">
            <Link to={`/spaces/${spaceId}/pages/${pageId}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
            <Link to={`/spaces/${spaceId}/pages/${pageId}/history`}>
              <Button variant="ghost" size="sm">History</Button>
            </Link>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
        <span>By {page.author?.name}</span>
        <span>·</span>
        <span>Updated {format(new Date(page.updated_at), 'MMM d, yyyy')}</span>
        <span>·</span>
        <span>{page.view_count} views</span>
        {!page.is_published && <Badge color="yellow">Draft</Badge>}
      </div>

      {page.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-6">
          {page.tags.map((tag) => (
            <Badge key={tag.id} color="blue">{tag.name}</Badge>
          ))}
        </div>
      )}

      <MarkdownRenderer content={page.content} />
      <CommentThread pageId={pageId} />
    </div>
  );
}

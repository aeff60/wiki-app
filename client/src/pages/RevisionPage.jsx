import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listRevisions, restoreRevision, getPage } from '../api/pages.js';
import { useToast } from '../hooks/useToast.js';
import { RevisionList } from '../components/pages/RevisionList.jsx';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function RevisionPage() {
  const { spaceId, pageId } = useParams();
  const [revisions, setRevisions] = useState([]);
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listRevisions(spaceId, pageId), getPage(spaceId, pageId)])
      .then(([rRes, pRes]) => { setRevisions(rRes.data); setPage(pRes.data); })
      .finally(() => setLoading(false));
  }, [spaceId, pageId]);

  const handleRestore = async (revisionId) => {
    if (!confirm('Restore this revision?')) return;
    try {
      await restoreRevision(spaceId, pageId, revisionId);
      toast.success('Revision restored');
      navigate(`/spaces/${spaceId}/pages/${pageId}`);
    } catch {
      toast.error('Failed to restore revision');
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageBreadcrumb items={[
        { label: 'Spaces', href: '/spaces' },
        { label: page?.title || 'Page', href: `/spaces/${spaceId}/pages/${pageId}` },
        { label: 'History' },
      ]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Revision History</h1>
      <RevisionList
        revisions={revisions}
        currentRevision={revisions[0]?.id}
        onRestore={handleRestore}
      />
    </div>
  );
}

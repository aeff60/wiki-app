import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSpace } from '../api/spaces.js';
import { getPageTree } from '../api/pages.js';
import { usePermissions } from '../hooks/usePermissions.js';
import { PageTree } from '../components/pages/PageTree.jsx';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function SpacePage() {
  const { spaceId } = useParams();
  const [space, setSpace] = useState(null);
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isEditor } = usePermissions();

  useEffect(() => {
    Promise.all([getSpace(spaceId), getPageTree(spaceId)])
      .then(([sRes, tRes]) => { setSpace(sRes.data); setTree(tRes.data); })
      .finally(() => setLoading(false));
  }, [spaceId]);

  if (loading) return <PageSpinner />;
  if (!space) return <p className="text-gray-500">Space not found.</p>;

  return (
    <div>
      <PageBreadcrumb items={[{ label: 'Spaces', href: '/spaces' }, { label: space.name }]} />
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{space.name}</h1>
          {space.description && <p className="text-gray-500 mt-1">{space.description}</p>}
        </div>
        {isEditor && (
          <Link to={`/spaces/${spaceId}/pages/new`}>
            <Button>+ New Page</Button>
          </Link>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Pages</h2>
        <PageTree nodes={tree} spaceId={spaceId} />
      </div>
    </div>
  );
}

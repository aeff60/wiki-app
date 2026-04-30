import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { listSpaces } from '../api/spaces.js';
import { useAuth } from '../hooks/useAuth.js';
import { usePermissions } from '../hooks/usePermissions.js';
import { Spinner } from '../components/ui/Spinner.jsx';

export function HomePage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { isEditor } = usePermissions();

  useEffect(() => {
    listSpaces()
      .then((r) => setSpaces(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <p className="text-gray-500 mt-1">Your team's knowledge base</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Spaces</h2>
        {isEditor && (
          <Link
            to="/spaces"
            className="text-sm text-blue-600 hover:underline"
          >
            + New Space
          </Link>
        )}
      </div>

      {spaces.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
          <p className="text-gray-500">No spaces yet.</p>
          {isEditor && (
            <Link to="/spaces" className="text-blue-600 hover:underline text-sm mt-2 inline-block">
              Create your first space
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {spaces.map((space) => (
            <Link
              key={space.id}
              to={`/spaces/${space.id}`}
              className="block p-5 border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all group"
            >
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600">{space.name}</h3>
              {space.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{space.description}</p>
              )}
              {space.is_public && (
                <span className="inline-block mt-2 text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">Public</span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { NavLink, useNavigate, useParams } from 'react-router-dom';
import { listSpaces } from '../../api/spaces.js';
import { getPageTree } from '../../api/pages.js';
import { usePermissions } from '../../hooks/usePermissions.js';
import { PageTree } from '../pages/PageTree.jsx';

export function Sidebar() {
  const [spaces, setSpaces] = useState([]);
  const [pageTree, setPageTree] = useState([]);
  const [expandedSpaceId, setExpandedSpaceId] = useState(null);
  const { spaceId } = useParams();
  const { isEditor } = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    listSpaces().then((r) => setSpaces(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (spaceId) {
      setExpandedSpaceId(spaceId);
      getPageTree(spaceId).then((r) => setPageTree(r.data)).catch(() => {});
    }
  }, [spaceId]);

  return (
    <nav className="h-full bg-gray-50 border-r border-gray-200 overflow-y-auto flex flex-col">
      <div className="p-3">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }
          end
        >
          Home
        </NavLink>
        <NavLink
          to="/spaces"
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded text-sm font-medium ${isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          All Spaces
        </NavLink>
      </div>

      <div className="border-t border-gray-200 pt-2 pb-1 px-3">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">Spaces</p>
        {spaces.map((space) => (
          <div key={space.id}>
            <div className="flex items-center">
              <button
                onClick={() => {
                  setExpandedSpaceId(expandedSpaceId === space.id ? null : space.id);
                  navigate(`/spaces/${space.id}`);
                }}
                className={`flex-1 text-left px-3 py-1.5 rounded text-sm font-medium truncate ${spaceId === space.id ? 'text-blue-700 bg-blue-50' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {space.name}
              </button>
            </div>

            {expandedSpaceId === space.id && (
              <div className="pl-4 mt-1">
                {isEditor && (
                  <button
                    onClick={() => navigate(`/spaces/${space.id}/pages/new`)}
                    className="w-full text-left px-3 py-1 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                  >
                    + New Page
                  </button>
                )}
                <PageTree nodes={pageTree} spaceId={space.id} />
              </div>
            )}
          </div>
        ))}

        {isEditor && (
          <button
            onClick={() => navigate('/spaces')}
            className="mt-2 w-full text-left px-3 py-1.5 text-xs text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
          >
            + New Space
          </button>
        )}
      </div>
    </nav>
  );
}

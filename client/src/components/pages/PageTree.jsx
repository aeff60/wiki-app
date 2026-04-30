import { useState } from 'react';
import { NavLink } from 'react-router-dom';

function TreeNode({ node, spaceId, depth = 0 }) {
  const [open, setOpen] = useState(depth < 2);
  const hasChildren = node.children?.length > 0;

  return (
    <li>
      <div className="flex items-center group">
        {hasChildren && (
          <button
            onClick={() => setOpen((o) => !o)}
            className="p-0.5 text-gray-400 hover:text-gray-600"
          >
            <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-90' : ''}`} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 4.707a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        {!hasChildren && <span className="w-4" />}
        <NavLink
          to={`/spaces/${spaceId}/pages/${node.id}`}
          className={({ isActive }) =>
            `flex-1 px-2 py-1 rounded text-sm truncate ${isActive ? 'text-blue-700 bg-blue-50' : 'text-gray-600 hover:bg-gray-100'}`
          }
        >
          {node.title}
        </NavLink>
      </div>
      {hasChildren && open && (
        <ul className="pl-4">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} spaceId={spaceId} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function PageTree({ nodes, spaceId }) {
  if (!nodes?.length) return <p className="text-xs text-gray-400 px-3 py-2">No pages yet</p>;
  return (
    <ul className="space-y-0.5">
      {nodes.map((node) => <TreeNode key={node.id} node={node} spaceId={spaceId} />)}
    </ul>
  );
}

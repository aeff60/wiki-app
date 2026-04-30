import { format } from 'date-fns';
import { Badge } from '../ui/Badge.jsx';
import { RoleSelector } from './RoleSelector.jsx';
import { Button } from '../ui/Button.jsx';

const roleBadge = { admin: 'red', editor: 'blue', viewer: 'gray' };

export function UserTable({ users, onRoleChange, onDeactivate }) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            {['Name', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
              <td className="px-4 py-3 text-gray-600">{user.email}</td>
              <td className="px-4 py-3">
                <RoleSelector value={user.role} onChange={(role) => onRoleChange(user.id, role)} />
              </td>
              <td className="px-4 py-3">
                <Badge color={user.is_active ? 'green' : 'red'}>
                  {user.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td className="px-4 py-3 text-gray-500">{format(new Date(user.created_at), 'MMM d, yyyy')}</td>
              <td className="px-4 py-3">
                {user.is_active && (
                  <Button variant="danger" size="sm" onClick={() => onDeactivate(user.id)}>
                    Deactivate
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

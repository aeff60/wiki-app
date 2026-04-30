import { useState, useEffect } from 'react';
import { listUsers, updateUser, deactivateUser } from '../../api/users.js';
import { useToast } from '../../hooks/useToast.js';
import { UserTable } from '../../components/admin/UserTable.jsx';
import { PageBreadcrumb } from '../../components/layout/PageBreadcrumb.jsx';
import { PageSpinner } from '../../components/ui/Spinner.jsx';

export function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  const load = () => listUsers().then((r) => setUsers(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      await updateUser(userId, { role });
      toast.success('Role updated');
      load();
    } catch {
      toast.error('Failed to update role');
    }
  };

  const handleDeactivate = async (userId) => {
    if (!confirm('Deactivate this user?')) return;
    try {
      await deactivateUser(userId);
      toast.success('User deactivated');
      load();
    } catch {
      toast.error('Failed to deactivate user');
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageBreadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Users' }]} />
      <h1 className="text-2xl font-bold text-gray-900 mb-6">User Management</h1>
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <UserTable users={users} onRoleChange={handleRoleChange} onDeactivate={handleDeactivate} />
      </div>
    </div>
  );
}

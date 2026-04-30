import { Link } from 'react-router-dom';

export function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/admin/users"
          className="p-5 border border-gray-200 rounded-xl hover:border-blue-200 hover:shadow-sm transition-all"
        >
          <h2 className="font-semibold text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage user roles and access</p>
        </Link>
      </div>
    </div>
  );
}

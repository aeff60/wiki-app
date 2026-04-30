import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { listSpaces, createSpace } from '../api/spaces.js';
import { usePermissions } from '../hooks/usePermissions.js';
import { useToast } from '../hooks/useToast.js';
import { Button } from '../components/ui/Button.jsx';
import { Modal } from '../components/ui/Modal.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function SpaceListPage() {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { isEditor } = usePermissions();
  const toast = useToast();
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const load = () => listSpaces().then((r) => setSpaces(r.data)).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const onSubmit = async (data) => {
    try {
      await createSpace({ ...data, is_public: data.is_public === 'true' });
      toast.success('Space created');
      setShowModal(false);
      reset();
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create space');
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">All Spaces</h1>
        {isEditor && (
          <Button onClick={() => setShowModal(true)}>+ New Space</Button>
        )}
      </div>

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
          </Link>
        ))}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="New Space">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input {...register('name', { required: true })} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea {...register('description')} rows={3} className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="is_public" {...register('is_public')} className="rounded border-gray-300" />
            <label htmlFor="is_public" className="text-sm text-gray-700">Make this space public</label>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

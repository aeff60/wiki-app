import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createPage } from '../api/pages.js';
import { useToast } from '../hooks/useToast.js';
import { MarkdownEditor } from '../components/editor/MarkdownEditor.jsx';
import { TagInput } from '../components/ui/TagInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb.jsx';

export function PageNewPage() {
  const { spaceId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await createPage(spaceId, { title, content, tags, is_published: isPublished });
      toast.success('Page created');
      navigate(`/spaces/${spaceId}/pages/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create page');
      setSaving(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb items={[
        { label: 'Spaces', href: '/spaces' },
        { label: spaceId, href: `/spaces/${spaceId}` },
        { label: 'New Page' },
      ]} />

      <form onSubmit={handleCreate} className="space-y-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Page title"
          className="w-full text-2xl font-bold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-400"
          required
        />

        <MarkdownEditor value={content} onChange={setContent} />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="rounded border-gray-300"
          />
          <label htmlFor="published" className="text-sm text-gray-700">Published</label>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={saving}>{saving ? 'Creating…' : 'Create page'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/spaces/${spaceId}`)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

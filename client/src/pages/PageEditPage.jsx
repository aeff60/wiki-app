import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPage, updatePage } from '../api/pages.js';
import { useToast } from '../hooks/useToast.js';
import { MarkdownEditor } from '../components/editor/MarkdownEditor.jsx';
import { TagInput } from '../components/ui/TagInput.jsx';
import { Button } from '../components/ui/Button.jsx';
import { PageBreadcrumb } from '../components/layout/PageBreadcrumb.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function PageEditPage() {
  const { spaceId, pageId } = useParams();
  const [page, setPage] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [changeSummary, setChangeSummary] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    getPage(spaceId, pageId)
      .then((r) => {
        setPage(r.data);
        setTitle(r.data.title);
        setContent(r.data.content);
        setTags(r.data.tags?.map((t) => t.name) || []);
        setIsPublished(r.data.is_published);
      })
      .finally(() => setLoading(false));
  }, [spaceId, pageId]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updatePage(spaceId, pageId, { title, content, tags, is_published: isPublished, change_summary: changeSummary });
      toast.success('Page saved');
      navigate(`/spaces/${spaceId}/pages/${pageId}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageSpinner />;

  return (
    <div>
      <PageBreadcrumb items={[
        { label: 'Spaces', href: '/spaces' },
        { label: page?.title || 'Page', href: `/spaces/${spaceId}/pages/${pageId}` },
        { label: 'Edit' },
      ]} />

      <form onSubmit={handleSave} className="space-y-4">
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Change summary (optional)</label>
          <input
            value={changeSummary}
            onChange={(e) => setChangeSummary(e.target.value)}
            placeholder="Briefly describe what changed"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
          <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</Button>
          <Button type="button" variant="secondary" onClick={() => navigate(`/spaces/${spaceId}/pages/${pageId}`)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}

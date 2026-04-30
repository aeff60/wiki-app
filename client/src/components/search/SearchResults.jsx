import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export function SearchResults({ results, query }) {
  if (!results?.length) {
    return (
      <div className="text-center py-12 text-gray-500">
        {query ? `No results found for "${query}"` : 'Enter a search term above'}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((r) => (
        <article key={r.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-200 hover:shadow-sm transition-all">
          <Link
            to={`/spaces/${r.space_id}/pages/${r.id}`}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {r.title}
          </Link>
          <p className="text-xs text-gray-500 mt-1">
            {r.space_name} · {r.author_name} · {format(new Date(r.updated_at), 'MMM d, yyyy')}
          </p>
          {r.excerpt && (
            <p
              className="text-sm text-gray-600 mt-2 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: r.excerpt }}
            />
          )}
        </article>
      ))}
    </div>
  );
}

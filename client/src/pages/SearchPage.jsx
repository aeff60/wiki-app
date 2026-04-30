import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { search } from '../api/search.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { SearchResults } from '../components/search/SearchResults.jsx';
import { PageSpinner } from '../components/ui/Spinner.jsx';

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) { setResults([]); return; }
    setLoading(true);
    setSearchParams({ q: debouncedQuery });
    search(debouncedQuery)
      .then((r) => setResults(r.data))
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [debouncedQuery]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Search</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search pages…"
        autoFocus
        className="w-full border border-gray-300 rounded-lg px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
      />
      {loading ? <PageSpinner /> : (
        <>
          {debouncedQuery && !loading && (
            <p className="text-sm text-gray-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for "{debouncedQuery}"</p>
          )}
          <SearchResults results={results} query={debouncedQuery} />
        </>
      )}
    </div>
  );
}

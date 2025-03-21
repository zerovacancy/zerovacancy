import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface BlogSearchProps {
  onSearch: (query: string) => void;
  initialQuery?: string;
}

const BlogSearch = ({ onSearch, initialQuery = '' }: BlogSearchProps) => {
  const [query, setQuery] = useState(initialQuery);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="relative flex w-full items-center"
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles..."
        className="w-full rounded-md border border-gray-200 bg-white py-2 pl-4 pr-12 text-sm shadow-sm focus:border-brand-purple focus:outline-none focus:ring-1 focus:ring-brand-purple"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md bg-brand-purple p-1.5 text-white transition-colors hover:bg-brand-purple-dark"
        aria-label="Search"
      >
        <Search size={16} />
      </button>
    </form>
  );
};

export default BlogSearch;
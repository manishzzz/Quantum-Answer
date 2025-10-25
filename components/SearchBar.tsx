import React from 'react';
import { SearchIcon } from './Icons';

interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  onFocus: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, onQueryChange, onFocus }) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <SearchIcon />
      </div>
      <input
        type="text"
        placeholder="Search for a question..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        onFocus={onFocus}
        className="w-full bg-brand-bg border-2 border-brand-border rounded-full py-3 pl-12 pr-4 text-brand-secondary placeholder-brand-muted focus:ring-2 focus:ring-brand-primary focus:outline-none focus:border-brand-primary transition-all duration-300"
      />
    </div>
  );
};

export default SearchBar;
import React from 'react';
import { Question } from '../types';

interface SearchResultsProps {
  results: Question[];
  onSelectResult: (questionId: string) => void;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectResult }) => {
  return (
    <div className="absolute top-full mt-2 w-full bg-brand-surface-glass rounded-xl shadow-2xl border border-white/10 z-20 overflow-hidden animate-fade-in backdrop-blur-xl" style={{ animationDuration: '200ms' }}>
      {results.length > 0 ? (
        <ul className="py-2 max-h-96 overflow-y-auto">
          {results.map(question => (
            <li key={question.id}>
              <button
                onClick={() => onSelectResult(question.id)}
                className="w-full text-left px-4 py-3 text-brand-secondary hover:bg-brand-primary hover:text-white transition-colors"
              >
                <span className="font-semibold">{question.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="p-4 text-center text-brand-muted">
          No questions found.
        </div>
      )}
    </div>
  );
};

export default SearchResults;
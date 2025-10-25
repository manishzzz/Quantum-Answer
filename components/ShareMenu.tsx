import React, { useState } from 'react';
import { TwitterIcon, LinkedInIcon, CopyIcon, CheckIcon } from './Icons';

interface ShareMenuProps {
  questionTitle: string;
  url: string;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ questionTitle, url }) => {
  const [isCopied, setIsCopied] = useState(false);

  const shareText = `Check out the evolving answer to this question on Quantum Answer: "${questionTitle}"`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(shareText)}`;
  const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(questionTitle)}&summary=${encodeURIComponent(shareText)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    // FIX: Added a closing brace for the try block to fix a syntax error.
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Failed to copy link.');
    }
  };

  const shareOptions = [
    { name: 'Twitter', icon: <TwitterIcon />, href: twitterUrl },
    { name: 'LinkedIn', icon: <LinkedInIcon />, href: linkedInUrl },
  ];

  return (
    <div className="absolute top-full right-0 mt-2 w-56 bg-brand-surface-glass rounded-xl shadow-2xl border border-white/10 z-20 animate-fade-in backdrop-blur-xl" style={{ animationDuration: '150ms' }}>
      <div className="py-2" role="menu" aria-orientation="vertical" aria-labelledby="share-button">
        {shareOptions.map((option) => (
          <a
            key={option.name}
            href={option.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 text-sm text-brand-secondary hover:bg-white/10 transition-colors"
            role="menuitem"
          >
            {option.icon}
            <span>Share on {option.name}</span>
          </a>
        ))}
        <div className="my-1 h-px bg-white/10"></div>
        <button
          onClick={handleCopy}
          className="w-full flex items-center gap-3 px-4 py-2 text-sm text-brand-secondary hover:bg-white/10 transition-colors"
          role="menuitem"
        >
          {isCopied ? <CheckIcon /> : <CopyIcon />}
          <span>{isCopied ? 'Copied!' : 'Copy Link'}</span>
        </button>
      </div>
    </div>
  );
};

export default ShareMenu;
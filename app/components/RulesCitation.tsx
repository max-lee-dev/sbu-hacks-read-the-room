'use client';

import { useState } from 'react';

type Props = {
  rules: string;
};

export const RulesCitation = ({ rules }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!rules || rules.trim().length === 0) {
    return null;
  }

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle();
    }
  };

  return (
    <div className="rounded-lg border border-black bg-white">
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full rounded-t-lg p-4 text-left text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Collapse rules' : 'Expand rules'}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-black">Rules</h2>
          <span className="text-sm text-black">{isOpen ? '−' : '+'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="border-t border-black p-4">
          <p className="text-sm text-black">{rules}</p>
        </div>
      )}
    </div>
  );
};


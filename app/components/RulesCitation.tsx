'use client';

import { ScrollText } from 'lucide-react';
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
    <div className="rounded-2xl border border-black bg-white p-4 shadow-sm" style={{ backgroundColor: '#2D2D2D', border: '1px solid #404040' }}>
      <button
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className="w-full text-left focus:outline-none"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Collapse rules' : 'Expand rules'}
      >
        <div className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ScrollText className="h-5 w-5 text-black" style={{ color: '#FFFFFF' }} />
            <h2 className="text-lg font-bold text-black" style={{ color: '#FFFFFF' }}>Rules</h2>
          </div>
          <span className="text-sm text-black" style={{ color: '#E0E0E0' }}>{isOpen ? '−' : '+'}</span>
        </div>
      </button>
      {isOpen && (
        <div className="mt-2 border-t border-black pt-3" style={{ borderColor: '#404040' }}>
          <p className="text-sm text-black" style={{ color: '#B0B0B0' }}>{rules}</p>
        </div>
      )}
    </div>
  );
};


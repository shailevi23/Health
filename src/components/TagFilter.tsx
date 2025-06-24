'use client';

import React from 'react';
import type { TagFilterProps } from '@/types';

const TagFilter: React.FC<TagFilterProps> = ({
  tags,
  selectedTags,
  onTagSelect
}) => {
  return (
    <div className="flex flex-wrap gap-2 p-4">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => onTagSelect(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-emerald-600 text-white'
              : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default TagFilter; 
'use client';

import React, { useState } from 'react';
import BlogCard from './BlogCard';
import TagFilter from './TagFilter';
import AdBanner from './AdBanner';
import type { BlogPost } from '@/types';

interface BlogListProps {
  posts: BlogPost[];
}

export default function BlogList({ posts }: BlogListProps) {
  // Extract all unique tags from posts
  const extractTags = (post: any) => {
    if (!post.tags) return [];
    
    if (Array.isArray(post.tags)) {
      // If tags is an array of strings
      if (post.tags.length === 0) return [];
      
      if (typeof post.tags[0] === 'string') {
        return post.tags as string[];
      }
      
      // If tags is an array of objects with a tag property
      return post.tags.map((tagObj: any) => {
        if (typeof tagObj === 'string') return tagObj;
        if (tagObj && tagObj.tag && tagObj.tag.name) return tagObj.tag.name;
        return '';
      }).filter(Boolean);
    }
    
    return [];
  };

  // Get all unique tags
  const allTagsArray = posts.flatMap(extractTags);
  const allTags = Array.from(new Set(allTagsArray.filter(Boolean)));
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = selectedTags.length > 0
    ? posts.filter(post => {
        const postTags = extractTags(post);
        return selectedTags.every(tag => postTags.includes(tag));
      })
    : posts;

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <>
      <div className="mb-8">
        <TagFilter 
          tags={allTags}
          selectedTags={selectedTags}
          onTagSelect={handleTagSelect}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPosts.map((post, index) => (
          <React.Fragment key={post.id}>
            {index > 0 && index % 6 === 0 && (
              <div className="col-span-full">
                <AdBanner slot="content" />
              </div>
            )}
            <BlogCard post={post} />
          </React.Fragment>
        ))}
      </div>
    </>
  );
} 
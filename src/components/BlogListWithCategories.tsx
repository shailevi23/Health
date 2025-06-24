'use client';

import React, { useState } from 'react';
import BlogCard from './BlogCard';
import AdBanner from './AdBanner';
import type { BlogPost } from '@/types';

interface BlogListWithCategoriesProps {
  posts: BlogPost[];
  featuredCategories: string[];
}

export default function BlogListWithCategories({ posts, featuredCategories }: BlogListWithCategoriesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Extract tags from the Supabase nested structure if needed
  const extractTags = (post: BlogPost) => {
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

  // Filter posts based on selected category
  const filteredPosts = selectedCategory 
    ? posts.filter(post => {
        const postTags = extractTags(post);
        return postTags.includes(selectedCategory);
      })
    : posts;

  // Handle category selection
  const handleCategorySelect = (category: string) => {
    if (selectedCategory === category) {
      setSelectedCategory(null); // Deselect if already selected
    } else {
      setSelectedCategory(category);
    }
  };

  return (
    <>
      {/* Featured Categories */}
      <section className="py-10 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-4">
            {featuredCategories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategorySelect(category)}
                className={`px-6 py-3 rounded-full font-medium shadow-sm hover:shadow-md transition-all ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-emerald-600 hover:bg-emerald-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-7xl mx-auto">
            {selectedCategory && (
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedCategory} Articles
                </h2>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-2 text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View all articles
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post, index) => (
                <React.Fragment key={post.id}>
                  {index > 0 && index % 6 === 0 && (
                    <div className="col-span-full">
                      <AdBanner slot="content" />
                    </div>
                  )}
                  <BlogCard post={post} priority={index < 3} />
                </React.Fragment>
              ))}
            </div>

            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium text-gray-700">No articles found in this category</h3>
                <button 
                  onClick={() => setSelectedCategory(null)}
                  className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  View all articles
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
} 
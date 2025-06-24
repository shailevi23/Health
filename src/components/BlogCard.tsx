import React from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types';
import ImageWithFallback from './ImageWithFallback';

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const {
    title,
    excerpt,
    slug,
    cover_image,
    created_at,
    author,
    tags
  } = post;

  // Format the date
  const formattedDate = new Date(created_at || '').toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Get the first tag as category
  const category = tags && tags.length > 0
    ? typeof tags[0] === 'string'
      ? tags[0]
      : tags[0]?.tag?.name
    : 'Health';

  // Default cover image if none provided
  const coverImage = cover_image || '/images/blog/mindful-eating.jpg';

  return (
    <Link href={`/blog/${slug}`} className="group">
      <article className="bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-lg">
        {/* Image */}
        <div className="relative h-48 w-full overflow-hidden">
          <ImageWithFallback
            src={coverImage}
            alt={title}
            fill
            fallbackSrc="/images/blog/mindful-eating.jpg"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <span className="text-primary-600">{category}</span>
            <span>•</span>
            <time>{formattedDate}</time>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 line-clamp-2">
            {excerpt}
          </p>

          {/* Author */}
          {author && (
            <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
              <div className="relative h-8 w-8 rounded-full overflow-hidden mr-3">
                <ImageWithFallback
                  src={author.avatar || '/images/authors/sarah.jpg'}
                  alt={author.name}
                  fill
                  fallbackSrc="/images/authors/sarah.jpg"
                  className="object-cover"
                />
              </div>
              <span className="text-sm text-gray-700">{author.name}</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default BlogCard; 
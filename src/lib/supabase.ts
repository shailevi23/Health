'use client';

import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing environment variables for Supabase');
}

// Create a single supabase client for interacting with your database
export const supabase = createBrowserClient(supabaseUrl, supabaseKey);

// Helper function to get featured content
export async function getFeaturedContent() {
  try {
    const [postsResponse, recipesResponse] = await Promise.all([
      supabase
        .from('blog_posts')
        .select(`
          *,
          author:authors(*),
          tags:blog_post_tags(tag:tags(*))
        `)
        .eq('is_featured', true)
        .limit(3),
      supabase
        .from('recipes')
        .select(`
          *,
          tags:recipe_tags(tag:tags(*))
        `)
        .eq('is_featured', true)
        .limit(3)
    ]);

    return {
      posts: postsResponse.data || [],
      recipes: recipesResponse.data || []
    };
  } catch (error) {
    console.error('Error fetching featured content:', error);
    return { posts: [], recipes: [] };
  }
} 
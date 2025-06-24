import { createClient } from '@supabase/supabase-js';

// Define test data type
interface TestData {
  authorId: string;
  tagIds: string[];
}

declare global {
  var __TEST_DATA__: TestData;
}

// Initialize test data
global.__TEST_DATA__ = {
  authorId: 'test-author-id',
  tagIds: ['test-tag-1', 'test-tag-2']
};

// Create a mocked Supabase client for testing
export const supabaseTestClient = {
  from: (table: string) => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockImplementation((field: string, value: string) => {
      if (field === 'slug') {
        switch (value) {
          case 'test-blog-post':
            return {
              single: () => Promise.resolve({
                data: {
                  id: 'test-post-id',
                  title: 'Test Blog Post',
                  slug: 'test-blog-post',
                  excerpt: 'This is a test blog post',
                  content: 'Test content for the blog post',
                  image_url: '/images/blog/test.jpg',
                  author_id: global.__TEST_DATA__.authorId,
                  is_featured: false,
                  author: {
                    id: global.__TEST_DATA__.authorId,
                    name: 'Test Author',
                    bio: 'Test author bio',
                    avatar: '/images/authors/test.jpg'
                  },
                  tags: global.__TEST_DATA__.tagIds.map((id, index) => ({
                    id,
                    name: `Test Tag ${index + 1}`
                  }))
                },
                error: null
              })
            };
          case 'test-recipe':
            return {
              single: () => Promise.resolve({
                data: {
                  id: 'test-recipe-id',
                  title: 'Test Recipe',
                  slug: 'test-recipe',
                  description: 'This is a test recipe',
                  content: 'Test content for the recipe',
                  image_url: '/images/recipes/test.jpg',
                  difficulty: 'easy',
                  servings: 4,
                  ingredients: ['Ingredient 1', 'Ingredient 2'],
                  instructions: ['Step 1', 'Step 2'],
                  is_featured: false,
                  tags: global.__TEST_DATA__.tagIds.map((id, index) => ({
                    id,
                    name: `Test Tag ${index + 1}`
                  }))
                },
                error: null
              })
            };
          default:
            return {
              single: () => Promise.resolve({ data: null, error: null })
            };
        }
      }
      return {
        single: () => Promise.resolve({
          data: null,
          error: { message: 'Not found', code: 'PGRST116' }
        })
      };
    }),
    neq: jest.fn().mockReturnThis(),
    single: jest.fn().mockImplementation(() => {
      switch (table) {
        case 'authors':
          return Promise.resolve({
            data: {
              id: global.__TEST_DATA__.authorId,
              name: 'Test Author',
              bio: 'Test author bio',
              avatar: '/images/authors/test.jpg'
            },
            error: null
          });
        case 'tags':
          return Promise.resolve({
            data: global.__TEST_DATA__.tagIds.map((id, index) => ({
              id,
              name: `Test Tag ${index + 1}`
            })),
            error: null
          });
        case 'blog_posts':
          return Promise.resolve({
            data: {
              id: 'test-post-id',
              title: 'Test Blog Post',
              slug: 'test-blog-post',
              excerpt: 'This is a test blog post',
              content: 'Test content for the blog post',
              image_url: '/images/blog/test.jpg',
              author_id: global.__TEST_DATA__.authorId,
              is_featured: false,
              author: {
                id: global.__TEST_DATA__.authorId,
                name: 'Test Author',
                bio: 'Test author bio',
                avatar: '/images/authors/test.jpg'
              },
              tags: global.__TEST_DATA__.tagIds.map((id, index) => ({
                id,
                name: `Test Tag ${index + 1}`
              }))
            },
            error: null
          });
        case 'recipes':
          return Promise.resolve({
            data: {
              id: 'test-recipe-id',
              title: 'Test Recipe',
              slug: 'test-recipe',
              description: 'This is a test recipe',
              content: 'Test content for the recipe',
              image_url: '/images/recipes/test.jpg',
              difficulty: 'easy',
              servings: 4,
              ingredients: ['Ingredient 1', 'Ingredient 2'],
              instructions: ['Step 1', 'Step 2'],
              is_featured: false,
              tags: global.__TEST_DATA__.tagIds.map((id, index) => ({
                id,
                name: `Test Tag ${index + 1}`
              }))
            },
            error: null
          });
        default:
          return Promise.resolve({ data: null, error: null });
      }
    })
  })
};

// Add custom matchers if needed
expect.extend({
  toBeValidUUID(received) {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    const pass = uuidRegex.test(received);
    return {
      message: () => `expected ${received} to be a valid UUID`,
      pass
    };
  }
}); 
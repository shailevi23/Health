export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  instagram?: string;
  created_at: string;
}

export interface Tag {
  id: string;
  name: string;
  created_at: string;
}

export interface BlogPostTag {
  blog_post_id: string;
  tag_id: string;
  tag: Tag;
}

export interface RecipeTag {
  recipe_id: string;
  tag_id: string;
  tag: Tag;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  coverImage?: string;
  author_id?: string;
  author?: Author;
  tags?: (string | BlogPostTag)[];
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
}

export interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image?: string;
  coverImage?: string;
  prep_time?: string;
  prepTime?: string;
  cook_time?: string;
  cookTime?: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  tags?: (string | RecipeTag)[];
  created_at?: string;
  createdAt?: string;
  updated_at?: string;
  updatedAt?: string;
  is_featured?: boolean;
  isFeatured?: boolean;
}

export interface AffiliateProduct {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  price: string;
  category: string;
  is_featured?: boolean;
  isFeatured?: boolean;
}

export interface AdBannerProps {
  slot: 'hero' | 'content' | 'sidebar';
  className?: string;
}

export interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
}

declare global {
  namespace NodeJS {
    interface Global {
      __TEST_DATA__: {
        authorId: string;
        tagIds: string[];
      };
    }
  }
}

export {}; 
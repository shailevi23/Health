import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  instagram?: string;
}

interface Tag {
  id: string;
  name: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_id: string;
  is_featured: boolean;
}

interface Recipe {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  cover_image: string;
  prep_time: string;
  cook_time: string;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: string[];
  instructions: string[];
  is_featured: boolean;
}

interface BlogPostTag {
  blog_post_id: string;
  tag_id: string;
}

interface RecipeTag {
  recipe_id: string;
  tag_id: string;
}

async function insertFeaturedContent() {
  try {
    // Insert author
    const { data: author, error: authorError } = await supabase
      .from('authors')
      .upsert({
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah.jpg',
        bio: 'Certified nutritionist and wellness coach passionate about helping others achieve their health goals.',
        twitter: 'healthcoachsarah',
        instagram: 'sarahhealthlife'
      })
      .select()
      .single();

    if (authorError) {
      throw authorError;
    }

    // Insert tags
    const tags: Tag[] = [
      { id: '223e4567-e89b-12d3-a456-426614174001', name: 'Nutrition' },
      { id: '223e4567-e89b-12d3-a456-426614174002', name: 'Wellness' },
      { id: '223e4567-e89b-12d3-a456-426614174003', name: 'Recipes' },
      { id: '223e4567-e89b-12d3-a456-426614174004', name: 'Mindfulness' },
      { id: '223e4567-e89b-12d3-a456-426614174005', name: 'Breakfast' },
      { id: '223e4567-e89b-12d3-a456-426614174006', name: 'Lunch' },
      { id: '223e4567-e89b-12d3-a456-426614174007', name: 'Vegan' }
    ];

    const { error: tagsError } = await supabase
      .from('tags')
      .upsert(tags);

    if (tagsError) {
      throw tagsError;
    }

    // Insert blog posts
    const blogPosts = [
      {
        title: 'Getting Started with Mindful Eating',
        slug: 'getting-started-with-mindful-eating',
        excerpt: 'Learn how mindful eating can transform your relationship with food and improve your overall well-being.',
        content: '# Getting Started with Mindful Eating\n\nMindful eating is a powerful practice that can transform your relationship with food...',
        cover_image: '/images/blog/mindful-eating.jpg',
        author_id: author.id,
        is_featured: true
      },
      {
        title: 'The Benefits of Plant-Based Nutrition',
        slug: 'benefits-of-plant-based-nutrition',
        excerpt: 'Discover the numerous health benefits of adopting a plant-based diet and how to get started.',
        content: '# The Benefits of Plant-Based Nutrition\n\nA plant-based diet can provide numerous health benefits...',
        cover_image: '/images/blog/plant-based-nutrition.jpg',
        author_id: author.id,
        is_featured: true
      },
      {
        title: 'Creating a Sustainable Fitness Routine',
        slug: 'creating-sustainable-fitness-routine',
        excerpt: 'Learn how to build a fitness routine that you can maintain long-term for better health.',
        content: '# Creating a Sustainable Fitness Routine\n\nBuilding a sustainable fitness routine is key to long-term success...',
        cover_image: '/images/blog/fitness-routine.jpg',
        author_id: author.id,
        is_featured: true
      }
    ];

    const { data: posts, error: postsError } = await supabase
      .from('blog_posts')
      .upsert(blogPosts)
      .select();

    if (postsError) {
      throw postsError;
    }

    // Insert recipes
    const recipes = [
      {
        title: 'Quinoa Buddha Bowl',
        slug: 'quinoa-buddha-bowl',
        description: 'A nourishing bowl packed with protein, healthy fats, and colorful vegetables.',
        content: '# Quinoa Buddha Bowl\n\nThis nutritious bowl is perfect for a healthy lunch or dinner...',
        cover_image: '/images/recipes/buddha-bowl.jpg',
        prep_time: '15 minutes',
        cook_time: '20 minutes',
        servings: 2,
        difficulty: 'easy',
        ingredients: ['1 cup quinoa', '2 cups water', '1 avocado', '1 cup cherry tomatoes', '2 cups baby spinach', '1/4 cup hummus'],
        instructions: ['Cook quinoa according to package instructions', 'Slice avocado and tomatoes', 'Arrange all ingredients in bowls', 'Top with hummus and serve'],
        is_featured: true
      },
      {
        title: 'Green Smoothie Bowl',
        slug: 'green-smoothie-bowl',
        description: 'Start your day with this antioxidant-rich smoothie bowl topped with fresh fruits and seeds.',
        content: '# Green Smoothie Bowl\n\nPacked with nutrients to start your day right...',
        cover_image: '/images/recipes/smoothie-bowl.jpg',
        prep_time: '10 minutes',
        cook_time: '0 minutes',
        servings: 1,
        difficulty: 'easy',
        ingredients: ['2 bananas', '2 cups spinach', '1 cup almond milk', '1 tbsp chia seeds', 'Toppings: granola, berries, coconut flakes'],
        instructions: ['Blend bananas, spinach, and almond milk until smooth', 'Pour into a bowl', 'Top with granola, berries, and coconut flakes'],
        is_featured: true
      },
      {
        title: 'Mediterranean Chickpea Salad',
        slug: 'mediterranean-chickpea-salad',
        description: 'A refreshing and protein-rich salad perfect for lunch or as a side dish.',
        content: '# Mediterranean Chickpea Salad\n\nThis vibrant salad is perfect for meal prep...',
        cover_image: '/images/recipes/chickpea-salad.jpg',
        prep_time: '15 minutes',
        cook_time: '0 minutes',
        servings: 4,
        difficulty: 'easy',
        ingredients: ['2 cans chickpeas', '1 cucumber', '1 cup cherry tomatoes', '1/2 red onion', '1/2 cup olives', 'Feta cheese', 'Olive oil', 'Lemon juice'],
        instructions: ['Drain and rinse chickpeas', 'Chop vegetables', 'Combine all ingredients', 'Dress with olive oil and lemon juice'],
        is_featured: true
      }
    ];

    const { data: insertedRecipes, error: recipesError } = await supabase
      .from('recipes')
      .upsert(recipes)
      .select();

    if (recipesError) {
      throw recipesError;
    }

    // Link tags to blog posts
    const blogPostTags: BlogPostTag[] = [];
    const postTagMap: Record<string, string[]> = {
      'getting-started-with-mindful-eating': ['Mindfulness', 'Wellness', 'Nutrition'],
      'benefits-of-plant-based-nutrition': ['Nutrition', 'Wellness', 'Vegan'],
      'creating-sustainable-fitness-routine': ['Wellness']
    };

    for (const post of posts!) {
      const postTags = postTagMap[post.slug] || [];
      for (const tagName of postTags) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
          blogPostTags.push({
            blog_post_id: post.id,
            tag_id: tag.id
          });
        }
      }
    }

    if (blogPostTags.length > 0) {
      const { error: blogPostTagsError } = await supabase
        .from('blog_post_tags')
        .upsert(blogPostTags);

      if (blogPostTagsError) {
        throw blogPostTagsError;
      }
    }

    // Link tags to recipes
    const recipeTagsArray: RecipeTag[] = [];
    const recipeTagMap: Record<string, string[]> = {
      'quinoa-buddha-bowl': ['Recipes', 'Lunch', 'Vegan'],
      'green-smoothie-bowl': ['Recipes', 'Breakfast', 'Vegan'],
      'mediterranean-chickpea-salad': ['Recipes', 'Lunch', 'Vegan']
    };

    for (const recipe of insertedRecipes!) {
      const recipeTags = recipeTagMap[recipe.slug] || [];
      for (const tagName of recipeTags) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
          recipeTagsArray.push({
            recipe_id: recipe.id,
            tag_id: tag.id
          });
        }
      }
    }

    if (recipeTagsArray.length > 0) {
      const { error: recipeTagsError } = await supabase
        .from('recipe_tags')
        .upsert(recipeTagsArray);

      if (recipeTagsError) {
        throw recipeTagsError;
      }
    }

    console.log('Featured content inserted successfully');
  } catch (error) {
    console.error('Error inserting featured content:', error);
    process.exit(1);
  }
}

insertFeaturedContent(); 
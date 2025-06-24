import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function createTables() {
  try {
    // Create authors table
    await supabaseAdmin.rpc('execute_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS authors (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL,
          avatar TEXT NOT NULL,
          bio TEXT,
          twitter TEXT,
          instagram TEXT,
          facebook TEXT,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blog_posts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          excerpt TEXT NOT NULL,
          content TEXT NOT NULL,
          cover_image TEXT NOT NULL,
          author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS recipes (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          description TEXT NOT NULL,
          content TEXT NOT NULL,
          cover_image TEXT NOT NULL,
          prep_time TEXT NOT NULL,
          cook_time TEXT NOT NULL,
          servings INTEGER NOT NULL,
          difficulty TEXT NOT NULL,
          ingredients TEXT[] NOT NULL,
          instructions TEXT[] NOT NULL,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS affiliate_products (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          link TEXT NOT NULL,
          price TEXT NOT NULL,
          category TEXT NOT NULL,
          is_featured BOOLEAN DEFAULT false,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS tags (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          name TEXT NOT NULL UNIQUE,
          created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS blog_post_tags (
          blog_post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
          tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (blog_post_id, tag_id)
        );

        CREATE TABLE IF NOT EXISTS recipe_tags (
          recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
          tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
          PRIMARY KEY (recipe_id, tag_id)
        );

        CREATE OR REPLACE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_authors_updated_at
          BEFORE UPDATE ON authors
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER update_blog_posts_updated_at
          BEFORE UPDATE ON blog_posts
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER update_recipes_updated_at
          BEFORE UPDATE ON recipes
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at();

        CREATE TRIGGER update_affiliate_products_updated_at
          BEFORE UPDATE ON affiliate_products
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at();
      `
    });

    console.log('Tables created successfully');
  } catch (error) {
    console.error('Error creating tables:', error);
    throw error;
  }
}

async function insertSampleData() {
  try {
    // Insert sample author
    const { data: author, error: authorError } = await supabaseAdmin
      .from('authors')
      .insert([{
        id: '123e4567-e89b-12d3-a456-426614174000',
        name: 'Sarah Johnson',
        avatar: '/images/authors/sarah.jpg',
        bio: 'Certified nutritionist and wellness coach passionate about helping others achieve their health goals.',
        twitter: 'healthcoachsarah',
        instagram: 'sarahhealthlife'
      }])
      .select()
      .single();

    if (authorError) {
      throw authorError;
    }

    if (!author) {
      throw new Error('Failed to insert author');
    }

    // Insert sample blog posts
    const { error: blogError } = await supabaseAdmin
      .from('blog_posts')
      .insert([
        {
          title: 'Getting Started with Mindful Eating',
          slug: 'getting-started-with-mindful-eating',
          excerpt: 'Learn how mindful eating can transform your relationship with food and improve your overall well-being.',
          content: '# Getting Started with Mindful Eating\n\nMindful eating is...',
          cover_image: '/images/blog/mindful-eating.jpg',
          author_id: author.id,
          is_featured: true
        },
        {
          title: '10 Simple Morning Habits for Better Health',
          slug: '10-simple-morning-habits',
          excerpt: 'Start your day right with these easy-to-implement morning habits that will boost your energy and health.',
          content: '# 10 Simple Morning Habits\n\n1. Drink water first thing...',
          cover_image: '/images/blog/morning-habits.jpg',
          author_id: author.id,
          is_featured: true
        }
      ]);

    if (blogError) {
      throw blogError;
    }

    // Insert sample recipes
    const { error: recipesError } = await supabaseAdmin
      .from('recipes')
      .insert([
        {
          title: 'Quinoa Buddha Bowl',
          slug: 'quinoa-buddha-bowl',
          description: 'A nourishing bowl packed with protein, healthy fats, and colorful vegetables.',
          content: '# Quinoa Buddha Bowl\n\nThis nutritious bowl...',
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
          content: '# Green Smoothie Bowl\n\nPacked with nutrients...',
          cover_image: '/images/recipes/smoothie-bowl.jpg',
          prep_time: '10 minutes',
          cook_time: '0 minutes',
          servings: 1,
          difficulty: 'easy',
          ingredients: ['2 bananas', '2 cups spinach', '1 cup almond milk', '1 tbsp chia seeds', 'Toppings: granola, berries, coconut flakes'],
          instructions: ['Blend bananas, spinach, and almond milk until smooth', 'Pour into a bowl', 'Top with granola, berries, and coconut flakes'],
          is_featured: true
        }
      ]);

    if (recipesError) {
      throw recipesError;
    }

    // Insert sample affiliate products
    const { error: productsError } = await supabaseAdmin
      .from('affiliate_products')
      .insert([
        {
          title: 'Premium Yoga Mat',
          description: 'Eco-friendly, non-slip yoga mat perfect for your daily practice.',
          image: '/images/products/yoga-mat.jpg',
          link: 'https://example.com/yoga-mat',
          price: '$68.00',
          category: 'Fitness',
          is_featured: true
        },
        {
          title: 'High-Speed Blender',
          description: 'Professional-grade blender for smooth green smoothies and healthy soups.',
          image: '/images/products/blender.jpg',
          link: 'https://example.com/blender',
          price: '$199.99',
          category: 'Kitchen',
          is_featured: true
        }
      ]);

    if (productsError) {
      throw productsError;
    }

    // Insert sample tags
    const { data: tags, error: tagsError } = await supabaseAdmin
      .from('tags')
      .insert([
        { id: '223e4567-e89b-12d3-a456-426614174001', name: 'Nutrition' },
        { id: '223e4567-e89b-12d3-a456-426614174002', name: 'Wellness' },
        { id: '223e4567-e89b-12d3-a456-426614174003', name: 'Recipes' },
        { id: '223e4567-e89b-12d3-a456-426614174004', name: 'Mindfulness' },
        { id: '223e4567-e89b-12d3-a456-426614174005', name: 'Breakfast' },
        { id: '223e4567-e89b-12d3-a456-426614174006', name: 'Lunch' },
        { id: '223e4567-e89b-12d3-a456-426614174007', name: 'Vegan' }
      ])
      .select();

    if (tagsError) {
      throw tagsError;
    }

    if (!tags) {
      throw new Error('Failed to insert tags');
    }

    // Link tags to blog posts
    const { data: blogPosts, error: blogPostsError } = await supabaseAdmin
      .from('blog_posts')
      .select('id, slug')
      .in('slug', ['getting-started-with-mindful-eating', '10-simple-morning-habits']);

    if (blogPostsError) {
      throw blogPostsError;
    }

    if (!blogPosts) {
      throw new Error('Failed to fetch blog posts');
    }

    const mindfulEatingPost = blogPosts.find(post => post.slug === 'getting-started-with-mindful-eating');
    const morningHabitsPost = blogPosts.find(post => post.slug === '10-simple-morning-habits');

    if (mindfulEatingPost) {
      const { error: mindfulTagsError } = await supabaseAdmin
        .from('blog_post_tags')
        .insert(
          tags
            .filter(tag => ['Mindfulness', 'Wellness', 'Nutrition'].includes(tag.name))
            .map(tag => ({ blog_post_id: mindfulEatingPost.id, tag_id: tag.id }))
        );

      if (mindfulTagsError) {
        throw mindfulTagsError;
      }
    }

    if (morningHabitsPost) {
      const { error: morningTagsError } = await supabaseAdmin
        .from('blog_post_tags')
        .insert(
          tags
            .filter(tag => ['Wellness', 'Mindfulness'].includes(tag.name))
            .map(tag => ({ blog_post_id: morningHabitsPost.id, tag_id: tag.id }))
        );

      if (morningTagsError) {
        throw morningTagsError;
      }
    }

    // Link tags to recipes
    const { data: recipes, error: recipesQueryError } = await supabaseAdmin
      .from('recipes')
      .select('id, slug')
      .in('slug', ['quinoa-buddha-bowl', 'green-smoothie-bowl']);

    if (recipesQueryError) {
      throw recipesQueryError;
    }

    if (!recipes) {
      throw new Error('Failed to fetch recipes');
    }

    const buddhaBowl = recipes.find(recipe => recipe.slug === 'quinoa-buddha-bowl');
    const smoothieBowl = recipes.find(recipe => recipe.slug === 'green-smoothie-bowl');

    if (buddhaBowl) {
      const { error: buddhaBowlTagsError } = await supabaseAdmin
        .from('recipe_tags')
        .insert(
          tags
            .filter(tag => ['Recipes', 'Lunch', 'Vegan'].includes(tag.name))
            .map(tag => ({ recipe_id: buddhaBowl.id, tag_id: tag.id }))
        );

      if (buddhaBowlTagsError) {
        throw buddhaBowlTagsError;
      }
    }

    if (smoothieBowl) {
      const { error: smoothieBowlTagsError } = await supabaseAdmin
        .from('recipe_tags')
        .insert(
          tags
            .filter(tag => ['Recipes', 'Breakfast', 'Vegan'].includes(tag.name))
            .map(tag => ({ recipe_id: smoothieBowl.id, tag_id: tag.id }))
        );

      if (smoothieBowlTagsError) {
        throw smoothieBowlTagsError;
      }
    }

    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error inserting sample data:', error);
    throw error;
  }
}

export async function setupDatabase() {
  try {
    console.log('Creating tables...');
    await createTables();
    console.log('Tables created successfully');

    console.log('Inserting sample data...');
    await insertSampleData();
    console.log('Sample data inserted successfully');
  } catch (error) {
    console.error('Error setting up database:', error);
    throw error;
  }
} 
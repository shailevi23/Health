import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTables() {
  try {
    // Check authors table
    const { data: authors, error: authorsError } = await supabaseAdmin
      .from('authors')
      .select('count')
      .limit(1);

    if (authorsError) {
      console.error('Authors table error:', authorsError);
    } else {
      console.log('Authors table exists');
    }

    // Check blog_posts table
    const { data: blogPosts, error: blogPostsError } = await supabaseAdmin
      .from('blog_posts')
      .select('count')
      .limit(1);

    if (blogPostsError) {
      console.error('Blog posts table error:', blogPostsError);
    } else {
      console.log('Blog posts table exists');
    }

    // Check recipes table
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('count')
      .limit(1);

    if (recipesError) {
      console.error('Recipes table error:', recipesError);
    } else {
      console.log('Recipes table exists');
    }

    // Check affiliate_products table
    const { data: products, error: productsError } = await supabaseAdmin
      .from('affiliate_products')
      .select('count')
      .limit(1);

    if (productsError) {
      console.error('Affiliate products table error:', productsError);
    } else {
      console.log('Affiliate products table exists');
    }

    // Check tags table
    const { data: tags, error: tagsError } = await supabaseAdmin
      .from('tags')
      .select('count')
      .limit(1);

    if (tagsError) {
      console.error('Tags table error:', tagsError);
    } else {
      console.log('Tags table exists');
    }

    // Check blog_post_tags table
    const { data: blogPostTags, error: blogPostTagsError } = await supabaseAdmin
      .from('blog_post_tags')
      .select('count')
      .limit(1);

    if (blogPostTagsError) {
      console.error('Blog post tags table error:', blogPostTagsError);
    } else {
      console.log('Blog post tags table exists');
    }

    // Check recipe_tags table
    const { data: recipeTags, error: recipeTagsError } = await supabaseAdmin
      .from('recipe_tags')
      .select('count')
      .limit(1);

    if (recipeTagsError) {
      console.error('Recipe tags table error:', recipeTagsError);
    } else {
      console.log('Recipe tags table exists');
    }
  } catch (error) {
    console.error('Error checking tables:', error);
    throw error;
  }
}

checkTables(); 
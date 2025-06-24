import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updateImagePaths() {
  try {
    console.log('Starting image path updates...');

    // Update blog post image paths
    const blogUpdates = [
      { slug: 'mindful-eating', cover_image: '/images/blog/mindful-eating.jpg' },
      { slug: 'plant-based-nutrition', cover_image: '/images/blog/plant-based-nutrition.jpg' },
      { slug: 'intermittent-fasting', cover_image: '/images/blog/intermittent-fasting.jpg' },
      { slug: 'fitness-routine', cover_image: '/images/blog/fitness-routine.jpg' }
    ];

    for (const update of blogUpdates) {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update({ cover_image: update.cover_image })
        .eq('slug', update.slug);

      if (error) {
        console.error(`Error updating blog post ${update.slug}:`, error);
      } else {
        console.log(`Updated blog post ${update.slug} with image ${update.cover_image}`);
      }
    }

    // Update recipe image paths
    const recipeUpdates = [
      { slug: 'smoothie-bowl', cover_image: '/images/recipes/smoothie-bowl.jpg' },
      { slug: 'buddha-bowl', cover_image: '/images/recipes/buddha-bowl.jpg' },
      { slug: 'chickpea-salad', cover_image: '/images/recipes/chickpea-salad.jpg' },
      { slug: 'turmeric-latte', cover_image: '/images/recipes/turmeric-latte.jpg' }
    ];

    for (const update of recipeUpdates) {
      const { error } = await supabaseAdmin
        .from('recipes')
        .update({ cover_image: update.cover_image })
        .eq('slug', update.slug);

      if (error) {
        console.error(`Error updating recipe ${update.slug}:`, error);
      } else {
        console.log(`Updated recipe ${update.slug} with image ${update.cover_image}`);
      }
    }

    // Verify updates
    console.log('\nVerifying updates:');
    
    const { data: blogPosts, error: blogError } = await supabaseAdmin
      .from('blog_posts')
      .select('slug, title, cover_image');
    
    if (blogError) {
      throw blogError;
    }
    
    console.log('\nBlog Posts:');
    console.table(blogPosts);
    
    const { data: recipes, error: recipesError } = await supabaseAdmin
      .from('recipes')
      .select('slug, title, cover_image');
    
    if (recipesError) {
      throw recipesError;
    }
    
    console.log('\nRecipes:');
    console.table(recipes);
    
    console.log('\nImage path updates completed successfully');
  } catch (error) {
    console.error('Error updating image paths:', error);
  }
}

// Run the update
updateImagePaths(); 
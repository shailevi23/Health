import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function updateImagePaths() {
  try {
    const sqlFilePath = path.join(process.cwd(), 'scripts', 'update-image-paths.sql');
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sqlContent
      .split(';')
      .map(statement => statement.trim())
      .filter(statement => statement.length > 0 && !statement.startsWith('--'));
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      
      // Skip SELECT statements which are just for verification
      if (statement.toUpperCase().startsWith('SELECT')) {
        console.log(`Skipping SELECT statement ${i + 1}`);
        continue;
      }
      
      console.log(`Executing statement ${i + 1}: ${statement.substring(0, 50)}...`);
      
      const { error } = await supabaseAdmin.rpc('execute_sql', {
        sql: statement
      });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        throw error;
      }
    }
    
    // Run the verification queries
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
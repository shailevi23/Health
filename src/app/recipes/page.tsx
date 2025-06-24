import { createServerSupabaseClient } from '@/lib/supabase-server';
import RecipeList from '@/components/RecipeList';
import NewsletterSubscribe from '@/components/NewsletterSubscribe';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recipes - Health Blog',
  description: 'Discover healthy and delicious recipes',
};

async function getRecipes() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      tags:recipe_tags(tag:tag_id(*))
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }

  return data || [];
}

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="relative w-full h-[50vh] flex items-center justify-center bg-gradient-to-r from-emerald-500 to-teal-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('/images/recipes/chickpea-salad.jpg')] bg-cover bg-center opacity-40"></div>
        </div>
        <div className="container mx-auto px-6 relative z-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Healthy Recipes</h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
            Delicious, nutritious recipes for every meal
          </p>
        </div>
      </section>

      {/* Recipes Section */}
      <section className="container mx-auto px-4 py-16">
        <RecipeList recipes={recipes} />
      </section>

      {/* Tips Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Cooking Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Meal Prep Like a Pro</h3>
                <p className="text-gray-600">
                  Dedicate a few hours each weekend to prepare ingredients or full meals for the week. 
                  Store in airtight containers and enjoy stress-free healthy eating all week long.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Substitutions</h3>
                <p className="text-gray-600">
                  Learn to swap ingredients for healthier alternatives: Greek yogurt for sour cream, 
                  cauliflower rice for white rice, or natural sweeteners instead of refined sugar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-500 to-teal-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-white mb-6">Get Weekly Recipes</h2>
            <p className="text-xl text-white/90 mb-10">
              Subscribe to receive new recipes and cooking tips every week.
            </p>
            <NewsletterSubscribe 
              buttonText="Subscribe" 
              className="justify-center max-w-lg mx-auto" 
            />
          </div>
        </div>
      </section>
    </div>
  );
} 
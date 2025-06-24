import { createServerSupabaseClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Metadata } from 'next';

interface Tag {
  id: string;
  name: string;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  difficulty: string;
  ingredients: string[];
  instructions: string[];
  nutrition?: Record<string, string>;
  tags?: Array<{
    tag: Tag;
  }>;
}

interface PageProps {
  params: {
    slug: string;
  };
}

async function getRecipe(slug: string): Promise<Recipe | null> {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase
    .from('recipes')
    .select(`
      *,
      tags:recipe_tags(tag:tag_id(*))
    `)
    .eq('id', slug)
    .single();

  if (error || !data) {
    console.error('Error fetching recipe:', error);
    return null;
  }

  return data as Recipe;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const recipe = await getRecipe(params.slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found - Health Blog',
      description: 'The requested recipe could not be found.',
    };
  }

  return {
    title: `${recipe.title} - Health Blog`,
    description: recipe.description,
  };
}

export default async function RecipePage({ params }: PageProps) {
  const recipe = await getRecipe(params.slug);

  if (!recipe) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative h-[60vh] w-full">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <Image
          src={recipe.image_url}
          alt={recipe.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 z-20 flex items-center">
          <div className="container mx-auto px-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              {recipe.title}
            </h1>
            <div className="flex items-center space-x-4 text-white/90">
              <span>{recipe.cooking_time} mins</span>
              <span>•</span>
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tags */}
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {recipe.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {recipe.description}
            </p>

            {/* Ingredients */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Ingredients</h2>
              <ul className="list-disc pl-6 space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-gray-600">
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>

            {/* Instructions */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
              <ol className="list-decimal pl-6 space-y-4">
                {recipe.instructions?.map((instruction, index) => (
                  <li key={index} className="text-gray-600">
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>

            {/* Nutrition Information */}
            {recipe.nutrition && (
              <div className="mt-12 p-6 bg-gray-50 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nutrition Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(recipe.nutrition).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-semibold text-primary-600">{value}</div>
                      <div className="text-sm text-gray-500 capitalize">{key}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 
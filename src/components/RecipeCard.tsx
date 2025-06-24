import React from 'react';
import Link from 'next/link';
import { Clock, Users } from 'lucide-react';
import type { Recipe } from '@/types';
import ImageWithFallback from './ImageWithFallback';

interface RecipeCardProps {
  recipe: Recipe;
  priority?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, priority = false }) => {
  // Handle the data structure from Supabase
  const coverImage = recipe.cover_image || recipe.coverImage;
  const prepTime = recipe.prep_time || recipe.prepTime;
  const cookTime = recipe.cook_time || recipe.cookTime;
  const totalTime = `${prepTime} + ${cookTime}`;
  
  // Extract tags from the Supabase nested structure if needed
  const extractTags = () => {
    if (!recipe.tags) return [];
    
    if (Array.isArray(recipe.tags)) {
      // If tags is an array of strings
      if (recipe.tags.length === 0) return [];
      
      if (typeof recipe.tags[0] === 'string') {
        return recipe.tags as string[];
      }
      
      // If tags is an array of objects with a tag property
      return recipe.tags.map((tagObj: any) => {
        if (typeof tagObj === 'string') return tagObj;
        if (tagObj && tagObj.tag && tagObj.tag.name) return tagObj.tag.name;
        return '';
      }).filter(Boolean);
    }
    
    return [];
  };
  
  const tags = extractTags();

  // Default image if the cover image is missing
  const defaultCoverImage = '/images/recipes/chickpea-salad.jpg';

  return (
    <article className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="relative h-48 w-full">
        <ImageWithFallback
          src={coverImage || ''}
          fallbackSrc={defaultCoverImage}
          alt={recipe.title}
          fill
          className="object-cover"
          priority={priority}
        />
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-gradient-to-t from-black/60 to-transparent">
          <h3 className="text-xl font-serif font-bold text-white">
            {recipe.title}
          </h3>
        </div>
      </div>
      <div className="p-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {tags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-emerald-50 text-emerald-700 text-sm rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {recipe.description}
        </p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{totalTime}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          <Link
            href={`/recipes/${recipe.slug}`}
            className="text-emerald-600 hover:text-emerald-700 transition-colors font-medium"
          >
            View Recipe
          </Link>
        </div>
      </div>
    </article>
  );
};

export default RecipeCard; 
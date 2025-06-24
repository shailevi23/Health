'use client';

import React from 'react';
import Link from 'next/link';
import ImageWithFallback from './ImageWithFallback';

interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url: string;
  cooking_time: number;
  difficulty: string;
  tags?: Array<{
    tag: {
      id: string;
      name: string;
    };
  }>;
}

interface RecipeListProps {
  recipes: Recipe[];
}

export default function RecipeList({ recipes }: RecipeListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {recipes.map((recipe) => (
        <Link
          key={recipe.id}
          href={`/recipes/${recipe.id}`}
          className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative h-48 w-full">
            <ImageWithFallback
              src={recipe.image_url}
              alt={recipe.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              fallbackSrc="/images/recipes/buddha-bowl.jpg"
            />
          </div>
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
              {recipe.title}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {recipe.description}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{recipe.cooking_time} mins</span>
              <span className="capitalize">{recipe.difficulty}</span>
            </div>
            {recipe.tags && recipe.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {recipe.tags.map(({ tag }) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-primary-50 text-primary-700 text-xs rounded-full"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
} 
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, Users, ChefHat } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecipeCard({ recipe }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="aspect-square overflow-hidden">
        <img
          src={recipe.featured_image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=500&fit=crop"}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge 
            variant="secondary" 
            className="bg-amber-50 text-amber-700 hover:bg-amber-100 border-amber-200 text-xs font-medium"
          >
            {recipe.recipe_type}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-stone-800 mb-2 leading-snug group-hover:text-emerald-700 transition-colors duration-300">
          {recipe.title}
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-4 text-xs text-stone-500 mb-4">
          {recipe.prep_time && (
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{recipe.prep_time}</span>
            </div>
          )}
          {recipe.servings && (
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>{recipe.servings}</span>
            </div>
          )}
        </div>

        {recipe.tags && recipe.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {recipe.tags.slice(0, 3).map((tag, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <Link
          to={createPageUrl(`RecipeDetail?slug=${recipe.slug}`)}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium group-hover:gap-3 transition-all duration-300"
        >
          <ChefHat className="w-4 h-4" />
          View recipe
        </Link>
      </CardContent>
    </Card>
  );
}
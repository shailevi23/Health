
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { BlogPost, Recipe, RecommendedProduct } from "@/api/entities";
import { ArrowRight, Sparkles, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import BlogCard from "../components/BlogCard";
import RecipeCard from "../components/RecipeCard";
import AffiliateBox from "../components/AffiliateBox";

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      const [posts, recipes, products] = await Promise.all([
        BlogPost.filter({ is_featured: true }, '-created_date', 3),
        Recipe.filter({ is_featured: true }, '-created_date', 3),
        RecommendedProduct.filter({ is_featured: true }, '-created_date', 3)
      ]);
      
      setFeaturedPosts(posts);
      setFeaturedRecipes(recipes);
      setFeaturedProducts(products);
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 via-white to-stone-50 py-16 md:py-24">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwNTk2NjkiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-40"></div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full border border-emerald-200/50">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Welcome to your wellness journey</span>
            </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
            Simple Steps to a
            <span className="block text-emerald-600">Healthier You</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover practical wellness tips, nourishing recipes, and mindful lifestyle changes 
            that helped transform my health. Your journey to feeling amazing starts here.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Blog")}>
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Explore Wellness Tips
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Recipes")}>
              <Button variant="outline" className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 px-8 py-3 rounded-xl text-base font-medium">
                Browse Healthy Recipes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Blog Posts */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">Latest Insights</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Wellness Wisdom
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Practical tips and insights from my personal journey to better health and wellbeing.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-stone-100 rounded-2xl h-96 animate-pulse"></div>
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500">No featured posts yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link to={createPageUrl("Blog")}>
              <Button variant="outline" className="px-6 py-2 rounded-xl">
                View All Posts
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Recipes */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
              <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">Nourishing Food</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
              Healthy Recipes
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              Simple, delicious recipes that fuel your body and satisfy your taste buds.
            </p>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-stone-100 rounded-2xl h-80 animate-pulse"></div>
              ))}
            </div>
          ) : featuredRecipes.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-stone-500">No featured recipes yet. Check back soon!</p>
            </div>
          )}

          <div className="text-center">
            <Link to={createPageUrl("Recipes")}>
              <Button variant="outline" className="px-6 py-2 rounded-xl">
                Browse All Recipes
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended Tools */}
      {featuredProducts.length > 0 && (
        <section className="py-16 md:py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
                Tools That Helped My Journey
              </h2>
              <p className="text-stone-600">
                Handpicked products and resources that made a real difference in my wellness journey.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProducts.map((product) => (
                <AffiliateBox key={product.id} product={product} />
              ))}
            </div>

            <div className="text-center">
              <Link to={createPageUrl("Recommended")}>
                <Button variant="outline" className="px-6 py-2 rounded-xl">
                  View All Recommendations
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

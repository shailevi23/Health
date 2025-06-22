import React, { useState, useEffect } from "react";
import { RecommendedProduct } from "@/api/entities";
import { Star, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const categories = ["all", "supplements", "books", "tools", "equipment", "apps"];

export default function Recommended() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, selectedCategory]);

  const loadProducts = async () => {
    try {
      const data = await RecommendedProduct.list('-created_date');
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    if (selectedCategory === "all") {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(product => product.category === selectedCategory));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50 py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Star className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-600 font-medium text-sm tracking-wide uppercase">Personally Tested</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 mb-4">
            Recommended Tools & Resources
          </h1>
          <p className="text-stone-600 max-w-3xl mx-auto text-lg leading-relaxed">
            These are the products, books, and tools that genuinely made a difference in my wellness journey. 
            I only recommend what I personally use and believe in.
          </p>
          <p className="text-stone-500 text-sm mt-4">
            <span className="font-medium">Transparency note:</span> Some links below are affiliate links, 
            which means I may earn a small commission if you make a purchase. This helps support the site 
            at no extra cost to you.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full text-xs ${
                selectedCategory === category
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                  : "border-stone-300 text-stone-600 hover:bg-stone-50"
              }`}
            >
              {category === "all" ? "All Categories" : category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        {/* Results Count */}
        {!isLoading && (
          <div className="mb-6 text-center">
            <p className="text-stone-500 text-sm">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'recommendation' : 'recommendations'}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-stone-100 rounded-2xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-6">
                  {product.image_url && (
                    <div className="w-full h-48 rounded-xl overflow-hidden mb-4 bg-stone-100">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-3">
                    <Badge 
                      variant="secondary" 
                      className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-xs font-medium"
                    >
                      {product.category}
                    </Badge>
                    {product.price_range && (
                      <Badge variant="outline" className="text-xs">
                        {product.price_range}
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-stone-800 mb-3 leading-snug group-hover:text-emerald-700 transition-colors duration-300">
                    {product.name}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  <a
                    href={product.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white group-hover:shadow-lg transition-all duration-300">
                      <Star className="w-4 h-4 mr-2" />
                      View Product
                      <ExternalLink className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-stone-400" />
            </div>
            <h3 className="text-lg font-semibold text-stone-600 mb-2">No recommendations found</h3>
            <p className="text-stone-500 mb-4">
              Check back soon for new product recommendations!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
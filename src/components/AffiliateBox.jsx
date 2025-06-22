import React from "react";
import { ExternalLink, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function AffiliateBox({ product }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-stone-200/50 bg-gradient-to-br from-white to-stone-50/30">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          {product.image_url && (
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-stone-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold text-stone-800 text-sm leading-tight">
                {product.name}
              </h4>
              {product.price_range && (
                <Badge variant="outline" className="text-xs">
                  {product.price_range}
                </Badge>
              )}
            </div>
            
            <p className="text-stone-600 text-xs leading-relaxed mb-3 line-clamp-2">
              {product.description}
            </p>
            
            <a
              href={product.affiliate_link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button 
                size="sm" 
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3 group-hover:shadow-md transition-all duration-300"
              >
                <Star className="w-3 h-3 mr-1" />
                Learn More
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BlogCard({ post }) {
  return (
    <Card className="group hover:shadow-xl transition-all duration-500 border-0 bg-white/80 backdrop-blur-sm overflow-hidden">
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.featured_image || "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=500&fit=crop"}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <Badge 
            variant="secondary" 
            className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200 text-xs font-medium"
          >
            {post.category}
          </Badge>
          {post.read_time && (
            <div className="flex items-center gap-1 text-stone-500 text-xs">
              <Clock className="w-3 h-3" />
              <span>{post.read_time}</span>
            </div>
          )}
        </div>

        <h3 className="text-lg font-semibold text-stone-800 mb-3 leading-snug group-hover:text-emerald-700 transition-colors duration-300">
          {post.title}
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <Link
          to={createPageUrl(`BlogPost?slug=${post.slug}`)}
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 text-sm font-medium group-hover:gap-3 transition-all duration-300"
        >
          Read more
          <ArrowRight className="w-4 h-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
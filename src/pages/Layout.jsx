
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Menu, X, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home") },
  { title: "Blog", url: createPageUrl("Blog") },
  { title: "Recipes", url: createPageUrl("Recipes") },
  { title: "About", url: createPageUrl("About") },
  { title: "Recommended", url: createPageUrl("Recommended") }
];

export default function Layout({ children, currentPageName }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-stone-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to={createPageUrl("Home")} className="flex items-center gap-3 group">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-sage-500 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-stone-800 tracking-tight">Health Life</h1>
                <p className="text-xs text-stone-500 -mt-1">Wellness & Recipes</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`text-sm font-medium transition-colors duration-200 hover:text-emerald-600 ${
                    location.pathname === item.url 
                      ? 'text-emerald-600 border-b-2 border-emerald-600 pb-1' 
                      : 'text-stone-600'
                  }`}
                >
                  {item.title}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200/50 bg-white/98 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.title}
                  to={item.url}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200 ${
                    location.pathname === item.url
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-stone-600 hover:bg-stone-50'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-200 mt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-sage-500 rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold text-white">Health Life</span>
              </div>
              <p className="text-stone-400 text-sm leading-relaxed">
                Sharing practical tips and delicious recipes for a healthier, happier life. 
                Your wellness journey starts here.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                {navigationItems.slice(1).map((item) => (
                  <Link
                    key={item.title}
                    to={item.url}
                    className="block text-stone-400 hover:text-emerald-400 text-sm transition-colors duration-200"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>

            {/* Connect */}
            <div>
              <h3 className="text-white font-semibold mb-4">Connect</h3>
              <p className="text-stone-400 text-sm mb-4">
                Follow along for daily wellness inspiration and new recipes.
              </p>
              <div className="flex items-center gap-1 text-stone-400 text-sm">
                <Heart className="w-4 h-4 text-emerald-400" />
                <span>Made with love for your wellness journey</span>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-800 mt-12 pt-8 text-center">
            <p className="text-stone-400 text-sm">
              © 2024 Health Life App. All rights reserved. 
              <span className="mx-2">•</span>
              Affiliate links help support this site.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

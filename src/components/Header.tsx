'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, Heart, Leaf } from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  type: 'blog' | 'recipe';
  slug: string;
}

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Implement actual search functionality
      const results: SearchResult[] = [
        { id: '1', title: 'Healthy Breakfast Ideas', type: 'blog', slug: 'healthy-breakfast' },
        { id: '2', title: 'Green Smoothie Recipe', type: 'recipe', slug: 'green-smoothie' },
      ];
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/blog', label: 'Blog' },
    { href: '/recipes', label: 'Recipes' },
    { href: '/tools', label: 'Tools' },
    { href: '/about', label: 'About' },
    { href: '/newsletter', label: 'Newsletter' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-md shadow-md'
          : 'bg-black/20 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">
              <Leaf className={`w-8 h-8 ${isScrolled ? 'text-primary-600' : 'text-white'}`} />
            </span>
            <span className={`text-2xl font-display font-bold ${
              isScrolled 
                ? 'bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent'
                : 'text-white'
            }`}>
              Health Blog
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  pathname === link.href
                    ? isScrolled
                      ? 'bg-primary-50 text-primary-600'
                      : 'bg-white/20 text-white'
                    : isScrolled
                      ? 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                      : 'text-white hover:bg-white/20'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search and CTA */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-lg transition-colors ${
                  isScrolled
                    ? 'hover:bg-gray-100 text-gray-600'
                    : 'hover:bg-white/10 text-white'
                }`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Search Popup */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg py-2 px-3">
                  <div className="relative">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search articles and recipes..."
                      className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>

                  {/* Search Results */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 divide-y divide-gray-100">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={`/${result.type}/${result.slug}`}
                          className="block px-4 py-2 hover:bg-gray-50 rounded-lg"
                        >
                          <span className="text-sm text-gray-600">{result.type}</span>
                          <p className="font-medium text-gray-900">{result.title}</p>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* No Results */}
                  {searchQuery.length >= 2 && !isSearching && searchResults.length === 0 && (
                    <p className="px-4 py-2 text-sm text-gray-500">
                      No results found for "{searchQuery}"
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Subscribe Button */}
            <Link 
              href="/newsletter" 
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                isScrolled
                  ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700'
                  : 'bg-white text-primary-600 hover:bg-white/90'
              }`}
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled
                ? 'hover:bg-gray-100 text-gray-600'
                : 'hover:bg-white/10 text-white'
            }`}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {/* Mobile Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search articles and recipes..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            </div>

            {/* Mobile Navigation */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-2 rounded-lg font-medium transition-colors ${
                  pathname === link.href
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Mobile Subscribe Button */}
            <div className="pt-2">
              <Link
                href="/newsletter"
                className="block w-full px-4 py-3 text-center font-semibold rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white hover:from-primary-600 hover:to-primary-700"
              >
                Subscribe to Newsletter
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 
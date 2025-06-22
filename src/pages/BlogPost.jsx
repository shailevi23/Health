import React, { useState, useEffect, useRef } from "react";
import { BlogPost } from "@/api/entities";
import { ArrowLeft, Clock, Tag, Calendar, Play, Pause, StopCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import AdBanner from "../components/AdBanner";

export default function BlogPostPage() {
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const utteranceRef = useRef(null);

  useEffect(() => {
    loadPost();
    return () => {
      if (speechSynthesis && speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const loadPost = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const slug = urlParams.get('slug');
      
      if (!slug) {
        setError('Post not found: No slug provided');
        setIsLoading(false);
        return;
      }

      const allPosts = await BlogPost.list();
      const foundPost = allPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
      } else {
        setError('Post not found');
      }
    } catch (err) {
      console.error('Error loading post:', err);
      setError('Failed to load post');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubscribe = () => {
    setIsSubscribed(true);
    setTimeout(() => {
      alert("Thank you for subscribing! You'll receive weekly wellness tips and recipes.");
    }, 500);
  };

  const handleStopSpeak = () => {
    if (speechSynthesis && speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setIsPaused(false);
    utteranceRef.current = null;
  };

  const handleToggleSpeak = () => {
    if (!('speechSynthesis' in window)) {
      alert("Sorry, your browser doesn't support text-to-speech.");
      return;
    }

    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
      setIsPaused(true);
    } else if (isSpeaking && isPaused) {
      speechSynthesis.resume();
      setIsPaused(false);
    } else {
      const cleanContent = post.content.replace(/<[^>]*>?/gm, '').replace(/\*\*/g, '').replace(/\n/g, ' ');
      const textToSpeak = `${post.title}. ${post.excerpt}. ${cleanContent}`;
      
      const maxLength = 32000;
      const finalText = textToSpeak.length > maxLength ? textToSpeak.substring(0, maxLength) + "..." : textToSpeak;
      
      utteranceRef.current = new SpeechSynthesisUtterance(finalText);
      
      utteranceRef.current.rate = 0.9;
      utteranceRef.current.pitch = 1;
      utteranceRef.current.volume = 1;

      utteranceRef.current.onstart = () => {
        setIsSpeaking(true);
        setIsPaused(false);
      };
      
      utteranceRef.current.onend = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
      };

      utteranceRef.current.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        setIsPaused(false);
        utteranceRef.current = null;
        alert('Sorry, there was an issue with the text-to-speech feature. Please try again.');
      };

      utteranceRef.current.onpause = () => {
        setIsPaused(true);
      };

      utteranceRef.current.onresume = () => {
        setIsPaused(false);
      };
      
      speechSynthesis.cancel();
      
      setTimeout(() => {
        if (utteranceRef.current) {
          speechSynthesis.speak(utteranceRef.current);
        }
      }, 100);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-stone-200 rounded-lg mb-8 w-1/3"></div>
            <div className="h-64 bg-stone-200 rounded-2xl mb-8"></div>
            <div className="h-12 bg-stone-200 rounded-lg mb-4"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-4 bg-stone-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-stone-800 mb-4">Post Not Found</h1>
          <p className="text-stone-600 mb-8">The blog post you're looking for doesn't exist.</p>
          <Link to={createPageUrl("Blog")}>
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-b from-stone-50 to-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to={createPageUrl("Blog")}>
            <Button variant="ghost" className="mb-6 -ml-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <div className="flex items-center gap-4 mb-6 text-sm text-stone-500">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(post.created_date), "MMM d, yyyy")}</span>
            </div>
            {post.read_time && (
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{post.read_time}</span>
              </div>
            )}
            <Badge 
              variant="secondary" 
              className="bg-emerald-50 text-emerald-700 border-emerald-200"
            >
              {post.category}
            </Badge>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-stone-800 mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <Button 
              onClick={handleToggleSpeak} 
              className="bg-emerald-600 hover:bg-emerald-700 transition-all duration-200"
              disabled={!post}
            >
              {isSpeaking && !isPaused ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Audio
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  {isPaused ? 'Resume Audio' : 'Listen to Article'}
                </>
              )}
            </Button>
            
            {isSpeaking && (
              <Button 
                onClick={handleStopSpeak} 
                variant="outline"
                className="transition-all duration-200"
              >
                <StopCircle className="w-4 h-4 mr-2" />
                Stop
              </Button>
            )}

            {isSpeaking && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-lg text-sm text-emerald-700">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {isPaused ? 'Audio Paused' : 'Playing Audio'}
              </div>
            )}
          </div>
        </div>
      </div>

      {post.featured_image && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <div className="aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3">
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-stone-700 leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: post.content.replace(/\n/g, '<br />') 
                }}
              />
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-stone-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-4 h-4 text-stone-500" />
                  <span className="text-sm font-medium text-stone-600">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <Badge 
                      key={index}
                      variant="outline" 
                      className="text-stone-600 border-stone-300"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              <AdBanner />
              
              <div className="bg-gradient-to-br from-emerald-50 to-white p-6 rounded-2xl border border-emerald-100">
                <h3 className="font-semibold text-stone-800 mb-3">More Wellness Tips</h3>
                <p className="text-sm text-stone-600 mb-4 leading-relaxed">
                  Get weekly wellness tips and healthy recipes delivered to your inbox.
                </p>
                <Button 
                  size="sm" 
                  className={`w-full transition-all duration-200 ${
                    isSubscribed 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                  onClick={handleSubscribe}
                  disabled={isSubscribed}
                >
                  {isSubscribed ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Subscribed!
                    </>
                  ) : (
                    'Subscribe'
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
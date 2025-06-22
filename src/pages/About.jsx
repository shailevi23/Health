import React from "react";
import { Heart, Sparkles, Target, Coffee } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-stone-50">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-emerald-50 via-white to-stone-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-stone-800 mb-6">
              Hi, I'm here to help you thrive
            </h1>
            
            <p className="text-lg md:text-xl text-stone-600 leading-relaxed">
              Welcome to my corner of the internet where I share the practical wellness tips, 
              mindful habits, and nourishing recipes that completely transformed my health and happiness.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-lg border border-stone-200/50">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-6 flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-emerald-600" />
                My Wellness Journey
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed">
                <p>
                  Just a few years ago, I was struggling with low energy, poor sleep, and constant stress. 
                  Like many people, I thought feeling tired and overwhelmed was just part of adult life. 
                  I was wrong.
                </p>
                
                <p>
                  Everything changed when I started making small, intentional changes to how I ate, moved, 
                  and thought about my daily habits. It wasn't about dramatic transformations or extreme 
                  restrictions—it was about finding what actually worked for my body and lifestyle.
                </p>
                
                <p>
                  Today, I wake up with energy, sleep deeply, and feel genuinely excited about my days. 
                  The recipes I share here are the ones that fuel my body without sacrificing flavor. 
                  The tips I write about are the practices that made the biggest difference in my life.
                </p>
                
                <p>
                  This isn't about perfection—it's about progress. It's about finding your own path to 
                  feeling amazing in your body and mind. I'm honored to be part of your journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
              What Guides This Space
            </h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
              The principles that shape everything I share here
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 border-0 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">Practical & Realistic</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Everything I share is tested in real life. No impossible standards or 
                  unrealistic expectations—just what actually works.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">Body-Positive</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Health comes in all shapes and sizes. This is about feeling good, 
                  not fitting into someone else's idea of perfect.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-8 border-0 bg-white/70 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Coffee className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-3">Sustainable</h3>
                <p className="text-stone-600 text-sm leading-relaxed">
                  Quick fixes don't work. Everything here is designed to become 
                  a natural, enjoyable part of your everyday life.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-16 md:py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-emerald-50 to-white rounded-2xl p-8 md:p-12 border border-emerald-100">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-4">
              Let's Connect
            </h2>
            <p className="text-stone-600 mb-6 leading-relaxed">
              I love hearing about your wellness journey and the little wins along the way. 
              Your story matters, and I'm cheering you on every step of the way.
            </p>
            <p className="text-stone-500 text-sm">
              Feel free to reach out through social media or by leaving comments on the posts 
              that resonate with you. I read every single message.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
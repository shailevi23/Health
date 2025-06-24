import { createServerSupabaseClient } from '@/lib/supabase-server';
import Image from 'next/image';
import { Metadata } from 'next';

interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url: string;
  social_links?: {
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
}

async function getTeamMembers(): Promise<Author[]> {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('authors')
    .select('*');

  if (error) {
    console.error('Error fetching team members:', error);
    return [];
  }

  return data as Author[];
}

export const metadata: Metadata = {
  title: 'About Us - Health Blog',
  description: 'Meet our team of health and wellness experts dedicated to bringing you the best content and advice.',
};

export default async function AboutPage() {
  const teamMembers = await getTeamMembers();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary-50 to-white py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              About Our Health Blog
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              We're passionate about helping you live your healthiest, most vibrant life through evidence-based nutrition, mindful living, and sustainable wellness practices.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              At Health Blog, we believe that true wellness comes from a holistic approach to health. Our mission is to provide you with reliable, science-backed information and practical advice that you can trust and implement in your daily life.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you're just starting your wellness journey or looking to deepen your knowledge, we're here to support and guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {teamMembers.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src={member.image_url}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {member.name}
                  </h3>
                  <p className="text-primary-600 font-medium mb-4">
                    {member.role}
                  </p>
                  <p className="text-gray-600 mb-6">
                    {member.bio}
                  </p>
                  {member.social_links && (
                    <div className="flex space-x-4">
                      {member.social_links.twitter && (
                        <a
                          href={member.social_links.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          Twitter
                        </a>
                      )}
                      {member.social_links.linkedin && (
                        <a
                          href={member.social_links.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          LinkedIn
                        </a>
                      )}
                      {member.social_links.instagram && (
                        <a
                          href={member.social_links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-primary-600 transition-colors"
                        >
                          Instagram
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Our Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Evidence-Based Content
              </h3>
              <p className="text-gray-600">
                We ensure all our articles and advice are backed by scientific research and expert knowledge.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Holistic Approach
              </h3>
              <p className="text-gray-600">
                We believe in addressing health and wellness from all angles - physical, mental, and emotional.
              </p>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Inclusive Community
              </h3>
              <p className="text-gray-600">
                We create content that's accessible and relevant to people at all stages of their wellness journey.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 
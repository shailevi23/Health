export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
          author_id: string;
          slug: string;
          excerpt: string;
          cover_image: string;
        };
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['posts']['Insert']>;
      };
      recipes: {
        Row: {
          id: string;
          title: string;
          content: string;
          featured: boolean;
          created_at: string;
          updated_at: string;
          author_id: string;
          slug: string;
          excerpt: string;
          cover_image: string;
          prep_time: number;
          cook_time: number;
          servings: number;
          difficulty: 'easy' | 'medium' | 'hard';
        };
        Insert: Omit<Database['public']['Tables']['recipes']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['recipes']['Insert']>;
      };
      newsletter_subscribers: {
        Row: {
          id: string;
          email: string;
          confirmed: boolean;
          subscribed_at: string;
          updated_at: string;
          unsubscribed_at: string | null;
          preferences: {
            articles: boolean;
            recipes: boolean;
            recommendations: boolean;
          };
        };
        Insert: Omit<Database['public']['Tables']['newsletter_subscribers']['Row'], 'id' | 'subscribed_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['newsletter_subscribers']['Insert']>;
      };
    };
  };
} 
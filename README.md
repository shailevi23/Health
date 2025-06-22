# Health/Life App

A comprehensive health and lifestyle tracking application built with React and Supabase.

## Features

- **User Authentication**: Secure login/signup with email and Google OAuth
- **Health Tracking**: Monitor weight, blood pressure, heart rate, BMI, and more
- **Activity Logging**: Track exercise sessions, steps, and workouts
- **Nutrition Management**: Log meals and track calorie intake
- **Sleep Monitoring**: Record sleep duration and quality
- **Goal Setting**: Set and track health and fitness goals
- **Medication Management**: Schedule and track medications
- **Appointment Tracking**: Manage medical appointments
- **Mood Tracking**: Monitor mental health and mood patterns
- **Real-time Updates**: Live data synchronization
- **File Storage**: Secure storage for photos and documents
- **Analytics**: Comprehensive health insights and trends

## Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage, Real-time)
- **UI Components**: Radix UI, Shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form with Zod validation
- **Charts**: Recharts for data visualization

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd health-life-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url_here
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

4. **Set up Supabase database**
   - Go to your Supabase project dashboard
   - Navigate to the SQL Editor
   - Run the complete database schema from `docs/database-schema.sql`

5. **Create storage buckets**
   ```sql
   INSERT INTO storage.buckets (id, name, public) VALUES 
   ('avatars', 'avatars', true),
   ('progress-photos', 'progress-photos', false),
   ('medical-documents', 'medical-documents', false);
   ```

6. **Start the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   └── ui/             # Shadcn/ui components
├── hooks/              # Custom React hooks
│   └── useAuth.jsx     # Authentication hook
├── lib/                # Utility libraries
│   ├── supabase/       # Supabase configuration
│   │   ├── client.js   # Supabase client
│   │   ├── auth.js     # Authentication service
│   │   └── storage.js  # File storage service
│   └── services/       # API services
│       └── health-metrics.js  # Health data service
├── pages/              # Application pages
└── utils/              # Utility functions

docs/
├── database-schema.sql     # Complete database schema
├── supabase-integration.md # Supabase setup guide
└── monitoring.md          # Monitoring documentation
```

## Core Services

### Authentication
- Email/password authentication
- Google OAuth integration
- Password reset functionality
- User profile management
- Session management

### Health Data Management
- Comprehensive health metrics tracking
- Activity logging and analysis
- Nutrition and meal tracking
- Sleep data monitoring
- Goal setting and progress tracking

### Real-time Features
- Live data synchronization
- Real-time notifications
- Collaborative features

### File Storage
- Profile picture uploads
- Progress photo storage
- Medical document management
- Secure file access

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Data Validation**: Comprehensive input validation
- **Authentication Guards**: Protected routes and components
- **Secure File Storage**: Encrypted file storage with access controls

## API Documentation

### Health Metrics
```javascript
import { createHealthMetric, getHealthMetrics } from '@/lib/services/health-metrics'

// Create a new health metric
const metric = await createHealthMetric({
  user_id: userId,
  metric_type: 'weight',
  value: 70.5,
  unit: 'kg'
})

// Get user's health metrics
const metrics = await getHealthMetrics(userId, {
  metric_type: 'weight',
  start_date: '2024-01-01'
})
```

### Authentication
```javascript
import { useAuth } from '@/hooks/useAuth'

function MyComponent() {
  const { user, signIn, signOut, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>
  
  return <div>Welcome, {user.email}!</div>
}
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- ESLint configuration for code quality
- Consistent code formatting
- Type safety with JSDoc comments
- Comprehensive error handling

## Deployment

### Environment Setup
1. Set up environment variables in production
2. Run database migrations
3. Configure storage buckets
4. Set up monitoring and error tracking

### Build and Deploy
```bash
npm run build
# Deploy the dist/ folder to your hosting provider
```

## Documentation

- [Supabase Integration Guide](docs/supabase-integration.md) - Complete setup and usage guide
- [Database Schema](docs/database-schema.sql) - Complete database structure
- [Monitoring Documentation](docs/monitoring.md) - Monitoring and analytics setup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

For support and questions:
- Check the documentation in the `docs/` folder
- Review the Supabase integration guide
- Contact the development team

## License

This project is licensed under the MIT License.

## Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Shadcn/ui](https://ui.shadcn.com) for the UI components
- [Radix UI](https://www.radix-ui.com) for accessible components
- [Tailwind CSS](https://tailwindcss.com) for styling
# Supabase Integration for Health/Life App

This document provides comprehensive information about the Supabase backend integration for the Health/Life application.

## Overview

The Health/Life app now includes a complete Supabase backend with:
- User authentication and authorization
- Comprehensive health data management
- Real-time features
- File storage capabilities
- Advanced analytics and insights

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Supabase      │    │   Database      │
│   (React)       │◄──►│   (Backend)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Auth Hook     │    │   Storage       │    │   RLS Policies  │
│   (useAuth)     │    │   (Files)       │    │   (Security)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Setup Instructions

### 1. Environment Configuration

Create a `.env` file in your project root with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### 2. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the complete database schema from `docs/database-schema.sql`
4. This will create all tables, functions, and security policies

### 3. Storage Buckets

Create the following storage buckets in your Supabase project:

```sql
-- Create storage buckets for different file types
INSERT INTO storage.buckets (id, name, public) VALUES 
('avatars', 'avatars', true),
('progress-photos', 'progress-photos', false),
('medical-documents', 'medical-documents', false);
```

## Core Features

### Authentication

The app includes comprehensive authentication with:

- Email/password authentication
- Google OAuth integration
- Password reset functionality
- User profile management
- Session management

```jsx
import { useAuth } from '@/hooks/useAuth'

function LoginComponent() {
  const { signIn, signInWithGoogle, loading, error } = useAuth()
  
  const handleEmailLogin = async (email, password) => {
    const result = await signIn(email, password)
    if (result.success) {
      // Redirect to dashboard
    }
  }
  
  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle()
    if (result.success) {
      // Redirect to dashboard
    }
  }
}
```

### Health Data Management

Comprehensive health data tracking including:

- **Health Metrics**: Weight, blood pressure, heart rate, BMI, etc.
- **Activities**: Exercise sessions, steps, workouts
- **Nutrition**: Meal tracking, calorie counting
- **Sleep Data**: Sleep duration, quality, patterns
- **Goals**: Health and fitness goals with progress tracking
- **Medications**: Medication schedules and reminders
- **Appointments**: Medical appointments and reminders
- **Mood Tracking**: Daily mood and mental health tracking
- **Vital Signs**: Blood pressure, glucose levels, etc.

```jsx
import { createHealthMetric, getHealthMetrics } from '@/lib/services/health-metrics'

// Create a new health metric
const newMetric = await createHealthMetric({
  user_id: userId,
  metric_type: 'weight',
  value: 70.5,
  unit: 'kg',
  notes: 'Morning weight'
})

// Get user's health metrics
const metrics = await getHealthMetrics(userId, {
  metric_type: 'weight',
  start_date: '2024-01-01',
  end_date: '2024-01-31'
})
```

### Real-time Features

Real-time subscriptions for live data updates:

```jsx
import { subscribeToHealthMetrics } from '@/lib/services/health-metrics'

// Subscribe to real-time health metric changes
const subscription = subscribeToHealthMetrics(userId, (payload) => {
  console.log('Health metric changed:', payload)
  // Update UI with new data
})

// Unsubscribe when component unmounts
return () => subscription.unsubscribe()
```

### File Storage

Secure file storage for:

- Profile pictures
- Progress photos
- Medical documents
- Data exports

```jsx
import { uploadProfilePicture, getProfilePictureUrl } from '@/lib/supabase/storage'

// Upload profile picture
const result = await uploadProfilePicture(userId, file)

// Get profile picture URL
const profileUrl = getProfilePictureUrl(userId)
```

## Database Schema

### Core Tables

1. **user_profiles** - Extended user information
2. **health_metrics** - All health measurements
3. **activities** - Exercise and physical activities
4. **nutrition** - Meal and food tracking
5. **sleep_data** - Sleep tracking
6. **goals** - Health and fitness goals
7. **medications** - Medication management
8. **appointments** - Medical appointments
9. **mood_tracking** - Mental health tracking
10. **vital_signs** - Medical vital signs

### Supporting Tables

1. **food_database** - Comprehensive food nutrition database
2. **exercise_types** - Pre-defined exercise categories
3. **achievements** - Gamification badges and milestones
4. **user_preferences** - App settings and preferences

## Security Features

### Row Level Security (RLS)

All tables have RLS policies ensuring users can only access their own data:

```sql
-- Example RLS policy
CREATE POLICY "Users can view own health metrics" 
ON health_metrics FOR SELECT 
USING (auth.uid() = user_id);
```

### Data Validation

Comprehensive data validation with:

- Check constraints for data ranges
- Enum types for categorical data
- Required field validation
- Data type validation

### Authentication Guards

Protected routes and components:

```jsx
import { withAuth } from '@/hooks/useAuth'

// Protect a component
const ProtectedComponent = withAuth(MyComponent)

// Or use the hook directly
function MyComponent() {
  const { user, loading } = useAuth()
  
  if (loading) return <div>Loading...</div>
  if (!user) return <div>Please sign in</div>
  
  return <div>Protected content</div>
}
```

## API Services

### Health Metrics Service

```jsx
import * as healthService from '@/lib/services/health-metrics'

// Create metric
await healthService.createHealthMetric(data)

// Get metrics with filters
await healthService.getHealthMetrics(userId, {
  metric_type: 'weight',
  start_date: '2024-01-01',
  limit: 10
})

// Get trends
await healthService.getHealthMetricsTrends(userId, 'weight', 30)

// Calculate BMI
const bmi = healthService.calculateBMI(70, 175)
```

### Authentication Service

```jsx
import * as authService from '@/lib/supabase/auth'

// Sign up
await authService.signUp(email, password, userData)

// Sign in
await authService.signIn(email, password)

// Sign out
await authService.signOut()

// Reset password
await authService.resetPassword(email)
```

### Storage Service

```jsx
import * as storageService from '@/lib/supabase/storage'

// Upload file
await storageService.uploadFile(bucket, path, file)

// Get public URL
const url = storageService.getPublicUrl(bucket, path)

// Upload profile picture
await storageService.uploadProfilePicture(userId, file)
```

## Performance Optimization

### Indexing

Strategic database indexes for optimal query performance:

```sql
-- Example indexes
CREATE INDEX idx_health_metrics_user_id ON health_metrics(user_id);
CREATE INDEX idx_health_metrics_type_date ON health_metrics(metric_type, recorded_at);
```

### Caching

Implement caching strategies for frequently accessed data:

```jsx
// Cache user profile data
const [profile, setProfile] = useState(null)

useEffect(() => {
  if (user && !profile) {
    // Fetch and cache profile data
    fetchUserProfile(user.id).then(setProfile)
  }
}, [user, profile])
```

### Pagination

Handle large datasets with pagination:

```jsx
const getPaginatedMetrics = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit
  return await getHealthMetrics(userId, { limit, offset })
}
```

## Error Handling

Comprehensive error handling throughout the application:

```jsx
try {
  const result = await createHealthMetric(data)
  if (result.error) {
    // Handle specific error
    console.error('Error creating metric:', result.error)
  }
} catch (error) {
  // Handle unexpected errors
  console.error('Unexpected error:', error)
}
```

## Testing

### Unit Tests

Test individual functions and components:

```jsx
// Test BMI calculation
test('calculateBMI should return correct BMI', () => {
  const bmi = calculateBMI(70, 175)
  expect(bmi).toBe('22.9')
})
```

### Integration Tests

Test API integration:

```jsx
// Test health metrics API
test('should create health metric', async () => {
  const metric = await createHealthMetric(testData)
  expect(metric.data).toBeDefined()
  expect(metric.error).toBeNull()
})
```

## Deployment

### Environment Variables

Ensure all environment variables are set in production:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Database Migration

Run database migrations in production:

1. Connect to your Supabase project
2. Execute the schema SQL
3. Verify all tables and policies are created

### Storage Configuration

Configure storage buckets and policies:

1. Create required buckets
2. Set appropriate access policies
3. Test file upload/download functionality

## Monitoring and Analytics

### Error Tracking

Implement error tracking for production:

```jsx
// Log errors to external service
const logError = (error, context) => {
  console.error('Error:', error, 'Context:', context)
  // Send to error tracking service
}
```

### Performance Monitoring

Monitor database and API performance:

```jsx
// Track API response times
const trackPerformance = async (operation, fn) => {
  const start = performance.now()
  const result = await fn()
  const duration = performance.now() - start
  
  console.log(`${operation} took ${duration}ms`)
  return result
}
```

## Best Practices

### Security

1. Always use RLS policies
2. Validate input data
3. Use parameterized queries
4. Implement proper error handling
5. Keep secrets secure

### Performance

1. Use appropriate indexes
2. Implement pagination
3. Cache frequently accessed data
4. Optimize queries
5. Monitor performance

### Code Quality

1. Use TypeScript for type safety
2. Implement comprehensive error handling
3. Write unit and integration tests
4. Follow consistent naming conventions
5. Document complex functions

## Troubleshooting

### Common Issues

1. **Authentication errors**: Check environment variables
2. **RLS policy violations**: Verify user permissions
3. **Storage upload failures**: Check bucket permissions
4. **Real-time connection issues**: Verify subscription setup

### Debug Tools

1. Supabase Dashboard for database inspection
2. Browser DevTools for network requests
3. Console logging for debugging
4. Supabase CLI for local development

## Support

For issues and questions:

1. Check the Supabase documentation
2. Review error logs
3. Test with minimal reproduction
4. Contact the development team

## Future Enhancements

Planned features for future releases:

1. Advanced analytics dashboard
2. Machine learning insights
3. Integration with wearable devices
4. Social features and sharing
5. Advanced reporting capabilities
6. Mobile app development
7. API rate limiting
8. Advanced caching strategies 
/**
 * Database types for Supabase tables
 * These types define the structure of our health/life app database
 */

// User Profile (extends Supabase auth.users)
export const UserProfile = {
  id: 'uuid', // References auth.users(id)
  full_name: 'text',
  date_of_birth: 'date',
  gender: 'text', // 'male', 'female', 'other'
  height_cm: 'integer',
  weight_kg: 'numeric',
  activity_level: 'text', // 'sedentary', 'lightly_active', 'moderately_active', 'very_active'
  health_conditions: 'text[]',
  emergency_contact: 'jsonb',
  created_at: 'timestamp with time zone',
  updated_at: 'timestamp with time zone'
}

// Health Metrics
export const HealthMetrics = {
  id: 'uuid',
  user_id: 'uuid', // References user_profiles(id)
  metric_type: 'text', // 'weight', 'blood_pressure', 'heart_rate', 'bmi', 'body_fat', etc.
  value: 'numeric',
  unit: 'text',
  notes: 'text',
  recorded_at: 'timestamp with time zone',
  created_at: 'timestamp with time zone'
}

// Activities/Exercise
export const Activities = {
  id: 'uuid',
  user_id: 'uuid',
  activity_type: 'text', // 'running', 'walking', 'cycling', 'swimming', 'gym', etc.
  duration_minutes: 'integer',
  calories_burned: 'integer',
  distance_km: 'numeric',
  steps: 'integer',
  heart_rate_avg: 'integer',
  heart_rate_max: 'integer',
  notes: 'text',
  activity_date: 'date',
  created_at: 'timestamp with time zone'
}

// Nutrition/Meals
export const Nutrition = {
  id: 'uuid',
  user_id: 'uuid',
  meal_type: 'text', // 'breakfast', 'lunch', 'dinner', 'snack'
  food_items: 'jsonb', // Array of food items with nutrition info
  total_calories: 'integer',
  total_protein: 'numeric',
  total_carbs: 'numeric',
  total_fat: 'numeric',
  total_fiber: 'numeric',
  meal_date: 'date',
  notes: 'text',
  created_at: 'timestamp with time zone'
}

// Sleep Data
export const SleepData = {
  id: 'uuid',
  user_id: 'uuid',
  sleep_duration_hours: 'numeric',
  sleep_quality: 'integer', // 1-10 scale
  bedtime: 'time',
  wake_time: 'time',
  sleep_date: 'date',
  deep_sleep_percentage: 'numeric',
  rem_sleep_percentage: 'numeric',
  notes: 'text',
  created_at: 'timestamp with time zone'
}

// Goals
export const Goals = {
  id: 'uuid',
  user_id: 'uuid',
  goal_type: 'text', // 'weight_loss', 'muscle_gain', 'endurance', 'strength', etc.
  title: 'text',
  description: 'text',
  target_value: 'numeric',
  current_value: 'numeric',
  unit: 'text',
  target_date: 'date',
  status: 'text', // 'active', 'completed', 'paused', 'cancelled'
  progress_percentage: 'numeric',
  created_at: 'timestamp with time zone',
  updated_at: 'timestamp with time zone'
}

// Medications
export const Medications = {
  id: 'uuid',
  user_id: 'uuid',
  medication_name: 'text',
  dosage: 'text',
  frequency: 'text', // 'daily', 'twice_daily', 'weekly', etc.
  time_of_day: 'time[]',
  start_date: 'date',
  end_date: 'date',
  is_active: 'boolean',
  notes: 'text',
  created_at: 'timestamp with time zone',
  updated_at: 'timestamp with time zone'
}

// Appointments
export const Appointments = {
  id: 'uuid',
  user_id: 'uuid',
  appointment_type: 'text', // 'doctor', 'dentist', 'specialist', 'checkup', etc.
  title: 'text',
  description: 'text',
  appointment_date: 'timestamp with time zone',
  duration_minutes: 'integer',
  location: 'text',
  provider_name: 'text',
  provider_contact: 'text',
  reminder_minutes: 'integer',
  status: 'text', // 'scheduled', 'completed', 'cancelled', 'rescheduled'
  notes: 'text',
  created_at: 'timestamp with time zone',
  updated_at: 'timestamp with time zone'
}

// Mood Tracking
export const MoodTracking = {
  id: 'uuid',
  user_id: 'uuid',
  mood_score: 'integer', // 1-10 scale
  mood_description: 'text',
  energy_level: 'integer', // 1-10 scale
  stress_level: 'integer', // 1-10 scale
  activities: 'text[]', // Activities that affected mood
  notes: 'text',
  tracking_date: 'date',
  created_at: 'timestamp with time zone'
}

// Vital Signs
export const VitalSigns = {
  id: 'uuid',
  user_id: 'uuid',
  vital_type: 'text', // 'blood_pressure', 'heart_rate', 'temperature', 'glucose', etc.
  systolic: 'integer', // For blood pressure
  diastolic: 'integer', // For blood pressure
  value: 'numeric', // For other vitals
  unit: 'text',
  notes: 'text',
  recorded_at: 'timestamp with time zone',
  created_at: 'timestamp with time zone'
}

// Food Database
export const FoodDatabase = {
  id: 'uuid',
  food_name: 'text',
  brand: 'text',
  serving_size: 'text',
  calories_per_serving: 'integer',
  protein_g: 'numeric',
  carbs_g: 'numeric',
  fat_g: 'numeric',
  fiber_g: 'numeric',
  sugar_g: 'numeric',
  sodium_mg: 'integer',
  category: 'text', // 'fruits', 'vegetables', 'proteins', 'grains', etc.
  is_verified: 'boolean',
  created_at: 'timestamp with time zone'
}

// Exercise Types
export const ExerciseTypes = {
  id: 'uuid',
  exercise_name: 'text',
  category: 'text', // 'cardio', 'strength', 'flexibility', 'balance', etc.
  muscle_groups: 'text[]',
  equipment_needed: 'text[]',
  difficulty_level: 'text', // 'beginner', 'intermediate', 'advanced'
  calories_per_hour: 'integer',
  description: 'text',
  instructions: 'text',
  created_at: 'timestamp with time zone'
}

// Achievements
export const Achievements = {
  id: 'uuid',
  user_id: 'uuid',
  achievement_type: 'text', // 'streak', 'milestone', 'goal_completion', etc.
  title: 'text',
  description: 'text',
  icon_url: 'text',
  earned_at: 'timestamp with time zone',
  metadata: 'jsonb', // Additional data about the achievement
  created_at: 'timestamp with time zone'
}

// User Preferences
export const UserPreferences = {
  id: 'uuid',
  user_id: 'uuid',
  theme: 'text', // 'light', 'dark', 'auto'
  language: 'text',
  timezone: 'text',
  measurement_unit: 'text', // 'metric', 'imperial'
  notification_settings: 'jsonb',
  privacy_settings: 'jsonb',
  created_at: 'timestamp with time zone',
  updated_at: 'timestamp with time zone'
}

// Export all types
export const DatabaseTypes = {
  UserProfile,
  HealthMetrics,
  Activities,
  Nutrition,
  SleepData,
  Goals,
  Medications,
  Appointments,
  MoodTracking,
  VitalSigns,
  FoodDatabase,
  ExerciseTypes,
  Achievements,
  UserPreferences
} 
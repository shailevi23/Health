import { supabase } from '../supabase/client.js'

/**
 * Health Metrics Service
 * Handles all health-related data operations including metrics, calculations, and analytics
 */

// Create a new health metric
export const createHealthMetric = async (metricData) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert([{
        user_id: metricData.user_id,
        metric_type: metricData.metric_type,
        value: metricData.value,
        unit: metricData.unit,
        notes: metricData.notes,
        recorded_at: metricData.recorded_at || new Date().toISOString()
      }])
      .select()
    
    if (error) throw error
    
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Create health metric error:', error)
    return { data: null, error }
  }
}

// Get health metrics for a user
export const getHealthMetrics = async (userId, options = {}) => {
  try {
    let query = supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
    
    // Apply filters
    if (options.metric_type) {
      query = query.eq('metric_type', options.metric_type)
    }
    
    if (options.start_date) {
      query = query.gte('recorded_at', options.start_date)
    }
    
    if (options.end_date) {
      query = query.lte('recorded_at', options.end_date)
    }
    
    if (options.limit) {
      query = query.limit(options.limit)
    }
    
    const { data, error } = await query
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Get health metrics error:', error)
    return { data: null, error }
  }
}

// Get a specific health metric by ID
export const getHealthMetricById = async (metricId) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('id', metricId)
      .single()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Get health metric by ID error:', error)
    return { data: null, error }
  }
}

// Update a health metric
export const updateHealthMetric = async (metricId, updates) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', metricId)
      .select()
    
    if (error) throw error
    
    return { data: data[0], error: null }
  } catch (error) {
    console.error('Update health metric error:', error)
    return { data: null, error }
  }
}

// Delete a health metric
export const deleteHealthMetric = async (metricId) => {
  try {
    const { error } = await supabase
      .from('health_metrics')
      .delete()
      .eq('id', metricId)
    
    if (error) throw error
    
    return { error: null }
  } catch (error) {
    console.error('Delete health metric error:', error)
    return { error }
  }
}

// Get latest health metric by type
export const getLatestHealthMetric = async (userId, metricType) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .order('recorded_at', { ascending: false })
      .limit(1)
      .single()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Get latest health metric error:', error)
    return { data: null, error }
  }
}

// Calculate BMI
export const calculateBMI = (weightKg, heightCm) => {
  if (!weightKg || !heightCm) return null
  const heightM = heightCm / 100
  return (weightKg / (heightM * heightM)).toFixed(1)
}

// Get BMI category
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal weight'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}

// Get health metrics trends
export const getHealthMetricsTrends = async (userId, metricType, days = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .eq('metric_type', metricType)
      .gte('recorded_at', startDate.toISOString())
      .order('recorded_at', { ascending: true })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Get health metrics trends error:', error)
    return { data: null, error }
  }
}

// Get health metrics summary
export const getHealthMetricsSummary = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
    
    if (error) throw error
    
    // Group by metric type and get latest values
    const summary = {}
    data.forEach(metric => {
      if (!summary[metric.metric_type]) {
        summary[metric.metric_type] = {
          latest: metric,
          count: 0,
          min: null,
          max: null,
          avg: 0
        }
      }
      
      summary[metric.metric_type].count++
      
      if (!summary[metric.metric_type].min || metric.value < summary[metric.metric_type].min) {
        summary[metric.metric_type].min = metric.value
      }
      
      if (!summary[metric.metric_type].max || metric.value > summary[metric.metric_type].max) {
        summary[metric.metric_type].max = metric.value
      }
      
      summary[metric.metric_type].avg += metric.value
    })
    
    // Calculate averages
    Object.keys(summary).forEach(type => {
      summary[type].avg = (summary[type].avg / summary[type].count).toFixed(2)
    })
    
    return { data: summary, error: null }
  } catch (error) {
    console.error('Get health metrics summary error:', error)
    return { data: null, error }
  }
}

// Batch insert health metrics
export const batchInsertHealthMetrics = async (metrics) => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .insert(metrics)
      .select()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Batch insert health metrics error:', error)
    return { data: null, error }
  }
}

// Get health metrics for dashboard
export const getDashboardMetrics = async (userId) => {
  try {
    // Get latest metrics for common health indicators
    const metricTypes = ['weight', 'blood_pressure', 'heart_rate', 'steps', 'sleep_hours']
    const dashboardData = {}
    
    for (const metricType of metricTypes) {
      const { data } = await getLatestHealthMetric(userId, metricType)
      if (data) {
        dashboardData[metricType] = data
      }
    }
    
    // Get trends for the last 7 days
    const { data: trends } = await getHealthMetricsTrends(userId, 'weight', 7)
    dashboardData.trends = trends || []
    
    return { data: dashboardData, error: null }
  } catch (error) {
    console.error('Get dashboard metrics error:', error)
    return { data: null, error }
  }
}

// Export health data
export const exportHealthData = async (userId, format = 'json') => {
  try {
    const { data, error } = await supabase
      .from('health_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
    
    if (error) throw error
    
    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(data)
      return { data: csv, error: null }
    }
    
    return { data, error: null }
  } catch (error) {
    console.error('Export health data error:', error)
    return { data: null, error }
  }
}

// Helper function to convert data to CSV
const convertToCSV = (data) => {
  if (!data || data.length === 0) return ''
  
  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      return typeof value === 'string' ? `"${value}"` : value
    })
    csvRows.push(values.join(','))
  })
  
  return csvRows.join('\n')
}

// Real-time subscription for health metrics
export const subscribeToHealthMetrics = (userId, callback) => {
  return supabase
    .channel('health_metrics_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'health_metrics',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export default {
  createHealthMetric,
  getHealthMetrics,
  getHealthMetricById,
  updateHealthMetric,
  deleteHealthMetric,
  getLatestHealthMetric,
  calculateBMI,
  getBMICategory,
  getHealthMetricsTrends,
  getHealthMetricsSummary,
  batchInsertHealthMetrics,
  getDashboardMetrics,
  exportHealthData,
  subscribeToHealthMetrics
} 
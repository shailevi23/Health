import { supabase } from './client.js'

/**
 * Storage service for Supabase
 * Handles file uploads, downloads, and management
 */

// Upload a file to a specific bucket and path
export const uploadFile = async (bucket, path, file, options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        ...options
      })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('File upload error:', error)
    return { data: null, error }
  }
}

// Download a file from storage
export const downloadFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .download(path)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('File download error:', error)
    return { data: null, error }
  }
}

// Get a public URL for a file
export const getPublicUrl = (bucket, path) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  
  return data.publicUrl
}

// Get a signed URL for a file (for private files)
export const getSignedUrl = async (bucket, path, expiresIn = 3600) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Signed URL error:', error)
    return { data: null, error }
  }
}

// List files in a bucket or folder
export const listFiles = async (bucket, path = '', options = {}) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(path, options)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('List files error:', error)
    return { data: null, error }
  }
}

// Delete a file from storage
export const deleteFile = async (bucket, path) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .remove([path])
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('File deletion error:', error)
    return { data: null, error }
  }
}

// Move/rename a file
export const moveFile = async (bucket, fromPath, toPath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .move(fromPath, toPath)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('File move error:', error)
    return { data: null, error }
  }
}

// Copy a file
export const copyFile = async (bucket, fromPath, toPath) => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .copy(fromPath, toPath)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('File copy error:', error)
    return { data: null, error }
  }
}

// Upload profile picture
export const uploadProfilePicture = async (userId, file) => {
  const path = `profiles/${userId}/avatar.${file.name.split('.').pop()}`
  return uploadFile('avatars', path, file, { upsert: true })
}

// Upload progress photo
export const uploadProgressPhoto = async (userId, file, date) => {
  const path = `progress/${userId}/${date}/${file.name}`
  return uploadFile('progress-photos', path, file)
}

// Upload medical document
export const uploadMedicalDocument = async (userId, file, documentType) => {
  const path = `medical/${userId}/${documentType}/${file.name}`
  return uploadFile('medical-documents', path, file)
}

// Get profile picture URL
export const getProfilePictureUrl = (userId, filename = 'avatar.jpg') => {
  return getPublicUrl('avatars', `profiles/${userId}/${filename}`)
}

// Get progress photo URL
export const getProgressPhotoUrl = (userId, date, filename) => {
  return getPublicUrl('progress-photos', `progress/${userId}/${date}/${filename}`)
}

// Get medical document URL
export const getMedicalDocumentUrl = (userId, documentType, filename) => {
  return getPublicUrl('medical-documents', `medical/${userId}/${documentType}/${filename}`)
}

// Create bucket if it doesn't exist (admin function)
export const createBucket = async (bucketName, options = {}) => {
  try {
    const { data, error } = await supabase.storage.createBucket(bucketName, {
      public: false,
      allowedMimeTypes: ['image/*', 'application/pdf', 'text/*'],
      fileSizeLimit: 52428800, // 50MB
      ...options
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Create bucket error:', error)
    return { data: null, error }
  }
}

// Delete bucket (admin function)
export const deleteBucket = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage.deleteBucket(bucketName)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Delete bucket error:', error)
    return { data: null, error }
  }
}

// Get bucket info
export const getBucketInfo = async (bucketName) => {
  try {
    const { data, error } = await supabase.storage.getBucket(bucketName)
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Get bucket info error:', error)
    return { data: null, error }
  }
}

// List all buckets
export const listBuckets = async () => {
  try {
    const { data, error } = await supabase.storage.listBuckets()
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('List buckets error:', error)
    return { data: null, error }
  }
}

export default {
  uploadFile,
  downloadFile,
  getPublicUrl,
  getSignedUrl,
  listFiles,
  deleteFile,
  moveFile,
  copyFile,
  uploadProfilePicture,
  uploadProgressPhoto,
  uploadMedicalDocument,
  getProfilePictureUrl,
  getProgressPhotoUrl,
  getMedicalDocumentUrl,
  createBucket,
  deleteBucket,
  getBucketInfo,
  listBuckets
} 
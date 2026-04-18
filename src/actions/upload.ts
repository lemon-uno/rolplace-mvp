'use server'

import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_IMAGES = 20

export interface UploadImageResult {
  success: boolean
  url?: string
  error?: string
}

/**
 * Upload multiple images to Supabase Storage
 * @param formData - FormData with files under 'images' key
 * @returns Array of results with URLs or errors
 */
export async function uploadImages(formData: FormData): Promise<UploadImageResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  // Get files from FormData
  const files = formData.getAll('images') as File[]

  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  if (files.length > MAX_IMAGES) {
    throw new Error(`Maximum ${MAX_IMAGES} images allowed`)
  }

  const results: UploadImageResult[] = []

  for (const file of files) {
    // Validate file
    if (!file || file.size === 0) {
      results.push({ success: false, error: 'Invalid file' })
      continue
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      results.push({ success: false, error: 'File too large (max 10MB)' })
      continue
    }

    // Check MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      results.push({ success: false, error: 'Invalid file type (only JPEG, PNG, WebP, GIF)' })
      continue
    }

    try {
      // Generate unique filename: userId/timestamp-randomString.ext
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${timestamp}-${randomString}.${fileExt}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('car-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        results.push({ success: false, error: uploadError.message })
        continue
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName)

      results.push({
        success: true,
        url: urlData.publicUrl
      })

    } catch (error) {
      console.error('Upload processing error:', error)
      results.push({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  return results
}

/**
 * Delete image from Supabase Storage
 * @param url - Public URL of the image to delete
 */
export async function deleteImage(url: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  try {
    // Extract filename from URL
    // URL format: https://supabase.com/storage/v1/object/public/bucket-name/filename
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const bucketIndex = pathParts.indexOf('car-images')

    if (bucketIndex === -1 || bucketIndex === pathParts.length - 1) {
      throw new Error('Invalid URL format')
    }

    const fileName = pathParts.slice(bucketIndex + 1).join('/')

    // Verify user owns this image (filename starts with user.id)
    if (!fileName.startsWith(`${user.id}/`)) {
      throw new Error('Not authorized to delete this image')
    }

    const { error } = await supabase.storage
      .from('car-images')
      .remove([fileName])

    if (error) {
      throw error
    }

    return { success: true }

  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}

'use server'

import { createClient } from '@/lib/supabase/server'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export interface UploadImageResult {
  success: boolean
  url?: string
  error?: string
}

export async function uploadSingleImage(formData: FormData): Promise<UploadImageResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const file = formData.get('image') as File | null

  if (!file || file.size === 0) {
    return { success: false, error: 'Invalid file' }
  }

  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: 'File too large (max 10MB)' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { success: false, error: 'Invalid file type' }
  }

  try {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${timestamp}-${randomString}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('car-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return { success: false, error: uploadError.message }
    }

    const { data: urlData } = supabase.storage
      .from('car-images')
      .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
  } catch (error) {
    console.error('Upload processing error:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

/**
 * Upload multiple images to Supabase Storage (legacy batch method)
 */
export async function uploadImages(formData: FormData): Promise<UploadImageResult[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const files = formData.getAll('images') as File[]

  if (!files || files.length === 0) {
    throw new Error('No files provided')
  }

  const results: UploadImageResult[] = []

  for (const file of files) {
    if (!file || file.size === 0) {
      results.push({ success: false, error: 'Invalid file' })
      continue
    }

    if (file.size > MAX_FILE_SIZE) {
      results.push({ success: false, error: 'File too large (max 10MB)' })
      continue
    }

    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      results.push({ success: false, error: 'Invalid file type (only JPEG, PNG, WebP, GIF)' })
      continue
    }

    try {
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/${timestamp}-${randomString}.${fileExt}`

      const { error: uploadError } = await supabase.storage
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

      const { data: urlData } = supabase.storage
        .from('car-images')
        .getPublicUrl(fileName)

      results.push({ success: true, url: urlData.publicUrl })
    } catch (error) {
      console.error('Upload processing error:', error)
      results.push({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
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

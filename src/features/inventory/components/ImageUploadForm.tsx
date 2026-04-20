'use client'

import { useState } from 'react'
import { ImageUpload } from './ImageUpload'

interface ImageUploadFormProps {
  name: string
  maxImages?: number
  initialImages?: string[]
  onImagesChange?: (images: string[]) => void
}

export function ImageUploadForm({ name, maxImages = 20, initialImages, onImagesChange }: ImageUploadFormProps) {
  const [images, setImages] = useState<string[]>(initialImages || [])

  const handleChange = (newImages: string[]) => {
    setImages(newImages)
    onImagesChange?.(newImages)
  }

  return (
    <>
      <ImageUpload
        value={images}
        onChange={handleChange}
        maxImages={maxImages}
      />
      <input
        type="hidden"
        name={name}
        value={JSON.stringify(images)}
      />
    </>
  )
}

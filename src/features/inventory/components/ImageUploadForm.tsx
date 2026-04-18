'use client'

import { useState } from 'react'
import { ImageUpload } from './ImageUpload'

interface ImageUploadFormProps {
  name: string
  maxImages?: number
}

export function ImageUploadForm({ name, maxImages = 20 }: ImageUploadFormProps) {
  const [images, setImages] = useState<string[]>([])

  return (
    <>
      <ImageUpload
        value={images}
        onChange={setImages}
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

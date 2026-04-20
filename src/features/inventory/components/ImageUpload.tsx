'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadSingleImage } from '@/actions/upload'
import { X, GripVertical } from 'lucide-react'

interface ImageUploadProps {
  value: string[]
  onChange: (urls: string[]) => void
  maxImages?: number
  disabled?: boolean
}

export function ImageUpload({
  value = [],
  onChange,
  maxImages = 20,
  disabled = false
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>(value)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')
  const [dragActive, setDragActive] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropIndex, setDropIndex] = useState<number | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const updatePreviews = useCallback((newPreviews: string[]) => {
    setPreviews(newPreviews)
    onChange(newPreviews)
  }, [onChange])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (disabled) return
    if (previews.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    setUploading(true)
    const successfulUrls: string[] = []
    let errorCount = 0
    const total = files.length

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      setUploadProgress(`${i + 1} de ${total}`)

      const formData = new FormData()
      formData.append('image', file)

      try {
        const result = await uploadSingleImage(formData)
        if (result.success && result.url) {
          successfulUrls.push(result.url)
        } else {
          errorCount++
          console.error('Upload error:', result.error)
        }
      } catch {
        errorCount++
      }
    }

    if (successfulUrls.length > 0) {
      updatePreviews([...previews, ...successfulUrls])
    }

    if (errorCount > 0) {
      alert(`${errorCount} de ${total} imágenes fallaron al subir.`)
    }

    setUploading(false)
    setUploadProgress('')
  }, [previews, maxImages, disabled, updatePreviews])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (disabled) return
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [disabled])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }, [disabled, handleFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleFiles(e.target.files)
    e.target.value = ''
  }, [handleFiles])

  const handleRemove = useCallback((index: number) => {
    if (disabled) return
    updatePreviews(previews.filter((_, i) => i !== index))
  }, [previews, disabled, updatePreviews])

  // Drag-and-drop reordering
  const handleItemDragStart = (index: number) => {
    setDragIndex(index)
  }

  const handleItemDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (dragIndex === null || dragIndex === index) return
    setDropIndex(index)
  }

  const handleItemDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    e.stopPropagation()
    if (dragIndex === null || dragIndex === index) {
      setDragIndex(null)
      setDropIndex(null)
      return
    }
    const newPreviews = [...previews]
    const [moved] = newPreviews.splice(dragIndex, 1)
    newPreviews.splice(index, 0, moved)
    updatePreviews(newPreviews)
    setDragIndex(null)
    setDropIndex(null)
  }

  const handleItemDragEnd = () => {
    setDragIndex(null)
    setDropIndex(null)
  }

  return (
    <div className="space-y-4">
      {previews.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          } ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && !uploading && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="hidden"
            disabled={disabled || uploading}
          />
          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {uploading ? `Subiendo ${uploadProgress}...` : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {previews.length} de {maxImages} imágenes (máx. 10MB cada una)
            </p>
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              draggable={!disabled}
              onDragStart={() => handleItemDragStart(index)}
              onDragOver={(e) => handleItemDragOver(e, index)}
              onDrop={(e) => handleItemDrop(e, index)}
              onDragEnd={handleItemDragEnd}
              className={`relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border-2 transition-all ${
                dragIndex === index
                  ? 'border-cyan-400 opacity-50 scale-95'
                  : dropIndex === index
                  ? 'border-cyan-400'
                  : 'border-gray-200 dark:border-gray-700'
              } ${!disabled ? 'cursor-grab active:cursor-grabbing' : ''}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
              </div>

              {/* Remove button */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(index)
                  }}
                  disabled={disabled}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Eliminar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {index === 0 && (
                <div className="absolute top-2 right-2 px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded">
                  Portada
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <input
        type="hidden"
        name="images"
        value={JSON.stringify(previews)}
      />
    </div>
  )
}

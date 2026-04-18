'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { uploadImages, type UploadImageResult } from '@/actions/upload'

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
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>(value)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    if (disabled) return
    if (previews.length + files.length > maxImages) {
      alert(`Máximo ${maxImages} imágenes permitidas`)
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      const results = await uploadImages(formData)

      // Filter successful uploads
      const successfulUrls = results
        .filter(r => r.success && r.url)
        .map(r => r.url!)

      if (successfulUrls.length > 0) {
        const newPreviews = [...previews, ...successfulUrls]
        setPreviews(newPreviews)
        onChange(newPreviews)
      }

      // Check for errors
      const errors = results.filter(r => !r.success)
      if (errors.length > 0) {
        console.error('Upload errors:', errors)
        alert(`${errors.length} imágenes fallaron. Verifica la consola para detalles.`)
      }

    } catch (error) {
      console.error('Upload error:', error)
      alert('Error al subir imágenes. Intenta de nuevo.')
    } finally {
      setUploading(false)
    }
  }, [previews, maxImages, disabled, onChange])

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

    const files = e.dataTransfer.files
    handleFiles(files)
  }, [disabled, handleFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const files = e.target.files
    handleFiles(files)
  }, [handleFiles])

  const handleRemove = useCallback((index: number) => {
    if (disabled) return
    const newPreviews = previews.filter((_, i) => i !== index)
    setPreviews(newPreviews)
    onChange(newPreviews)
  }, [previews, disabled, onChange])

  const handleMoveUp = useCallback((index: number) => {
    if (disabled || index === 0) return
    const newPreviews = [...previews]
    ;[newPreviews[index - 1], newPreviews[index]] = [newPreviews[index], newPreviews[index - 1]]
    setPreviews(newPreviews)
    onChange(newPreviews)
  }, [previews, disabled, onChange])

  const handleMoveDown = useCallback((index: number) => {
    if (disabled || index === previews.length - 1) return
    const newPreviews = [...previews]
    ;[newPreviews[index], newPreviews[index + 1]] = [newPreviews[index + 1], newPreviews[index]]
    setPreviews(newPreviews)
    onChange(newPreviews)
  }, [previews, disabled, onChange])

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      {previews.length < maxImages && (
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950'
              : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !disabled && inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleChange}
            className="hidden"
            disabled={disabled}
          />

          <div className="space-y-2">
            <div className="text-4xl">📸</div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {uploading ? 'Subiendo imágenes...' : 'Arrastra imágenes aquí o haz clic para seleccionar'}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {previews.length} de {maxImages} imágenes (máx. 10MB cada una)
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Formatos: JPEG, PNG, WebP, GIF
            </p>
          </div>
        </div>
      )}

      {/* Image Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((url, index) => (
            <div
              key={index}
              className="relative group aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <Image
                src={url}
                alt={`Imagen ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />

              {/* Overlay with controls */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleMoveUp(index)}
                  disabled={disabled || index === 0}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover arriba"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleMoveDown(index)}
                  disabled={disabled || index === previews.length - 1}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Mover abajo"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  disabled={disabled}
                  className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Eliminar"
                >
                  ✕
                </button>
              </div>

              {/* Badge for first image */}
              {index === 0 && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-cyan-500 text-white text-xs font-bold rounded">
                  Portada
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Hidden input for form submission */}
      <input
        type="hidden"
        name="images"
        value={JSON.stringify(previews)}
      />
    </div>
  )
}

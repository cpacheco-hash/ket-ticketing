'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { imagesSchema, type ImagesInput } from '@/lib/validations/create-event'
import { ChevronRight, ChevronLeft, Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'

interface ImagesStepProps {
  data: Partial<ImagesInput>
  onUpdate: (data: Partial<ImagesInput>) => void
  onNext: () => void
  onBack: () => void
}

export function ImagesStep({ data, onUpdate, onNext, onBack }: ImagesStepProps) {
  const [images, setImages] = useState<string[]>(data.images || [])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  const {
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ImagesInput>({
    resolver: zodResolver(imagesSchema),
    defaultValues: {
      images: data.images || [],
    },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    setUploadError(null)

    try {
      // For now, we'll use a placeholder URL
      // In production, you would upload to a service like Cloudinary, S3, etc.
      const newImages: string[] = []

      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate file type
        if (!file.type.startsWith('image/')) {
          setUploadError('Solo se permiten archivos de imagen')
          continue
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setUploadError('Las imágenes deben ser menores a 5MB')
          continue
        }

        // Create a local object URL for preview
        const objectUrl = URL.createObjectURL(file)
        newImages.push(objectUrl)

        // TODO: Upload to actual storage service
        // const formData = new FormData()
        // formData.append('file', file)
        // const response = await fetch('/api/upload', {
        //   method: 'POST',
        //   body: formData,
        // })
        // const data = await response.json()
        // newImages.push(data.url)
      }

      const updatedImages = [...images, ...newImages]
      setImages(updatedImages)
      setValue('images', updatedImages)
    } catch (error) {
      console.error('Error uploading images:', error)
      setUploadError('Error al subir las imágenes')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index)
    setImages(updatedImages)
    setValue('images', updatedImages)
  }

  const onSubmit = () => {
    onUpdate({ images })
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-black mb-2">Imágenes del Evento</h2>
        <p className="text-gray-400">
          Sube imágenes atractivas para promocionar tu evento
        </p>
      </div>

      {/* Upload Area */}
      <div className="space-y-4">
        <label
          htmlFor="image-upload"
          className={`
            relative block w-full p-12 border-2 border-dashed rounded-lg
            text-center cursor-pointer transition-all
            ${isUploading
              ? 'border-gray-700 bg-gray-900 cursor-not-allowed'
              : 'border-gray-700 bg-gray-900 hover:border-cyan-500 hover:bg-gray-800'
            }
          `}
        >
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            disabled={isUploading}
            className="sr-only"
          />

          <div className="space-y-3">
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
              ) : (
                <Upload className="h-8 w-8 text-gray-400" />
              )}
            </div>

            <div>
              <p className="text-white font-medium">
                {isUploading ? 'Subiendo imágenes...' : 'Haz click para subir imágenes'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                o arrastra y suelta archivos aquí
              </p>
            </div>

            <p className="text-xs text-gray-500">
              PNG, JPG, WEBP hasta 5MB • Mínimo 1 imagen requerida
            </p>
          </div>
        </label>

        {uploadError && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400">{uploadError}</p>
          </div>
        )}

        {errors.images && (
          <p className="text-sm text-red-500">{errors.images.message}</p>
        )}
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            Imágenes subidas ({images.length})
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((imageUrl, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 group"
              >
                <Image
                  src={imageUrl}
                  alt={`Evento imagen ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Primary Badge */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 px-2 py-1 bg-cyan-500 text-black text-xs font-bold rounded">
                    Principal
                  </div>
                )}

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="
                    absolute top-2 right-2 w-8 h-8 rounded-full
                    bg-black/70 hover:bg-red-500
                    flex items-center justify-center
                    opacity-0 group-hover:opacity-100
                    transition-all duration-200
                  "
                >
                  <X className="h-4 w-4 text-white" />
                </button>

                {/* Image Number */}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm text-gray-500">
            La primera imagen será la imagen principal del evento. Arrastra para reordenar.
          </p>
        </div>
      )}

      {/* Tips */}
      <div className="p-4 bg-gray-900 border border-gray-800 rounded-lg">
        <h4 className="font-bold text-white mb-3 flex items-center gap-2">
          <ImageIcon className="h-4 w-4 text-cyan-500" />
          Consejos para mejores imágenes
        </h4>
        <ul className="space-y-2 text-sm text-gray-400">
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Usa imágenes de alta calidad con buena iluminación</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>La primera imagen debe ser la más atractiva (será la portada)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Incluye fotos del artista, el venue, eventos anteriores</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Formato recomendado: 16:9 o 4:5 para mejor visualización</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-0.5">•</span>
            <span>Evita imágenes con texto superpuesto o marcas de agua</span>
          </li>
        </ul>
      </div>

      {/* Placeholder Note */}
      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
        <p className="text-sm text-yellow-400">
          <strong>Nota de desarrollo:</strong> El sistema de upload de imágenes está en modo de demostración.
          En producción, las imágenes se subirán a un servicio de almacenamiento en la nube (Cloudinary, AWS S3, etc.).
          Por ahora, se generan URLs temporales para preview.
        </p>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-6 border-t border-gray-800">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={onBack}
          className="border-gray-700 text-gray-300 hover:bg-gray-800"
        >
          <ChevronLeft className="mr-2 h-5 w-5" />
          Anterior
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={images.length === 0}
          className="bg-white text-black hover:bg-gray-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar
          <ChevronRight className="ml-2 h-5 w-5" />
        </Button>
      </div>
    </form>
  )
}

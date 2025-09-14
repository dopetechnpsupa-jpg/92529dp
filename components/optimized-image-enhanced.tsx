"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  onError?: () => void
  fallback?: string
  loading?: 'lazy' | 'eager'
  decoding?: 'async' | 'sync' | 'auto'
}

export function OptimizedImageEnhanced({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  fallback = '/placeholder-product.svg',
  loading = 'lazy',
  decoding = 'async'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || !imgRef.current) return

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observerRef.current?.disconnect()
        }
      },
      {
        rootMargin: '50px',
        threshold: 0.1
      }
    )

    observerRef.current.observe(imgRef.current)

    return () => {
      observerRef.current?.disconnect()
    }
  }, [priority])

  // Preload critical images
  useEffect(() => {
    if (priority && typeof window !== 'undefined') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = src
      document.head.appendChild(link)
    }
  }, [src, priority])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
    onLoad?.()
  }, [onLoad])

  const handleError = useCallback(() => {
    setHasError(true)
    onError?.()
  }, [onError])

  // Generate optimized src with quality and format
  const getOptimizedSrc = useCallback((originalSrc: string) => {
    if (typeof window === 'undefined') return originalSrc
    
    // For production, you might want to use a CDN or image optimization service
    // For now, return the original src
    return originalSrc
  }, [])

  const optimizedSrc = getOptimizedSrc(hasError ? fallback : src)

  return (
    <div 
      ref={imgRef}
      className={cn(
        "relative overflow-hidden",
        className
      )}
      style={{ width, height }}
    >
      {/* Blur placeholder */}
      {placeholder === 'blur' && blurDataURL && !isLoaded && (
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-sm scale-110"
          style={{ backgroundImage: `url(${blurDataURL})` }}
        />
      )}

      {/* Loading skeleton */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading={priority ? 'eager' : loading}
          decoding={decoding}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            "w-full h-full object-cover"
          )}
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined
          }}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <div className="w-8 h-8 mx-auto mb-2">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
              </svg>
            </div>
            <p className="text-xs">Image unavailable</p>
          </div>
        </div>
      )}
    </div>
  )
}

// Hook for image preloading
export function useImagePreload(srcs: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

  const preloadImage = useCallback((src: string) => {
    if (loadedImages.has(src) || loadingImages.has(src)) return

    setLoadingImages(prev => new Set(prev).add(src))
    
    const img = new Image()
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(src))
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(src)
        return newSet
      })
    }
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(src)
        return newSet
      })
    }
    img.src = src
  }, [loadedImages, loadingImages])

  useEffect(() => {
    srcs.forEach(preloadImage)
  }, [srcs, preloadImage])

  return {
    loadedImages,
    loadingImages,
    isImageLoaded: (src: string) => loadedImages.has(src),
    isImageLoading: (src: string) => loadingImages.has(src)
  }
}

// Progressive image loading component
export function ProgressiveImage({
  src,
  alt,
  className,
  ...props
}: OptimizedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('')
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Start with a low-quality placeholder
    setCurrentSrc(src)
  }, [src])

  return (
    <OptimizedImageEnhanced
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onLoad={() => setIsLoaded(true)}
    />
  )
}

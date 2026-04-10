import { type CSSProperties, type ImgHTMLAttributes, useEffect, useState } from 'react'

const loadedImageSources = new Set<string>()
const imageLoadPromises = new Map<string, Promise<void>>()

type StableImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'style'> & {
  containerStyle?: CSSProperties
  style?: CSSProperties
  placeholderStyle?: CSSProperties
}

export function hasLoadedImage(src: string) {
  return !!src && loadedImageSources.has(src)
}

export function markImageLoaded(src: string) {
  if (!src) {
    return
  }

  loadedImageSources.add(src)
}

export function preloadImage(src: string, fetchPriority: 'high' | 'low' | 'auto' = 'auto') {
  if (!src) {
    return Promise.resolve()
  }

  if (loadedImageSources.has(src)) {
    return Promise.resolve()
  }

  const existingPromise = imageLoadPromises.get(src)
  if (existingPromise) {
    return existingPromise
  }

  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.fetchPriority = fetchPriority

    const finalize = async () => {
      try {
        if (typeof image.decode === 'function') {
          await image.decode()
        }
      } catch {
        // Some browsers reject decode() for already-decoded or cross-context images.
      }

      loadedImageSources.add(src)
      imageLoadPromises.delete(src)
      resolve()
    }

    image.onload = () => {
      void finalize()
    }

    image.onerror = () => {
      imageLoadPromises.delete(src)
      reject(new Error(`Unable to preload image: ${src}`))
    }

    image.src = src

    if (image.complete && image.naturalWidth > 0) {
      void finalize()
    }
  })

  imageLoadPromises.set(src, promise)
  return promise
}

export default function StableImage({
  src = '',
  alt,
  containerStyle,
  style,
  placeholderStyle,
  loading,
  fetchPriority = 'auto',
  decoding = 'async',
  onLoad,
  onError,
  ...props
}: StableImageProps) {
  const [isReady, setIsReady] = useState(() => hasLoadedImage(src))

  useEffect(() => {
    setIsReady(hasLoadedImage(src))

    if (!src) {
      return
    }

    if (loading !== 'eager' && fetchPriority !== 'high') {
      return
    }

    let active = true

    preloadImage(src, fetchPriority)
      .then(() => {
        if (active) {
          setIsReady(true)
        }
      })
      .catch(() => {
        if (active) {
          setIsReady(true)
        }
      })

    return () => {
      active = false
    }
  }, [fetchPriority, loading, src])

  const handleLoad: ImgHTMLAttributes<HTMLImageElement>['onLoad'] = (event) => {
    markImageLoaded(src)
    setIsReady(true)
    onLoad?.(event)
  }

  const handleError: ImgHTMLAttributes<HTMLImageElement>['onError'] = (event) => {
    setIsReady(true)
    onError?.(event)
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        ...containerStyle,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 50% 22%, rgba(255,255,255,0.14), transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02) 36%, rgba(6,6,6,0.38) 100%), #111111',
          opacity: isReady ? 0 : 1,
          transition: 'opacity 220ms ease',
          pointerEvents: 'none',
          ...placeholderStyle,
        }}
      />

      <img
        {...props}
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding={decoding}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          display: 'block',
          width: '100%',
          opacity: isReady ? 1 : 0,
          transition: 'opacity 260ms ease',
          willChange: 'opacity',
          ...style,
        }}
      />
    </div>
  )
}

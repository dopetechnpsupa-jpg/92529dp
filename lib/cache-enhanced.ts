// Enhanced caching system for maximum performance

interface CacheItem<T> {
  data: T
  timestamp: number
  ttl: number
  hits: number
  lastAccessed: number
}

interface CacheOptions {
  maxSize?: number
  defaultTTL?: number
  cleanupInterval?: number
}

export class EnhancedCache<T> {
  private cache = new Map<string, CacheItem<T>>()
  private maxSize: number
  private defaultTTL: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(options: CacheOptions = {}) {
    this.maxSize = options.maxSize || 100
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000 // 5 minutes
    
    if (options.cleanupInterval !== 0) {
      this.startCleanup(options.cleanupInterval || 60000) // 1 minute
    }
  }

  set(key: string, data: T, ttl?: number): void {
    const now = Date.now()
    const itemTTL = ttl || this.defaultTTL

    // Remove oldest items if cache is full
    if (this.cache.size >= this.maxSize) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      ttl: itemTTL,
      hits: 0,
      lastAccessed: now
    })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    const now = Date.now()
    
    // Check if item has expired
    if (now - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    // Update access statistics
    item.hits++
    item.lastAccessed = now

    return item.data
  }

  has(key: string): boolean {
    return this.get(key) !== null
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }

  keys(): string[] {
    return Array.from(this.cache.keys())
  }

  getStats(): { size: number; hits: number; hitRate: number } {
    let totalHits = 0
    this.cache.forEach(item => {
      totalHits += item.hits
    })

    return {
      size: this.cache.size,
      hits: totalHits,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0
    }
  }

  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    this.cache.forEach((item, key) => {
      if (item.lastAccessed < oldestTime) {
        oldestTime = item.lastAccessed
        oldestKey = key
      }
    })

    if (oldestKey) {
      this.cache.delete(oldestKey)
    }
  }

  private startCleanup(interval: number): void {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now()
      const keysToDelete: string[] = []

      this.cache.forEach((item, key) => {
        if (now - item.timestamp > item.ttl) {
          keysToDelete.push(key)
        }
      })

      keysToDelete.forEach(key => this.cache.delete(key))
    }, interval)
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
    }
    this.clear()
  }
}

// Memory-based cache with LRU eviction
export class LRUCache<T> {
  private cache = new Map<string, T>()
  private maxSize: number

  constructor(maxSize: number = 50) {
    this.maxSize = maxSize
  }

  get(key: string): T | undefined {
    const value = this.cache.get(key)
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key)
      this.cache.set(key, value)
    }
    return value
  }

  set(key: string, value: T): void {
    if (this.cache.has(key)) {
      // Update existing key
      this.cache.delete(key)
    } else if (this.cache.size >= this.maxSize) {
    // Remove least recently used (first item)
    const firstKey = this.cache.keys().next().value
    if (firstKey) {
      this.cache.delete(firstKey)
    }
    }
    this.cache.set(key, value)
  }

  has(key: string): boolean {
    return this.cache.has(key)
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Cache for API responses
export class APICache {
  private cache = new EnhancedCache<any>({
    maxSize: 200,
    defaultTTL: 10 * 60 * 1000, // 10 minutes
    cleanupInterval: 60000 // 1 minute
  })

  async get<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(key)
    if (cached !== null) {
      return cached
    }

    const data = await fetcher()
    this.cache.set(key, data)
    return data
  }

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, data, ttl)
  }

  invalidate(pattern?: string): void {
    if (pattern) {
      const keys = this.cache.keys()
      keys.forEach(key => {
        if (key.includes(pattern)) {
          this.cache.delete(key)
        }
      })
    } else {
      this.cache.clear()
    }
  }

  getStats() {
    return this.cache.getStats()
  }
}

// Cache for images
export class ImageCache {
  private cache = new LRUCache<string>(100)
  private loadedImages = new Set<string>()

  async preload(src: string): Promise<void> {
    if (this.loadedImages.has(src)) return

    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this.loadedImages.add(src)
        this.cache.set(src, src)
        resolve()
      }
      img.onerror = reject
      img.src = src
    })
  }

  isLoaded(src: string): boolean {
    return this.loadedImages.has(src)
  }

  get(src: string): string | undefined {
    return this.cache.get(src)
  }

  clear(): void {
    this.cache.clear()
    this.loadedImages.clear()
  }
}

// Global cache instances
export const apiCache = new APICache()
export const imageCache = new ImageCache()

// Cache utilities
export function createCacheKey(prefix: string, ...parts: (string | number)[]): string {
  return `${prefix}:${parts.join(':')}`
}

export function getCacheKeyFromURL(url: string, params?: Record<string, any>): string {
  const urlObj = new URL(url)
  const searchParams = new URLSearchParams(urlObj.search)
  
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, String(value))
    })
  }
  
  return `${urlObj.pathname}?${searchParams.toString()}`
}

// Cache warming utilities
export async function warmCache<T>(
  keys: string[],
  fetcher: (key: string) => Promise<T>,
  concurrency = 3
): Promise<void> {
  const chunks = []
  for (let i = 0; i < keys.length; i += concurrency) {
    chunks.push(keys.slice(i, i + concurrency))
  }

  for (const chunk of chunks) {
    await Promise.all(
      chunk.map(async (key) => {
        try {
          const data = await fetcher(key)
          apiCache.set(key, data)
        } catch (error) {
          console.warn(`Failed to warm cache for key: ${key}`, error)
        }
      })
    )
  }
}

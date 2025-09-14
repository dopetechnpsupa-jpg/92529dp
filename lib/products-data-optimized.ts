import { Product } from './products-data'
import { apiCache, createCacheKey } from './cache-enhanced'
import { useState, useEffect } from 'react'

// Optimized product data fetching with caching
export class OptimizedProductService {
  private static instance: OptimizedProductService
  private cache = apiCache

  static getInstance(): OptimizedProductService {
    if (!OptimizedProductService.instance) {
      OptimizedProductService.instance = new OptimizedProductService()
    }
    return OptimizedProductService.instance
  }

  // Get all products with caching
  async getProducts(): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'all')
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products:', error)
        return []
      }

      return (data || []) as Product[]
    })
  }

  // Get product by ID with caching
  async getProductById(id: number): Promise<Product | null> {
    const cacheKey = createCacheKey('product', id.toString())
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error fetching product:', error)
        return null
      }

      return data as Product | null
    })
  }

  // Get products by category with caching
  async getProductsByCategory(category: string): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'category', category)
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching products by category:', error)
        return []
      }

      return data as Product | null || []
    })
  }

  // Get dope picks with caching
  async getDopePicks(limit: number = 6): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'dope-picks', limit.toString())
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_dope_pick', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching dope picks:', error)
        return []
      }

      return data as Product | null || []
    })
  }

  // Get latest products with caching
  async getLatestProducts(limit: number = 5): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'latest', limit.toString())
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching latest products:', error)
        return []
      }

      return data as Product | null || []
    })
  }

  // Get weekly picks with caching
  async getWeeklyPicks(limit: number = 4): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'weekly-picks', limit.toString())
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_weekly_pick', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching weekly picks:', error)
        return []
      }

      return data as Product | null || []
    })
  }

  // Get dope arrivals by categories with caching
  async getDopeArrivalsByCategories(): Promise<{ [category: string]: Product[] }> {
    const cacheKey = createCacheKey('products', 'dope-arrivals')
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_dope_arrival', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching dope arrivals:', error)
        return {}
      }

      // Group by category
      const grouped = (data || []).reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = []
        }
        acc[product.category].push(product)
        return acc
      }, {} as { [category: string]: Product[] })

      return grouped
    })
  }

  // Get daily ad product with caching
  async getDailyAdProduct(): Promise<Product | null> {
    const cacheKey = createCacheKey('products', 'daily-ad')
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_daily_ad', true)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) {
        console.error('Error fetching daily ad product:', error)
        return null
      }

      return data as Product | null
    })
  }

  // Search products with caching
  async searchProducts(query: string): Promise<Product[]> {
    const cacheKey = createCacheKey('products', 'search', query.toLowerCase())
    
    return this.cache.get(cacheKey, async () => {
      const { supabase } = await import('./supabase')
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('in_stock', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching products:', error)
        return []
      }

      return data as Product | null || []
    })
  }

  // Invalidate cache for a specific product
  invalidateProduct(id: number): void {
    const keys = [
      createCacheKey('product', id.toString()),
      createCacheKey('products', 'all'),
      createCacheKey('products', 'dope-picks'),
      createCacheKey('products', 'latest'),
      createCacheKey('products', 'weekly-picks'),
      createCacheKey('products', 'dope-arrivals'),
      createCacheKey('products', 'daily-ad')
    ]
    
    keys.forEach(key => this.cache.invalidate(key))
  }

  // Invalidate all product caches
  invalidateAll(): void {
    this.cache.invalidate('products')
  }

  // Get cache statistics
  getCacheStats() {
    return this.cache.getStats()
  }
}

// Export singleton instance
export const productService = OptimizedProductService.getInstance()

// Optimized hooks for React components
export function useOptimizedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await productService.getProducts()
        
        if (isMounted) {
          setProducts(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch products')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  return { products, loading, error }
}

export function useOptimizedProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const data = await productService.getProductById(id)
        
        if (isMounted) {
          setProduct(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to fetch product')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  return { product, loading, error }
}

// Preload critical data
export async function preloadCriticalData(): Promise<void> {
  const promises = [
    productService.getProducts(),
    productService.getDopePicks(6),
    productService.getLatestProducts(5),
    productService.getWeeklyPicks(4)
  ]

  try {
    await Promise.all(promises)
  } catch (error) {
    console.warn('Failed to preload some critical data:', error)
  }
}

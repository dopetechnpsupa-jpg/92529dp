"use client"

import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  lcp: number | null
  fid: number | null
  cls: number | null
  fcp: number | null
  ttfb: number | null
  memory: {
    used: number
    total: number
    limit: number
  } | null
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void
  enableLogging?: boolean
}

export function PerformanceMonitor({ 
  onMetricsUpdate, 
  enableLogging = false 
}: PerformanceMonitorProps) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    memory: null
  })

  const logMetric = useCallback((name: string, value: number) => {
    if (enableLogging) {
      console.log(`[Performance] ${name}: ${value.toFixed(2)}ms`)
    }
  }, [enableLogging])

  const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
    setMetrics(prev => {
      const updated = { ...prev, ...newMetrics }
      onMetricsUpdate?.(updated)
      return updated
    })
  }, [onMetricsUpdate])

  // Monitor Core Web Vitals
  useEffect(() => {
    if (typeof window === 'undefined') return

    // LCP (Largest Contentful Paint)
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1] as PerformanceEntry & { startTime: number }
      updateMetrics({ lcp: lastEntry.startTime })
      logMetric('LCP', lastEntry.startTime)
    })
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

    // FID (First Input Delay)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        updateMetrics({ fid: entry.processingStart - entry.startTime })
        logMetric('FID', entry.processingStart - entry.startTime)
      })
    })
    fidObserver.observe({ entryTypes: ['first-input'] })

    // CLS (Cumulative Layout Shift)
    let clsValue = 0
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      updateMetrics({ cls: clsValue })
      logMetric('CLS', clsValue)
    })
    clsObserver.observe({ entryTypes: ['layout-shift'] })

    // FCP (First Contentful Paint)
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
      if (fcpEntry) {
        updateMetrics({ fcp: fcpEntry.startTime })
        logMetric('FCP', fcpEntry.startTime)
      }
    })
    fcpObserver.observe({ entryTypes: ['paint'] })

    // TTFB (Time to First Byte)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart
      updateMetrics({ ttfb })
      logMetric('TTFB', ttfb)
    }

    // Memory usage
    const updateMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryMetrics = {
          used: Math.round(memory.usedJSHeapSize / 1048576), // MB
          total: Math.round(memory.totalJSHeapSize / 1048576), // MB
          limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
        }
        updateMetrics({ memory: memoryMetrics })
        
        if (enableLogging) {
          console.log('[Performance] Memory:', memoryMetrics)
        }
      }
    }

    // Update memory usage periodically
    const memoryInterval = setInterval(updateMemoryUsage, 5000)
    updateMemoryUsage()

    return () => {
      lcpObserver.disconnect()
      fidObserver.disconnect()
      clsObserver.disconnect()
      fcpObserver.disconnect()
      clearInterval(memoryInterval)
    }
  }, [updateMetrics, logMetric])

  // Monitor resource loading performance
  useEffect(() => {
    if (typeof window === 'undefined') return

    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      entries.forEach((entry: any) => {
        if (entry.duration > 1000) { // Log slow resources
          logMetric(`Slow Resource: ${entry.name}`, entry.duration)
        }
      })
    })
    resourceObserver.observe({ entryTypes: ['resource'] })

    return () => resourceObserver.disconnect()
  }, [logMetric])

  return null
}

// Hook for performance monitoring
export function usePerformanceMonitor(enableLogging = false) {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    lcp: null,
    fid: null,
    cls: null,
    fcp: null,
    ttfb: null,
    memory: null
  })

  const [isMonitoring, setIsMonitoring] = useState(false)

  const startMonitoring = useCallback(() => {
    setIsMonitoring(true)
  }, [])

  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false)
  }, [])

  const getPerformanceScore = useCallback(() => {
    const { lcp, fid, cls, fcp } = metrics
    
    let score = 100
    
    // LCP scoring (good: <2.5s, needs improvement: 2.5-4s, poor: >4s)
    if (lcp !== null) {
      if (lcp > 4000) score -= 30
      else if (lcp > 2500) score -= 15
    }
    
    // FID scoring (good: <100ms, needs improvement: 100-300ms, poor: >300ms)
    if (fid !== null) {
      if (fid > 300) score -= 25
      else if (fid > 100) score -= 10
    }
    
    // CLS scoring (good: <0.1, needs improvement: 0.1-0.25, poor: >0.25)
    if (cls !== null) {
      if (cls > 0.25) score -= 25
      else if (cls > 0.1) score -= 10
    }
    
    // FCP scoring (good: <1.8s, needs improvement: 1.8-3s, poor: >3s)
    if (fcp !== null) {
      if (fcp > 3000) score -= 20
      else if (fcp > 1800) score -= 10
    }
    
    return Math.max(0, score)
  }, [metrics])

  return {
    metrics,
    isMonitoring,
    startMonitoring,
    stopMonitoring,
    getPerformanceScore
  }
}

// Performance optimization suggestions
export function getPerformanceSuggestions(metrics: PerformanceMetrics): string[] {
  const suggestions: string[] = []
  
  if (metrics.lcp && metrics.lcp > 2500) {
    suggestions.push('Consider optimizing images and reducing LCP')
  }
  
  if (metrics.fid && metrics.fid > 100) {
    suggestions.push('Reduce JavaScript execution time to improve FID')
  }
  
  if (metrics.cls && metrics.cls > 0.1) {
    suggestions.push('Add size attributes to images to prevent layout shifts')
  }
  
  if (metrics.fcp && metrics.fcp > 1800) {
    suggestions.push('Optimize critical rendering path for faster FCP')
  }
  
  if (metrics.memory && metrics.memory.used > 50) {
    suggestions.push('Consider reducing memory usage for better performance')
  }
  
  return suggestions
}

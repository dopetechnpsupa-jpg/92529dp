"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Filter, 
  X, 
  Check,
  Palette,
  Settings,
  Plus
} from 'lucide-react'

interface CombinationFilterProps {
  products: any[]
  onFilteredProducts: (filteredProducts: any[]) => void
  className?: string
}

export function CombinationFilter({ 
  products, 
  onFilteredProducts, 
  className = "" 
}: CombinationFilterProps) {
  const [selectedCombinations, setSelectedCombinations] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [availableCombinations, setAvailableCombinations] = useState<string[]>([])

  // Function to replace | with + icon in text
  const replacePlusWithPipe = (text: string) => {
    return text.replace(/ \+ /g, ' | ')
  }

  // Function to get color value for CSS
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ff0000',
      'green': '#00ff00',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'orange': '#ffa500',
      'pink': '#ffc0cb',
      'purple': '#800080',
      'grey': '#808080',
      'gray': '#808080',
      'golden': '#ffd700',
      'avacado': '#568203',
      'gift': '#ff6b6b',
      'moon': '#c0c0c0',
      'switch': '#4a4a4a'
    }
    
    const normalizedColor = colorName.toLowerCase().trim()
    return colorMap[normalizedColor] || normalizedColor
  }

  // Extract unique combinations from products
  useEffect(() => {
    const combinations = new Set<string>()
    
    products.forEach(product => {
      if (product.features && Array.isArray(product.features)) {
        product.features.forEach((feature: string) => {
          // Look for color | feature patterns or + patterns
          if (feature.includes(' | ') || feature.includes(' + ')) {
            combinations.add(feature)
          }
        })
      }
    })
    
    setAvailableCombinations(Array.from(combinations).sort())
  }, [products])

  // Filter products based on selected combinations
  useEffect(() => {
    if (selectedCombinations.length === 0) {
      onFilteredProducts(products)
    } else {
      const filtered = products.filter(product => {
        if (!product.features || !Array.isArray(product.features)) return false
        
        return product.features.some((feature: string) => 
          selectedCombinations.includes(feature)
        )
      })
      onFilteredProducts(filtered)
    }
  }, [selectedCombinations, products, onFilteredProducts])

  const handleCombinationToggle = (combination: string) => {
    setSelectedCombinations(prev => 
      prev.includes(combination)
        ? prev.filter(c => c !== combination)
        : [...prev, combination]
    )
  }

  const clearAllFilters = () => {
    setSelectedCombinations([])
  }

  const getFilterSummary = () => {
    if (selectedCombinations.length === 0) {
      return 'All Products'
    } else if (selectedCombinations.length === 1) {
      return selectedCombinations[0]
    } else {
      return `${selectedCombinations.length} combinations`
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* Filter Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
          selectedCombinations.length > 0
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
            : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
        }`}
      >
        <Filter className="w-4 h-4" />
        <span className="font-medium">{getFilterSummary()}</span>
        {selectedCombinations.length > 0 && (
          <X className="w-4 h-4" />
        )}
      </motion.button>

      {/* Filter Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Filter by Combinations
                </h3>
                {selectedCombinations.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={clearAllFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Clear All
                  </motion.button>
                )}
              </div>

              {/* Available Combinations */}
              {availableCombinations.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableCombinations.map((combination) => {
                    const isSelected = selectedCombinations.includes(combination)
                    const [color, feature] = combination.includes(' | ') ? 
                      combination.split(' | ') : 
                      combination.split(' + ')
                    
                    return (
                      <motion.button
                        key={combination}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCombinationToggle(combination)}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                          isSelected
                            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm ring-2 ring-offset-1 ring-offset-white dark:ring-offset-gray-800"
                            style={{ 
                              backgroundColor: getColorValue(color),
                              borderColor: isSelected ? '#3b82f6' : '#6b7280'
                            }}
                            title={color}
                          />
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {replacePlusWithPipe(combination)}
                              </span>
                              {isSelected && (
                                <Check className="w-4 h-4 text-blue-600" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {replacePlusWithPipe(`${color} + ${feature}`)}
                            </p>
                          </div>
                        </div>
                      </motion.button>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Filter className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    No color-feature combinations found
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Add products with combinations to see them here
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                <p className="mb-1">
                  <strong>How it works:</strong>
                </p>
                <p>Select specific color + feature combinations to filter products. Only products with matching combinations will be shown.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper component for displaying selected filter tags
export function FilterTags({ 
  combinations, 
  onRemove 
}: { 
  combinations: string[]; 
  onRemove: (combination: string) => void;
}) {
  if (combinations.length === 0) return null;

  // Function to get color value for CSS
  const getColorValue = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      'black': '#000000',
      'white': '#ffffff',
      'red': '#ff0000',
      'green': '#00ff00',
      'blue': '#0000ff',
      'yellow': '#ffff00',
      'orange': '#ffa500',
      'pink': '#ffc0cb',
      'purple': '#800080',
      'grey': '#808080',
      'gray': '#808080',
      'golden': '#ffd700',
      'avacado': '#568203',
      'gift': '#ff6b6b',
      'moon': '#c0c0c0',
      'switch': '#4a4a4a'
    }
    
    const normalizedColor = colorName.toLowerCase().trim()
    return colorMap[normalizedColor] || normalizedColor
  }

  // Function to replace | with + icon in text
  const replacePlusWithPipe = (text: string) => {
    return text.replace(/ \+ /g, ' | ')
  }

  return (
    <div className="flex flex-wrap gap-2">
      {combinations.map((combination) => {
        const [color, feature] = combination.includes(' | ') ? 
          combination.split(' | ') : 
          combination.split(' + ')
        
        return (
          <motion.div
            key={combination}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex items-center space-x-2 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
          >
            <div 
              className="w-4 h-4 rounded-full border-2 border-gray-300 shadow-sm"
              style={{ 
                backgroundColor: getColorValue(color),
                borderColor: '#3b82f6'
              }}
              title={color}
            />
            <span>{replacePlusWithPipe(combination)}</span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(combination)}
              className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5"
            >
              <X className="w-3 h-3" />
            </motion.button>
          </motion.div>
        )
      })}
    </div>
  )
}

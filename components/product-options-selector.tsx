'use client'

import { useState, useEffect } from 'react'
import { Check, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { type Product } from '@/lib/products-data'

interface ProductOptionsSelectorProps {
  product: Product
  onOptionsChange: (color: string | undefined, features: string[], selectedPrice?: number) => void
  initialColor?: string
  initialFeatures?: string[] // Only the first feature will be used for single selection
}

export function ProductOptionsSelector({ 
  product, 
  onOptionsChange, 
  initialColor, 
  initialFeatures = [] 
}: ProductOptionsSelectorProps) {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(initialColor)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>(
    initialFeatures.length > 0 ? [initialFeatures[0]] : [] // Only take the first feature if multiple provided
  )
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)

  // Available colors - split by comma if multiple colors are provided and deduplicate
  const availableColors = (() => {
    if (!product.color) return []
    let colors = []
    
    if (typeof product.color === 'string') {
      colors = product.color.split(',').map(color => color.trim()).filter(color => color.length > 0)
    }
    
    // Remove duplicates and return unique colors
    return [...new Set(colors)]
  })()
  
  // Available features from the product - handle various "empty" cases and deduplicate
  const availableFeatures = (() => {
    if (!product.features) return []
    let features = []
    
    if (Array.isArray(product.features)) {
      features = product.features.filter(feature => feature && feature.trim().length > 0)
    } else if (typeof product.features === 'string') {
      features = product.features && typeof product.features === 'string' && product.features.trim().length > 0 ? [product.features] : []
    }
    
    // Remove duplicates and return unique features
    return [...new Set(features)]
  })()

  // Extract color-feature combinations with pricing
  const colorFeatureCombinations = (() => {
    if (!product.color_feature_combinations) return []
    return product.color_feature_combinations
  })()

  // Function to find combination price
  const getCombinationPrice = (color: string, feature: string) => {
    console.log('🔍 Looking for combination price:', { color, feature })
    console.log('🔍 Available combinations:', colorFeatureCombinations)
    
    // First try exact match
    let combination = colorFeatureCombinations.find(combo => {
      const colorMatch = combo.color.toLowerCase().trim() === color.toLowerCase().trim()
      const featureMatch = combo.feature.toLowerCase().trim() === feature.toLowerCase().trim()
      return colorMatch && featureMatch
    })
    
    // If no exact match, try to parse the feature string (e.g., "Black | Moon Switch")
    if (!combination && feature.includes(' | ')) {
      const [featureColor, featureName] = feature.split(' | ')
      combination = colorFeatureCombinations.find(combo => {
        const colorMatch = combo.color.toLowerCase().trim() === featureColor.toLowerCase().trim()
        const featureMatch = combo.feature.toLowerCase().trim() === featureName.toLowerCase().trim()
        return colorMatch && featureMatch
      })
    }
    
    // If still no match, try to parse the feature string (e.g., "Black + Moon Switch")
    if (!combination && feature.includes(' + ')) {
      const [featureColor, featureName] = feature.split(' + ')
      combination = colorFeatureCombinations.find(combo => {
        const colorMatch = combo.color.toLowerCase().trim() === featureColor.toLowerCase().trim()
        const featureMatch = combo.feature.toLowerCase().trim() === featureName.toLowerCase().trim()
        return colorMatch && featureMatch
      })
    }
    
    console.log('🔍 Found combination:', combination)
    return combination?.price
  }
  
  // Debug logging
  console.log('🔍 ProductOptionsSelector Debug:', {
    productId: product.id,
    productName: product.name,
    productColor: product.color,
    productFeatures: product.features,
    availableColors,
    availableFeatures,
    shouldShow: availableColors.length > 0 || availableFeatures.length > 0
  })

  useEffect(() => {
    // Calculate price based on selections
    let calculatedPrice: number | undefined = undefined
    
    if (selectedFeatures.length > 0) {
      // Check if this is a color-feature combination with specific pricing
      const feature = selectedFeatures[0]
      const combinationPrice = getCombinationPrice(selectedColor || '', feature)
      if (combinationPrice) {
        calculatedPrice = combinationPrice
        console.log('🎯 Found combination price:', {
          color: selectedColor,
          feature: feature,
          price: combinationPrice
        })
      } else {
        console.log('❌ No combination price found for:', {
          color: selectedColor,
          feature: feature,
          availableCombinations: colorFeatureCombinations
        })
      }
    } else {
      console.log('🔄 No valid selection for price calculation:', {
        selectedColor,
        selectedFeatures
      })
    }
    
    setSelectedPrice(calculatedPrice)
    onOptionsChange(selectedColor, selectedFeatures, calculatedPrice)
  }, [selectedColor, selectedFeatures, onOptionsChange, colorFeatureCombinations])

  const handleColorSelect = (color: string) => {
    setSelectedColor(selectedColor === color ? undefined : color)
  }

  const handleFeatureToggle = (feature: string) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? [] // Deselect if already selected
        : [feature] // Select only this feature (single selection)
    )
  }

  const clearSelections = () => {
    setSelectedColor(undefined)
    setSelectedFeatures([])
  }

  // Function to replace + with | symbol in text
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

  if (availableColors.length === 0 && availableFeatures.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-br from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#F7DD0F]/20 shadow-xl">
      <h3 className="text-base sm:text-lg font-bold text-white mb-4">Customize Your Product</h3>
      <div className="text-gray-200 leading-relaxed text-sm sm:text-base bg-[#F7DD0F]/5 p-4 rounded-2xl border border-[#F7DD0F]/20 space-y-4">
        {/* Color Selection */}
        {availableColors.length > 0 && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Color</label>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color, index) => (
              <button
                key={`${color}-${index}`}
                onClick={() => handleColorSelect(color)}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                  selectedColor === color
                    ? 'bg-[#F7DD0F] text-black border-[#F7DD0F] shadow-lg'
                    : 'bg-black/30 text-white border-[#F7DD0F]/30 hover:bg-[#F7DD0F]/10 hover:border-[#F7DD0F]/50'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-5 h-5 rounded-full border-2 shadow-sm"
                    style={{ 
                      backgroundColor: getColorValue(color),
                      borderColor: selectedColor === color ? '#F7DD0F' : '#6b7280',
                      border: `2px solid ${selectedColor === color ? '#F7DD0F' : '#6b7280'}`
                    }}
                    title={color}
                  />
                  <span className="font-medium">{replacePlusWithPipe(color)}</span>
                  {selectedColor === color && <Check className="w-4 h-4" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Features Selection */}
      {availableFeatures.length > 0 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-300">Options</label>
          <div className="flex flex-wrap gap-2">
            {availableFeatures.map((feature, index) => {
              // Check if this is a color-feature combination (e.g., "Black | Moon Switch")
              const isColorFeatureCombo = feature.includes(' | ') || feature.includes(' + ')
              const colorFromCombo = isColorFeatureCombo ? 
                (feature.includes(' | ') ? feature.split(' | ')[0] : feature.split(' + ')[0]) : null
              
              // Get price for this combination if it exists
              const combinationPrice = colorFromCombo ? getCombinationPrice(colorFromCombo, feature) : undefined
              
              return (
                <button
                  key={`${feature}-${index}`}
                  onClick={() => handleFeatureToggle(feature)}
                  className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                    selectedFeatures.includes(feature)
                      ? 'bg-[#F7DD0F] text-black border-[#F7DD0F] shadow-lg'
                      : 'bg-black/30 text-white border-[#F7DD0F]/30 hover:bg-[#F7DD0F]/10 hover:border-[#F7DD0F]/50'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {isColorFeatureCombo && colorFromCombo && (
                      <div 
                        className="w-5 h-5 rounded-full border-2 shadow-sm"
                        style={{ 
                          backgroundColor: getColorValue(colorFromCombo),
                          borderColor: selectedFeatures.includes(feature) ? '#F7DD0F' : '#6b7280',
                          border: `2px solid ${selectedFeatures.includes(feature) ? '#F7DD0F' : '#6b7280'}`
                        }}
                        title={colorFromCombo}
                      />
                    )}
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{replacePlusWithPipe(feature)}</span>
                    </div>
                    {selectedFeatures.includes(feature) && <Check className="w-4 h-4" />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Clear Selections */}
      {(selectedColor || selectedFeatures.length > 0) && (
        <div className="pt-2">
          <Button
            onClick={clearSelections}
            variant="outline"
            size="sm"
            className="text-gray-400 hover:text-white border-[#F7DD0F]/30 hover:border-[#F7DD0F]/50 hover:bg-[#F7DD0F]/10"
          >
            <X className="w-4 h-4 mr-2" />
            Clear Selections
          </Button>
        </div>
      )}

      {/* Summary */}
      {(selectedColor || selectedFeatures.length > 0) && (
        <div className="pt-3 border-t border-[#F7DD0F]/20">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Selected Options:</h4>
          <div className="space-y-1">
            {selectedColor && (
              <p className="text-sm text-[#F7DD0F]">• Color: {replacePlusWithPipe(selectedColor)}</p>
            )}
            {selectedFeatures.length > 0 && (
              <p className="text-sm text-[#F7DD0F]">• Options: {selectedFeatures.map(f => replacePlusWithPipe(f)).join(', ')}</p>
            )}
            {selectedPrice && (
              <p className="text-sm text-[#F7DD0F] font-bold">• Price: Rs {selectedPrice.toLocaleString()}</p>
            )}
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

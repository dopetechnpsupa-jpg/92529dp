"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  X, 
  Palette, 
  Settings,
  Check,
  AlertCircle
} from 'lucide-react'

interface ColorFeatureCombo {
  id: string
  color: string
  feature: string
  price: number
  original_price?: number
  discount?: number
}

interface ColorFeatureCombinationProps {
  combinations: ColorFeatureCombo[]
  onCombinationsChange: (combinations: ColorFeatureCombo[]) => void
  className?: string
}

export function ColorFeatureCombination({ 
  combinations, 
  onCombinationsChange, 
  className = "" 
}: ColorFeatureCombinationProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [newColor, setNewColor] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newOriginalPrice, setNewOriginalPrice] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

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

  const handleAddCombination = () => {
    if (newColor.trim() && newPrice.trim()) {
      const price = parseFloat(newPrice)
      const originalPrice = newOriginalPrice.trim() ? parseFloat(newOriginalPrice) : undefined
      
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price!')
        return
      }
      
      if (originalPrice && (isNaN(originalPrice) || originalPrice <= 0)) {
        alert('Please enter a valid original price!')
        return
      }
      
      const newCombo: ColorFeatureCombo = {
        id: Date.now().toString(),
        color: newColor.trim(),
        feature: newFeature.trim() || '', // Allow empty feature
        price: price,
        original_price: originalPrice,
        discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined
      }
      
      // Check if combination already exists (only check if feature is provided)
      const exists = combinations.some(combo => 
        combo.color.toLowerCase() === newColor.toLowerCase() && 
        (newFeature.trim() ? combo.feature.toLowerCase() === newFeature.toLowerCase() : combo.feature === '')
      )
      
      if (!exists) {
        onCombinationsChange([...combinations, newCombo])
        setNewColor('')
        setNewFeature('')
        setNewPrice('')
        setNewOriginalPrice('')
        setIsAdding(false)
      } else {
        alert('This color-feature combination already exists!')
      }
    }
  }

  const handleRemoveCombination = (id: string) => {
    onCombinationsChange(combinations.filter(combo => combo.id !== id))
  }

  const handleEditCombination = (id: string) => {
    const combo = combinations.find(c => c.id === id)
    if (combo) {
      setNewColor(combo.color)
      setNewFeature(combo.feature)
      setNewPrice(combo.price.toString())
      setNewOriginalPrice(combo.original_price?.toString() || '')
      setEditingId(id)
      setIsAdding(true)
    }
  }

  const handleUpdateCombination = () => {
    if (editingId && newColor.trim() && newPrice.trim()) {
      const price = parseFloat(newPrice)
      const originalPrice = newOriginalPrice.trim() ? parseFloat(newOriginalPrice) : undefined
      
      if (isNaN(price) || price <= 0) {
        alert('Please enter a valid price!')
        return
      }
      
      if (originalPrice && (isNaN(originalPrice) || originalPrice <= 0)) {
        alert('Please enter a valid original price!')
        return
      }
      
      const updatedCombinations = combinations.map(combo => 
        combo.id === editingId 
          ? { 
              ...combo, 
              color: newColor.trim(), 
              feature: newFeature.trim() || '', // Allow empty feature
              price: price,
              original_price: originalPrice,
              discount: originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : undefined
            }
          : combo
      )
      onCombinationsChange(updatedCombinations)
      handleCancel()
    }
  }

  const handleCancel = () => {
    setNewColor('')
    setNewFeature('')
    setNewPrice('')
    setNewOriginalPrice('')
    setEditingId(null)
    setIsAdding(false)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-300">
          Color-Feature Combinations
        </label>
        <span className="text-xs text-gray-400">
          {combinations.length} combination{combinations.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Existing Combinations */}
      <div className="space-y-2">
        {combinations.map((combo) => (
          <motion.div
            key={combo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-5 h-5 rounded-full border-2 border-gray-300 shadow-sm ring-2 ring-offset-1 ring-offset-black"
                style={{ 
                  backgroundColor: getColorValue(combo.color),
                  borderColor: '#6b7280'
                }}
                title={combo.color}
              />
              <div className="flex flex-col">
                <span className="text-sm text-white font-medium">
                  {combo.color}{combo.feature ? ` | ${combo.feature}` : ''}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-[#F7DD0F] font-bold">
                    Rs {combo.price.toLocaleString()}
                  </span>
                  {combo.original_price && combo.original_price > combo.price && (
                    <>
                      <span className="text-xs text-gray-400 line-through">
                        Rs {combo.original_price.toLocaleString()}
                      </span>
                      {combo.discount && (
                        <span className="text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                          {combo.discount}% OFF
                        </span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleEditCombination(combo.id)}
                className="p-1 text-blue-400 hover:text-blue-300"
                title="Edit combination"
              >
                <Settings className="w-4 h-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => handleRemoveCombination(combo.id)}
                className="p-1 text-red-400 hover:text-red-300"
                title="Remove combination"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Form */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-white/5 border border-white/10 rounded-lg space-y-4"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Palette className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-white">
                {editingId ? 'Edit Combination' : 'Add New Combination'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter color (e.g., Black, Purple, White)"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Feature <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter feature (e.g., Moon Switch, Sea Salt Switch)"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Price (Rs) *
                </label>
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-2">
                  Original Price (Rs) - Optional
                </label>
                <input
                  type="number"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Enter original price for discount"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCancel}
                className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={editingId ? handleUpdateCombination : handleAddCombination}
                disabled={!newColor.trim() || !newPrice.trim()}
                className="px-4 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {editingId ? 'Update' : 'Add'}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Button */}
      {!isAdding && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsAdding(true)}
          className="w-full p-3 border-2 border-dashed border-white/20 rounded-lg text-white/60 hover:text-white hover:border-white/40 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm">Add Color-Feature Combination</span>
        </motion.button>
      )}

      {/* Help Text */}
      <div className="flex items-start space-x-2 text-xs text-gray-400">
        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium mb-1">How it works:</p>
          <ul className="space-y-1 text-xs">
            <li>• Create specific color | feature combinations (e.g., "Black | Moon Switch")</li>
            <li>• Only these exact combinations will be available for selection</li>
            <li>• Customers can only choose from the combinations you create</li>
            <li>• This creates a linked filtering system</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

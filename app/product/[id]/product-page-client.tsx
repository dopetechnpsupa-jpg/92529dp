"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ArrowRight, Plus, Heart, Truck, Shield, RotateCcw, ShoppingBag, X, Minus, Edit, Check, Zap, Award, Clock, Star, Share2, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/cart-context"
import SupabaseCheckout from "@/components/supabase-checkout"
import { type Product, getPrimaryImageUrl, getProductImageUrls } from "@/lib/products-data"
import { generateSlug } from "@/lib/seo-utils"
import { ProductOptionsSelector } from "@/components/product-options-selector"
import { CartItemEditor } from "@/components/cart-item-editor"
import { StructuredData } from "@/components/structured-data"
import { generateProductStructuredData, generateBreadcrumbStructuredData } from "@/lib/seo-utils"

interface ProductPageClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductPageClient({ product, relatedProducts }: ProductPageClientProps) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [selectedPrice, setSelectedPrice] = useState<number | undefined>(undefined)
  const [editingCartItem, setEditingCartItem] = useState<number | null>(null)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const isDesktop = useRef(false)

  // Calculate price range for products with combinations
  const getPriceRange = () => {
    if (!product.color_feature_combinations || product.color_feature_combinations.length === 0) {
      return null
    }
    
    const prices = product.color_feature_combinations.map(combo => combo.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)
    
    return { minPrice, maxPrice }
  }

  const priceRange = getPriceRange()
  const { 
    cart, 
    addToCart, 
    updateQuantity, 
    removeFromCart, 
    updateCartItemSelections,
    getCartCount, 
    getCartTotal, 
    cartOpen, 
    setCartOpen,
    checkoutModalOpen,
    setCheckoutModalOpen,
    clearCart
  } = useCart()

  const handleAddToCart = () => {
    const productToAdd = selectedPrice ? { ...product, price: selectedPrice } : product
    addToCart(productToAdd, quantity, selectedColor, selectedFeatures)
  }

  const handleBuyNow = () => {
    clearCart()
    const productToAdd = selectedPrice ? { ...product, price: selectedPrice } : product
    addToCart(productToAdd, quantity, selectedColor, selectedFeatures)
    setCheckoutModalOpen(true)
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
  }

  // Hide initial loading overlay after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000) // Show loading for 1 second

    return () => clearTimeout(timer)
  }, [])

  // Detect screen size to prevent conflicts between desktop and mobile versions
  useEffect(() => {
    const checkScreenSize = () => {
      isDesktop.current = window.innerWidth >= 1024
    }
    
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    
    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Debug logging for price changes (commented out for production)
  // useEffect(() => {
  //   console.log('💰 Price state updated:', { selectedPrice, selectedColor, selectedFeatures })
  //   console.log('💰 Price range:', priceRange)
  //   console.log('💰 Product price:', product.price)
  // }, [selectedPrice, selectedColor, selectedFeatures, priceRange, product.price])

  return (
    <div className="min-h-screen bg-black">
      {/* SEO Structured Data */}
      <StructuredData 
        type="product" 
        data={generateProductStructuredData(product)} 
      />
      <StructuredData 
        type="breadcrumb" 
        data={generateBreadcrumbStructuredData([
          { name: 'Home', url: '/' },
          { name: product.category, url: `/?category=${product.category}` },
          { name: product.name, url: `/product/${product.id}` }
        ])} 
      />
      
      {/* Initial Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#F7DD0F] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <p className="text-[#F7DD0F] font-bold text-xl mb-2">Loading Product...</p>
            <p className="text-gray-400 text-base">Preparing your shopping experience</p>
          </div>
        </div>
      )}
      {/* Modern Glassmorphism Header */}
      <div className="bg-black/80 backdrop-blur-2xl border-b border-[#F7DD0F]/20 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
            <Button
              variant="ghost"
              onClick={() => {
                sessionStorage.setItem('dopetech-returning', 'true')
                router.push('/', { scroll: false })
              }}
              className="flex items-center gap-2 p-2 sm:p-3 text-white hover:bg-[#F7DD0F]/10 hover:text-[#F7DD0F] transition-all duration-300 rounded-2xl backdrop-blur-sm border border-[#F7DD0F]/20"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium text-sm sm:text-base">Back</span>
            </Button>
            
            <div className="flex-1 text-center px-4 flex items-center justify-center">
              <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white truncate max-w-[200px] sm:max-w-[300px] lg:max-w-none bg-gradient-to-r from-white to-[#F7DD0F] bg-clip-text text-transparent">
                {product.name}
              </h1>
            </div>
            
            <Button
              variant="ghost"
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 p-2 sm:p-3 text-white hover:bg-[#F7DD0F]/10 hover:text-[#F7DD0F] transition-all duration-300 rounded-2xl backdrop-blur-sm border border-[#F7DD0F]/20"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline font-medium text-sm sm:text-base">Cart</span>
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-[#F7DD0F] to-yellow-400 text-black text-xs rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center font-bold animate-pulse shadow-lg">
                  {getCartCount()}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12 xl:gap-16">
          
          {/* Enhanced Product Images Section */}
          <div className="space-y-4 sm:space-y-6">
            {/* Desktop Layout: Thumbnails on left, main image on right */}
            <div className="hidden lg:flex gap-4 xl:gap-6">
              {/* Vertical Thumbnail Gallery - Desktop Only */}
              <div className="flex flex-col gap-3 xl:gap-4">
                {getProductImageUrls(product).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedImage(index)
                      setImagesLoaded(false)
                    }}
                    className={`aspect-square w-16 xl:w-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 group ${
                      selectedImage === index 
                        ? 'border-[#F7DD0F] shadow-lg ring-2 ring-[#F7DD0F]/30 scale-105 bg-gradient-to-br from-[#F7DD0F]/20 to-black/50' 
                        : 'border-[#F7DD0F]/30 hover:border-[#F7DD0F]/60 hover:shadow-md bg-gradient-to-br from-black/50 to-gray-900/50'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F7DD0F]/30 to-black/50"></div>
                    )}
                  </button>
                ))}
              </div>

              {/* Main Image - Desktop */}
              <div className="relative group flex-1">
                <div className="aspect-square w-full bg-gradient-to-br from-black/80 to-gray-900/80 rounded-3xl overflow-hidden shadow-2xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-700 backdrop-blur-sm">
                  <div className="relative w-full h-full">
                    {/* Modern Loading Overlay */}
                    {!imagesLoaded && typeof window !== 'undefined' && !sessionStorage.getItem('dopetech-returning') && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-[#F7DD0F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-[#F7DD0F] font-bold text-lg mb-2">Loading...</p>
                          <p className="text-gray-300 text-sm">Preparing your product view</p>
                        </div>
                      </div>
                    )}
                    
                    <img
                      src={getProductImageUrls(product)[selectedImage] || getPrimaryImageUrl(product)}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
                        imagesLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading={selectedImage === 0 ? "eager" : "lazy"}
                      onLoad={() => setImagesLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                    
                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Modern Navigation Arrows */}
                    {getProductImageUrls(product).length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#F7DD0F]/10 hover:bg-[#F7DD0F]/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#F7DD0F]/30"
                          disabled={selectedImage === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedImage(Math.min(getProductImageUrls(product).length - 1, selectedImage + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#F7DD0F]/10 hover:bg-[#F7DD0F]/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#F7DD0F]/30"
                          disabled={selectedImage === getProductImageUrls(product).length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Modern Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-[#F7DD0F]/30">
                    {selectedImage + 1} / {getProductImageUrls(product).length}
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop: Product Options Selector under product image */}
            <div className="hidden lg:block">
              <ProductOptionsSelector
                product={product}
                onOptionsChange={(color, features, price) => {
                  console.log('🖥️ Desktop ProductOptionsSelector onOptionsChange:', { color, features, price })
                  setSelectedColor(color)
                  setSelectedFeatures(features)
                  setSelectedPrice(price)
                }}
                initialColor={selectedColor}
                initialFeatures={selectedFeatures}
              />
            </div>

            {/* Mobile/Tablet Layout: Main image on top, horizontal thumbnails below */}
            <div className="lg:hidden space-y-4 sm:space-y-6">
              {/* Modern Main Image */}
              <div className="relative group">
                <div className="aspect-square w-full bg-gradient-to-br from-black/80 to-gray-900/80 rounded-3xl overflow-hidden shadow-2xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-700 backdrop-blur-sm">
                  <div className="relative w-full h-full">
                    {/* Modern Loading Overlay */}
                    {!imagesLoaded && typeof window !== 'undefined' && !sessionStorage.getItem('dopetech-returning') && (
                      <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-10">
                        <div className="text-center">
                          <div className="w-16 h-16 border-4 border-[#F7DD0F] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                          <p className="text-[#F7DD0F] font-bold text-lg mb-2">Loading...</p>
                          <p className="text-gray-300 text-sm">Preparing your product view</p>
                        </div>
                      </div>
                    )}
                    
                    <img
                      src={getProductImageUrls(product)[selectedImage] || getPrimaryImageUrl(product)}
                      alt={product.name}
                      className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110 ${
                        imagesLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      loading={selectedImage === 0 ? "eager" : "lazy"}
                      onLoad={() => setImagesLoaded(true)}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/placeholder-product.svg';
                      }}
                    />
                    
                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Modern Navigation Arrows */}
                    {getProductImageUrls(product).length > 1 && (
                      <>
                        <button
                          onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                          className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#F7DD0F]/10 hover:bg-[#F7DD0F]/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#F7DD0F]/30"
                          disabled={selectedImage === 0}
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedImage(Math.min(getProductImageUrls(product).length - 1, selectedImage + 1))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#F7DD0F]/10 hover:bg-[#F7DD0F]/20 backdrop-blur-md text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 border border-[#F7DD0F]/30"
                          disabled={selectedImage === getProductImageUrls(product).length - 1}
                        >
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Modern Image Counter */}
                  <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium border border-[#F7DD0F]/30">
                    {selectedImage + 1} / {getProductImageUrls(product).length}
                  </div>
                </div>
              </div>
              
              {/* Modern Thumbnail Gallery - Mobile/Tablet */}
              <div className="flex justify-center">
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 sm:gap-4 w-full">
                  {getProductImageUrls(product).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index)
                        setImagesLoaded(false)
                      }}
                      className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 group ${
                        selectedImage === index 
                          ? 'border-[#F7DD0F] shadow-lg ring-2 ring-[#F7DD0F]/30 scale-105 bg-gradient-to-br from-[#F7DD0F]/20 to-black/50' 
                          : 'border-[#F7DD0F]/30 hover:border-[#F7DD0F]/60 hover:shadow-md bg-gradient-to-br from-black/50 to-gray-900/50'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-product.svg';
                        }}
                      />
                      {selectedImage === index && (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#F7DD0F]/30 to-black/50"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modern Service Info - Desktop Only */}
            <div className="hidden lg:block mt-6 xl:mt-8">
              <div className="grid grid-cols-1 gap-4 xl:gap-5">
                <div className="bg-gradient-to-br from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm p-4 xl:p-5 rounded-2xl xl:rounded-3xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 xl:p-3 bg-gradient-to-r from-[#F7DD0F]/20 to-yellow-400/20 rounded-xl xl:rounded-2xl border border-[#F7DD0F]/30 group-hover:scale-110 transition-transform duration-300">
                      <RotateCcw className="w-4 h-4 xl:w-5 xl:h-5 text-[#F7DD0F]" />
                    </div>
                    <span className="font-bold text-white text-sm xl:text-base">Return & Refund Policy</span>
                  </div>
                  <p className="text-gray-200 text-xs xl:text-sm leading-relaxed">
                    Safe payments and secure personal details with 30-day return guarantee
                  </p>
                </div>
                <div className="bg-gradient-to-br from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm p-4 xl:p-5 rounded-2xl xl:rounded-3xl border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 transition-all duration-300 shadow-xl hover:shadow-2xl group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 xl:p-3 bg-gradient-to-r from-[#F7DD0F]/20 to-yellow-400/20 rounded-xl xl:rounded-2xl border border-[#F7DD0F]/30 group-hover:scale-110 transition-transform duration-300">
                      <Shield className="w-4 h-4 xl:w-5 xl:h-5 text-[#F7DD0F]" />
                    </div>
                    <span className="font-bold text-white text-sm xl:text-base">Security & Privacy</span>
                  </div>
                  <p className="text-gray-200 text-xs xl:text-sm leading-relaxed">
                    Safe payments and secure personal details with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Product Details Section */}
          <div className="space-y-6 sm:space-y-8 w-full text-left">
            {/* Modern Product Header */}
            <div className="space-y-1 sm:space-y-2">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight bg-gradient-to-r from-white via-gray-100 to-[#F7DD0F] bg-clip-text text-transparent text-left">
                  {product.name}
                </h1>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-[#F7DD0F]/20 to-yellow-400/20 rounded-full text-[#F7DD0F] font-medium text-sm border border-[#F7DD0F]/30">
                    {product.category}
                  </span>
                  {product.rating > 0 && (
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F7DD0F]/10 rounded-full border border-[#F7DD0F]/30">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-white font-medium text-sm">{product.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-gray-400 text-xs">({product.reviews} reviews)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modern Price Section */}
            <div className="space-y-0">
              <div className="bg-gradient-to-r from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm py-3 px-6 rounded-3xl border border-[#F7DD0F]/20 text-left">
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 sm:gap-4">
                  <div className="flex items-baseline gap-2">
                    {selectedPrice ? (
                      // Show selected combination price
                      <span className="text-3xl sm:text-4xl lg:text-5xl price-proxima-nova bg-gradient-to-r from-[#F7DD0F] to-yellow-400 bg-clip-text text-transparent font-bold">
                        Rs {selectedPrice.toLocaleString()}
                        {console.log('💰 Displaying selectedPrice:', selectedPrice)}
                      </span>
                    ) : priceRange ? (
                      // Show price range for products with combinations
                      <div className="flex flex-col">
                        <span className="text-3xl sm:text-4xl lg:text-5xl price-proxima-nova bg-gradient-to-r from-[#F7DD0F] to-yellow-400 bg-clip-text text-transparent font-bold">
                          Rs {priceRange.minPrice.toLocaleString()} - Rs {priceRange.maxPrice.toLocaleString()}
                          {console.log('💰 Displaying priceRange:', priceRange)}
                        </span>
                        <span className="text-sm text-gray-300 mt-1">Starting from</span>
                      </div>
                    ) : (
                      // Show regular price
                      <span className="text-3xl sm:text-4xl lg:text-5xl price-proxima-nova bg-gradient-to-r from-[#F7DD0F] to-yellow-400 bg-clip-text text-transparent font-bold">
                        Rs {product.discount > 0 ? Math.round(product.original_price * (1 - product.discount / 100)).toLocaleString() : product.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {((product.original_price > product.price || product.discount > 0) && !selectedPrice && !priceRange) && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                      <span className="text-lg sm:text-xl price-kelpt-a2 text-gray-400 line-through">
                        Rs {product.original_price.toLocaleString()}
                      </span>

                      
                      <span className="bg-gradient-to-r from-[#F7DD0F] to-yellow-400 text-black px-4 py-2 rounded-full text-sm font-bold w-fit shadow-lg">
                        {product.discount > 0 ? product.discount : Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                      </span>
                    </div>
                  )}
                  {selectedPrice && (
                    <div className="text-sm text-gray-300">
                      <span>Final price after customization</span>
                    </div>
                  )}
                  {priceRange && !selectedPrice && (
                    <div className="text-sm text-gray-300">
                      <span>Select options to see exact price</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile: Product Options Selector */}
            <div className="lg:hidden">
              <ProductOptionsSelector
                product={product}
                onOptionsChange={(color, features, price) => {
                  console.log('📱 Mobile ProductOptionsSelector onOptionsChange:', { color, features, price })
                  // Only update state if we're actually on mobile (not desktop)
                  if (!isDesktop.current) {
                    setSelectedColor(color)
                    setSelectedFeatures(features)
                    setSelectedPrice(price)
                  }
                }}
                initialColor={selectedColor}
                initialFeatures={selectedFeatures}
              />
            </div>

            {/* Mobile: All in one row, Desktop: Separate sections */}
            <div className="space-y-0 text-left">
              
              {/* Mobile Layout: All three in one row */}
              <div className="flex sm:hidden items-center gap-2">
                {/* Quantity Selector */}
                <div className="flex-1 max-w-20">
                  <div className="grid grid-cols-3 border-2 border-[#F7DD0F]/30 rounded-2xl bg-gradient-to-r from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm focus-within:border-[#F7DD0F]/60 focus-within:ring-2 focus-within:ring-[#F7DD0F]/20 transition-all duration-300 overflow-hidden shadow-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2 py-3 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/10 active:bg-[#F7DD0F]/20 transition-all duration-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center border-none bg-transparent focus:outline-none text-sm font-bold text-white px-1 py-3 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2 py-3 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/10 active:bg-[#F7DD0F]/20 transition-all duration-300 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 bg-transparent"
                    >
                      +
                    </button>
                  </div>
                </div>
                
                {/* Add to Cart Button */}
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 border-2 border-[#F7DD0F] rounded-2xl bg-transparent hover:bg-[#F7DD0F]/10 text-white py-5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </div>
                </Button>
                
                {/* Buy Now Button */}
                <Button
                  onClick={handleBuyNow}
                  className="flex-1 border-2 border-[#F7DD0F] rounded-2xl bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-5 text-sm font-bold shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    <span>Buy Now</span>
                  </div>
                </Button>
              </div>

              {/* Desktop Layout: Separate sections */}
              <div className="hidden sm:block space-y-3">
                {/* Quantity Selector */}
                <div className="w-full max-w-44 sm:max-w-52 space-y-2">
                  {/* Quantity Label */}
                  <label className="flex text-base sm:text-lg font-bold text-white items-center gap-2">
                    <div className="w-2 h-2 bg-[#F7DD0F] rounded-full"></div>
                    Quantity
                  </label>
                  <div className="grid grid-cols-3 border-2 border-[#F7DD0F]/30 rounded-2xl bg-gradient-to-r from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm focus-within:border-[#F7DD0F]/60 focus-within:ring-2 focus-within:ring-[#F7DD0F]/20 transition-all duration-300 overflow-hidden shadow-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 sm:px-4 py-3 sm:py-4 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/10 active:bg-[#F7DD0F]/20 transition-all duration-300 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 disabled:opacity-50 disabled:cursor-not-allowed bg-transparent"
                      disabled={quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="text-center border-none bg-transparent focus:outline-none text-lg font-bold text-white px-2 py-3 sm:py-4 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      min="1"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 sm:px-4 py-3 sm:py-4 text-white hover:text-[#F7DD0F] hover:bg-[#F7DD0F]/10 active:bg-[#F7DD0F]/20 transition-all duration-300 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 bg-transparent"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full sm:flex-1 border-2 border-[#F7DD0F] rounded-2xl bg-transparent hover:bg-[#F7DD0F]/10 text-white py-6 sm:py-8 text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span>Add to Cart</span>
                    </div>
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    className="w-full sm:flex-1 border-2 border-[#F7DD0F] rounded-2xl bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-6 sm:py-8 text-lg sm:text-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <Zap className="w-6 h-6 sm:w-7 sm:h-7" />
                      <span>Buy Now</span>
                    </div>
                  </Button>
                </div>
              </div>
            </div>

            {/* Modern Description */}
            <div className="bg-gradient-to-br from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm p-5 sm:p-6 rounded-3xl border border-[#F7DD0F]/20 shadow-xl text-left">
              <h3 className="text-base sm:text-lg font-bold text-white mb-4 text-left">
                About this item
              </h3>
              <div className="text-gray-200 leading-relaxed whitespace-pre-wrap text-sm sm:text-base bg-[#F7DD0F]/5 p-4 rounded-2xl border border-[#F7DD0F]/20 text-left">
                {product.description || "Experience premium quality with our latest product. Designed for performance and durability, this item offers exceptional value and modern aesthetics."}
              </div>
            </div>


          </div>
        </div>

        {/* Modern Related Products Section */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 bg-gradient-to-r from-white via-gray-100 to-[#F7DD0F] bg-clip-text text-transparent">
              Related Products
            </h2>
            <p className="text-gray-300 text-sm sm:text-base">Discover more amazing products</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                onClick={() => {
                  const slug = generateSlug(relatedProduct.name)
                  router.push(`/product/${relatedProduct.id}-${slug}`)
                }}
                className="bg-gradient-to-br from-black/90 to-[#F7DD0F]/10 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group border border-[#F7DD0F]/20 hover:border-[#F7DD0F]/40 focus:outline-none focus:ring-2 focus:ring-[#F7DD0F]/50 active:scale-[0.98]"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    const slug = generateSlug(relatedProduct.name)
                    router.push(`/product/${relatedProduct.id}-${slug}`)
                  }
                }}
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={getPrimaryImageUrl(relatedProduct)}
                    alt={relatedProduct.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-product.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-4 sm:p-5">
                  <h3 className="font-bold text-white line-clamp-2 mb-3 leading-tight group-hover:text-[#F7DD0F] transition-colors duration-300 text-sm sm:text-base">
                    {relatedProduct.name}
                  </h3>
                  <p className="text-base sm:text-lg price-proxima-nova bg-gradient-to-r from-[#F7DD0F] to-yellow-400 bg-clip-text text-transparent font-bold group-hover:scale-105 transition-transform duration-300">
                    Rs {relatedProduct.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Shopping Cart Sidebar - Mobile Optimized */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCartOpen(false)}
          />
          
          <div className="relative ml-auto w-full max-w-[90vw] sm:max-w-sm md:max-w-md bg-gradient-to-br from-black/95 to-gray-900/95 backdrop-blur-2xl shadow-2xl rounded-l-2xl sm:rounded-l-3xl border-l border-[#F7DD0F]/20">
            <div className="flex flex-col h-full">
              {/* Enhanced Cart Header - Mobile Optimized */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#F7DD0F]/20">
                <h2 className="text-lg sm:text-xl font-bold text-white bg-gradient-to-r from-white to-[#F7DD0F] bg-clip-text text-transparent">Shopping Cart</h2>
                <button
                  onClick={() => setCartOpen(false)}
                  className="p-3 sm:p-3 hover:bg-[#F7DD0F]/10 rounded-full transition-colors touch-target"
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </button>
              </div>

              {/* Enhanced Cart Items - Mobile Optimized */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6 scrollbar-hide">
                {cart.length === 0 ? (
                  <div className="text-center py-8 sm:py-12">
                    <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                    <p className="text-gray-400 text-base sm:text-lg">Your cart is empty</p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-2">Add some products to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-black border border-[#F7DD0F]/20 rounded-2xl p-3 sm:p-4 space-y-3 sm:space-y-4">
                        <div className="flex items-start space-x-3 sm:space-x-4">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded-xl flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm sm:text-base line-clamp-2 leading-tight text-white mb-1">{item.name}</h3>
                            <p className="text-[#F7DD0F] price-proxima-nova text-base sm:text-lg mb-2">Rs {item.price}</p>
                            
                            {/* Quantity Controls - Mobile Optimized */}
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-2 sm:p-2.5 hover:bg-[#F7DD0F]/20 rounded-lg transition-colors touch-target"
                                style={{ minHeight: '40px', minWidth: '40px' }}
                              >
                                <Minus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </button>
                              <span className="w-8 sm:w-10 text-center font-bold text-white text-base sm:text-lg">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-2 sm:p-2.5 hover:bg-[#F7DD0F]/20 rounded-lg transition-colors touch-target"
                                style={{ minHeight: '40px', minWidth: '40px' }}
                              >
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                              </button>
                            </div>
                          </div>
                          
                          {/* Action Buttons - Mobile Optimized */}
                          <div className="flex flex-col space-y-2 flex-shrink-0">
                            <button
                              onClick={() => setEditingCartItem(item.id)}
                              className="p-2 sm:p-2.5 hover:bg-[#F7DD0F]/20 rounded-lg text-[#F7DD0F] transition-colors touch-target"
                              style={{ minHeight: '40px', minWidth: '40px' }}
                            >
                              <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-2 sm:p-2.5 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors touch-target"
                              style={{ minHeight: '40px', minWidth: '40px' }}
                            >
                              <X className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Product Options - Mobile Optimized */}
                        {(item.selectedColor || (item.selectedFeatures && item.selectedFeatures.length > 0)) && (
                          <div className="pl-0 sm:pl-20 space-y-2">
                            {item.selectedColor && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm text-gray-400">Color:</span>
                                <span className="text-xs sm:text-sm font-medium text-white">{item.selectedColor}</span>
                              </div>
                            )}
                            {item.selectedFeatures && item.selectedFeatures.length > 0 && (
                              <div className="flex items-center space-x-2">
                                <span className="text-xs sm:text-sm text-gray-400">Features:</span>
                                <span className="text-xs sm:text-sm font-medium text-white">{item.selectedFeatures.join(', ')}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Enhanced Cart Footer - Mobile Optimized */}
              {cart.length > 0 && (
                <div className="border-t border-[#F7DD0F]/20 p-4 sm:p-6">
                  <div className="flex justify-between items-center mb-4 sm:mb-4">
                    <span className="text-base sm:text-lg font-semibold text-white">Total:</span>
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-[#F7DD0F]">
                      Rs {getCartTotal().toFixed(2)}
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setCartOpen(false)
                      setCheckoutModalOpen(true)
                    }}
                    className="w-full bg-[#F7DD0F] hover:bg-[#F7DD0F]/90 text-black py-4 sm:py-4 px-4 sm:px-6 rounded-xl font-bold hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] text-base sm:text-base touch-target"
                    style={{ minHeight: '48px' }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Supabase Checkout Modal */}
      <SupabaseCheckout
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        cart={cart}
        total={getCartTotal()}
        onCartReset={() => {
          // Cart will be cleared by the SupabaseCheckout component
        }}
      />

      {/* Cart Item Editor Modal */}
      {editingCartItem && (() => {
        const item = cart.find(cartItem => cartItem.id === editingCartItem)
        if (!item) return null
        
        return (
          <CartItemEditor
            product={item}
            currentColor={item.selectedColor}
            currentFeatures={item.selectedFeatures}
            onSave={(color, features) => {
              updateCartItemSelections(editingCartItem, color, features)
              setEditingCartItem(null)
            }}
            onCancel={() => setEditingCartItem(null)}
            isOpen={true}
          />
        )
      })()}
    </div>
  )
}

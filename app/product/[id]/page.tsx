import { getProductByIdWithImages, getProductsByCategory, getProducts } from "@/lib/products-data"
import ProductPageClient from "./product-page-client"
import { Metadata } from "next"
import { generateSlug } from "@/lib/seo-utils"

// Extract product ID from slug (format: "id-product-name" or just "id")
function extractProductIdFromSlug(slug: string): number | null {
  // Check if it's just a number (old format)
  if (/^\d+$/.test(slug)) {
    return parseInt(slug, 10)
  }
  
  // Check if it's in the format "id-product-name"
  const match = slug.match(/^(\d+)-/)
  return match ? parseInt(match[1], 10) : null
}

// Generate static params for all products with both ID and slug formats
export async function generateStaticParams() {
  try {
    const products = await getProducts()
    const params = []
    
    // Add both old format (ID only) and new format (ID-slug)
    products.forEach((product) => {
      const slug = generateSlug(product.name)
      params.push(
        { id: product.id.toString() }, // Old format for backward compatibility
        { id: `${product.id}-${slug}` } // New SEO-friendly format
      )
    })
    
    return params
  } catch (error) {
    console.error('Error generating static params:', error)
    // Fallback to known product IDs if fetch fails
    return [
      { id: '1' },
      { id: '2' },
      { id: '3' },
      { id: '4' },
      { id: '5' },
    ]
  }
}

interface ProductPageProps {
  params: Promise<{
    id: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const resolvedParams = await params
  const productId = extractProductIdFromSlug(resolvedParams.id)
  
  if (!productId) {
    return {
      title: 'Product Not Found | DopeTech',
      description: 'The requested product could not be found.',
    }
  }

  try {
    const product = await getProductByIdWithImages(productId)
    
    if (!product) {
      return {
        title: 'Product Not Found | DopeTech',
        description: 'The requested product could not be found.',
      }
    }

    return {
      title: `${product.name} | DopeTech`,
      description: product.description || `Shop ${product.name} at DopeTech. Premium quality tech gear with fast shipping and excellent customer service.`,
      keywords: [
        product.name,
        product.category,
        'gaming',
        'tech',
        'electronics',
        'DopeTech',
        ...(product.features || [])
      ],
      openGraph: {
        title: `${product.name} | DopeTech`,
        description: product.description || `Shop ${product.name} at DopeTech.`,
        type: 'website',
        url: `https://dopetech.com/product/${resolvedParams.id}`,
        images: [
          {
            url: product.image_url,
            width: 800,
            height: 600,
            alt: product.name,
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${product.name} | DopeTech`,
        description: product.description || `Shop ${product.name} at DopeTech.`,
        images: [product.image_url],
      },
      alternates: {
        canonical: `https://dopetech.com/product/${resolvedParams.id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Product | DopeTech',
      description: 'Browse our collection of premium tech gear.',
    }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const productId = extractProductIdFromSlug(resolvedParams.id)
  
  if (!productId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <a href="/" className="bg-[#F7DD0F] text-black px-4 py-2 rounded-lg hover:bg-[#F7DD0F]/90">
            Go back home
          </a>
        </div>
      </div>
    )
  }
  
  try {
    const product = await getProductByIdWithImages(productId)
    
    if (!product) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product not found</h1>
            <a href="/" className="bg-[#F7DD0F] text-black px-4 py-2 rounded-lg hover:bg-[#F7DD0F]/90">
              Go back home
            </a>
          </div>
        </div>
      )
    }

    // Optimized: Get related products from the same category only
    const relatedProducts = await getProductsByCategory(product.category)
    const filteredRelatedProducts = relatedProducts
      .filter(p => p.id !== productId)
      .slice(0, 6)

    return <ProductPageClient product={product} relatedProducts={filteredRelatedProducts} />
  } catch (error) {
    console.error('Error fetching product:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error loading product</h1>
          <a href="/" className="bg-[#F7DD0F] text-black px-4 py-2 rounded-lg hover:bg-[#F7DD0F]/90">
            Go back home
          </a>
        </div>
      </div>
    )
  }
}
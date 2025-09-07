import { getProducts } from '@/lib/products-data'
import { generateSitemapData } from '@/lib/seo-utils'

export default async function sitemap() {
  try {
    console.log('🔄 Generating sitemap...')
    const products = await getProducts()
    console.log(`📦 Found ${products.length} products for sitemap`)
    
    const sitemapData = generateSitemapData(products)
    console.log(`✅ Generated sitemap with ${sitemapData.length} URLs`)
    
    return sitemapData
  } catch (error) {
    console.error('❌ Error generating sitemap:', error)
    
    // Fallback sitemap with correct domain and current timestamp
    const currentDate = new Date()
    return [
      {
        url: 'https://www.dopetechnp.com',
        lastModified: currentDate,
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://www.dopetechnp.com/support',
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://www.dopetechnp.com/terms',
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://www.dopetechnp.com/sitemap.xml',
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.7,
      },
    ]
  }
}

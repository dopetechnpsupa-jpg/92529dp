import { getProducts } from '@/lib/products-data'
import { generateSitemapData } from '@/lib/seo-utils'

export default async function sitemap() {
  try {
    const products = await getProducts()
    const sitemapData = generateSitemapData(products)
    
    return sitemapData
  } catch (error) {
    console.error('Error generating sitemap:', error)
    
    // Fallback sitemap with correct domain
    return [
      {
        url: 'https://www.dopetechnp.com',
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: 'https://www.dopetechnp.com/support',
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: 'https://www.dopetechnp.com/terms',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.5,
      },
      {
        url: 'https://www.dopetechnp.com/admin',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
      {
        url: 'https://www.dopetechnp.com/dopetechadmin',
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.3,
      },
    ]
  }
}

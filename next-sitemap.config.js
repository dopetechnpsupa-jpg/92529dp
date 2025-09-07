/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.dopetechnp.com',
  generateRobotsTxt: false, // We'll create our own robots.txt
  generateIndexSitemap: false, // We'll manage sitemap structure manually
  exclude: ['/admin', '/dopetechadmin', '/api'], // Exclude admin pages and API routes from sitemap
  additionalPaths: async (config) => {
    const result = []
    
    // Add keyword-rich paths for SEO
    const keywordPaths = [
      { path: '/gaming-keyboards-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/mechanical-keyboards-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/gaming-mouse-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/wireless-mouse-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/gaming-headphones-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/pc-accessories-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/mobile-gadgets-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/tech-accessories-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/gaming-gear-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/computer-peripherals-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/ajazz-keyboard-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/dopetech-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/dopetech-np', priority: 0.9, changefreq: 'weekly' },
      { path: '/premium-keyboard-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/gaming-accessories-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/tech-store-nepal', priority: 0.9, changefreq: 'weekly' },
      { path: '/kathmandu-tech-store', priority: 0.8, changefreq: 'weekly' },
      { path: '/patan-tech-shop', priority: 0.8, changefreq: 'weekly' },
      { path: '/nepal-gaming', priority: 0.8, changefreq: 'weekly' },
      { path: '/nepal-esports', priority: 0.8, changefreq: 'weekly' }
    ]
    
    keywordPaths.forEach(({ path, priority, changefreq }) => {
      result.push({
        loc: path,
        changefreq,
        priority,
        lastmod: new Date().toISOString(),
      })
    })
    
    return result
  },
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/dopetechadmin', '/api'],
      },
    ],
    additionalSitemaps: [
      'https://www.dopetechnp.com/sitemap.xml',
    ],
  },
  transform: async (config, path) => {
    // Custom transform for different page types
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path.startsWith('/product/')) {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.9,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/support') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/terms') {
      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString(),
      }
    }
    
    if (path === '/sitemap.xml') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
      }
    }
    
    // Default transform
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}

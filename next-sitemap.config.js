/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.dopetechnp.com',
  generateRobotsTxt: false, // We'll create our own robots.txt
  generateIndexSitemap: false,
  exclude: ['/admin', '/dopetechadmin', '/api'], // Exclude admin pages and API routes from sitemap
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
    
    // Default transform
    return {
      loc: path,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString(),
    }
  },
}

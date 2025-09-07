# SEO Setup for Dopetech Nepal

This document outlines the SEO configuration and best practices implemented for the Dopetech Nepal website.

## Files Created/Modified

### 1. robots.txt
- **Location**: `public/robots.txt`
- **Content**: Allows all crawlers and points to sitemap
- **URL**: `https://www.dopetechnp.com/robots.txt`

### 2. Sitemap
- **Dynamic**: `app/sitemap.ts` - Next.js App Router sitemap generation
- **Static**: `public/sitemap.xml` - Fallback sitemap
- **Config**: `next-sitemap.config.js` - Configuration for automatic sitemap generation
- **URL**: `https://www.dopetechnp.com/sitemap.xml`

### 3. Metadata Updates
- **Layout**: `app/layout.tsx` - Global metadata configuration
- **Homepage**: `app/page-metadata.tsx` - Homepage-specific metadata
- **Support**: `app/support/page.tsx` - Support page metadata
- **Terms**: `app/terms/page.tsx` - Terms page metadata
- **Products**: `app/product/[id]/page.tsx` - Dynamic product page metadata
- **Admin**: `app/admin/page.tsx` - Admin panel metadata (no-index)
- **Dopetech Admin**: `app/dopetechadmin/page.tsx` - Admin panel metadata (no-index)

## SEO Features Implemented

### Meta Tags
- **Title**: "Dopetech Nepal | Gaming Keyboards, Mouse & Headphones in Nepal"
- **Description**: "Shop premium gaming keyboards, mouse, headphones & PC accessories at Dopetech Nepal. Dopetech Nepal brings you the best gear for your perfect setup."
- **Keywords**: Gaming-focused keywords for better search relevance
- **Canonical URLs**: Proper canonical URLs for all pages
- **Open Graph**: Social media sharing optimization
- **Twitter Cards**: Twitter sharing optimization

### Technical SEO
- **Robots.txt**: Proper crawler instructions
- **Sitemap**: XML sitemap with proper priorities and change frequencies
- **Structured Data**: JSON-LD schema markup for products and organization
- **Meta Robots**: Proper indexing instructions for all pages
- **Admin Protection**: Admin pages are marked as no-index

### Build Process
- **Post-build**: Sitemap is automatically generated after each build
- **Dynamic**: Product pages are automatically included in sitemap
- **Exclusions**: Admin pages are excluded from public sitemap

## Deployment Verification

After deployment to Vercel, verify these URLs are accessible:

1. **Robots.txt**: `https://www.dopetechnp.com/robots.txt`
2. **Sitemap**: `https://www.dopetechnp.com/sitemap.xml`
3. **Homepage**: `https://www.dopetechnp.com/`
4. **Support**: `https://www.dopetechnp.com/support`
5. **Terms**: `https://www.dopetechnp.com/terms`

## Maintenance

### Adding New Pages
1. Create the page in the `app/` directory
2. Add metadata export with proper title and description
3. The sitemap will automatically include the page

### Updating Metadata
1. Modify the metadata export in the respective page file
2. Update the layout.tsx for global changes
3. Rebuild and deploy

### Sitemap Updates
- The sitemap is automatically generated on each build
- Product pages are dynamically included
- Manual updates to `next-sitemap.config.js` if needed

## Google Search Console

After deployment:
1. Submit the sitemap URL to Google Search Console
2. Verify the robots.txt is accessible
3. Monitor indexing status of all pages
4. Check for any crawl errors

## Performance Notes

- Sitemap generation happens at build time
- Static files are served with proper caching headers
- Admin pages are excluded from public indexing
- All metadata is server-side rendered for better SEO

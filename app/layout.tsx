import type React from "react"
import type { Metadata } from "next"
import { Plus_Jakarta_Sans } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import { GlobalErrorHandler } from "@/components/global-error-handler"
import { DynamicFavicon } from "@/components/dynamic-favicon"

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'arial'],
})

// Custom fonts for prices
const proximaNovaBold = {
  fontFamily: 'Plus Jakarta Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: '700',
  fontStyle: 'normal',
}

const kelptA2ExtraBold = {
  fontFamily: 'Outfit, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  fontWeight: '800',
  fontStyle: 'normal',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://www.dopetechnp.com'),
  title: {
    default: "Dopetech Nepal | Premium Gaming Keyboards, Mouse, Headphones & Tech Accessories in Nepal",
    template: "%s | Dopetech Nepal"
  },
  description: "Dopetech Nepal - Your premier destination for gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories in Nepal. Shop the best gaming gear and computer peripherals.",
  keywords: "Dopetech, Dopetech Nepal, Ajazz keyboard in Nepal, Dopetech_np, Premium keyboard in Nepal, gaming mouse in Nepal, gaming accessories in Nepal, mobile and pc gadgets in Nepal, tech store in Nepal, gaming keyboards, mechanical keyboard, wireless mouse, gaming headphones, PC accessories, gaming gear, gaming setup, tech accessories, computer peripherals, Nepal tech store, gaming peripherals, RGB keyboard, wireless gaming mouse, gaming headset, PC gaming, esports gear, Nepal gaming, Kathmandu tech store, Patan tech shop, gaming equipment, computer accessories, laptop accessories, mobile accessories, smartphone accessories, tablet accessories, gaming chair, gaming desk, gaming monitor, gaming speakers, gaming microphone, streamer gear, content creator equipment, Nepal esports, gaming community Nepal",
  authors: [{ name: "Dopetech Nepal" }],
  creator: "Dopetech Nepal",
  publisher: "Dopetech Nepal",
  generator: 'Next.js',
  applicationName: 'Dopetech Nepal',
  referrer: 'origin-when-cross-origin',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dopetech',
          startupImage: [
      {
        url: '/logo/dopelogo.svg',
        media: '(device-width: 320px) and (device-height: 568px)',
      },
    ],
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.dopetechnp.com',
    title: 'Dopetech Nepal | Premium Gaming Keyboards, Mouse, Headphones & Tech Accessories in Nepal',
    description: 'Dopetech Nepal - Your premier destination for gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories in Nepal. Shop the best gaming gear and computer peripherals.',
    siteName: 'Dopetech Nepal',
    images: [
      {
        url: '/logo/LOGO.svg',
        width: 1200,
        height: 630,
        alt: 'Dopetech Nepal - Premium Gaming Gear & Tech Accessories',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dopetech Nepal | Premium Gaming Keyboards, Mouse, Headphones & Tech Accessories in Nepal',
    description: 'Dopetech Nepal - Your premier destination for gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories in Nepal. Shop the best gaming gear and computer peripherals.',
    images: ['/logo/LOGO.svg'],
    creator: '@dopetech_np',
    site: '@dopetech_np',
  },
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://www.dopetechnp.com',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Dopetech',
    'application-name': 'Dopetech Nepal',
    'msapplication-TileColor': '#F7DD0F',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        
        {/* Custom Fonts for Prices */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Plus Jakarta Sans is already loaded as the primary font */}
        
        {/* Kelpt A2 Extra Bold alternative - Outfit Extra Bold */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@800&display=swap" />
        
        {/* Preload critical resources - only load what's immediately needed */}

        
        {/* Meta tags for performance */}
        <meta name="theme-color" content="#F7DD0F" />
        <meta name="msapplication-TileColor" content="#F7DD0F" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="DopeTech" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="format-detection" content="telephone=no" />
        
        {/* Additional SEO meta tags for keyword targeting */}
        <meta name="keywords" content="Dopetech, Dopetech Nepal, Ajazz keyboard in Nepal, Dopetech_np, Premium keyboard in Nepal, gaming mouse in Nepal, gaming accessories in Nepal, mobile and pc gadgets in Nepal, tech store in Nepal, gaming keyboards, mechanical keyboard, wireless mouse, gaming headphones, PC accessories, gaming gear, gaming setup, tech accessories, computer peripherals, Nepal tech store, gaming peripherals, RGB keyboard, wireless gaming mouse, gaming headset, PC gaming, esports gear, Nepal gaming, Kathmandu tech store, Patan tech shop, gaming equipment, computer accessories, laptop accessories, mobile accessories, smartphone accessories, tablet accessories, gaming chair, gaming desk, gaming monitor, gaming speakers, gaming microphone, streamer gear, content creator equipment, Nepal esports, gaming community Nepal" />
        <meta name="author" content="Dopetech Nepal" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="bingbot" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Geographic and business meta tags */}
        <meta name="geo.region" content="NP" />
        <meta name="geo.placename" content="Kathmandu, Patan, Nepal" />
        <meta name="geo.position" content="27.6726;85.3249" />
        <meta name="ICBM" content="27.6726, 85.3249" />
        
        {/* Business and service meta tags */}
        <meta name="business:contact_data:street_address" content="Patan Mangalbazar" />
        <meta name="business:contact_data:locality" content="Patan" />
        <meta name="business:contact_data:region" content="Bagmati" />
        <meta name="business:contact_data:postal_code" content="44600" />
        <meta name="business:contact_data:country_name" content="Nepal" />
        <meta name="business:contact_data:phone_number" content="+977-XXXXXXXXX" />
        <meta name="business:contact_data:email" content="dopetechnp@gmail.com" />
        
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Windows tile configuration */}
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Favicon - Optimized for Google Search and SEO */}
        <link rel="icon" type="image/x-icon" href="/logodope.ico" />
        <link rel="icon" type="image/svg+xml" href="/logo/LOGO.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logodope.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logodope.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logodope.ico" />
        <link rel="shortcut icon" href="/logodope.ico" />
        
        {/* Additional favicon formats for better browser support */}
        <link rel="icon" type="image/svg+xml" href="/logo/LOGO.svg" />
        <link rel="mask-icon" href="/logo/LOGO.svg" color="#F7DD0F" />
        
        {/* Google Search specific favicon tags */}
        <link rel="icon" href="/logodope.ico" />
        <link rel="icon" href="/logo/LOGO.svg" type="image/svg+xml" />
        
        {/* Additional sizes for better Google Search compatibility */}
        <link rel="icon" sizes="16x16" href="/logodope.ico" />
        <link rel="icon" sizes="32x32" href="/logodope.ico" />
        <link rel="icon" sizes="48x48" href="/logodope.ico" />
        <link rel="icon" sizes="192x192" href="/logodope.ico" />
        <link rel="icon" sizes="512x512" href="/logodope.ico" />
        
        {/* Dynamic favicon component for additional functionality */}
        
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        
        {/* Optimized Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Optimized cache management and service worker registration
              if (typeof window !== 'undefined') {
                // Version management
                const currentVersion = '1.0.4';
                const lastVersion = localStorage.getItem('dopetech-version');
                
                if (lastVersion !== currentVersion) {
                  localStorage.setItem('dopetech-version', currentVersion);
                  
                  // Clear old caches
                  if ('caches' in window) {
                    caches.keys().then(function(cacheNames) {
                      return Promise.all(
                        cacheNames.map(function(cacheName) {
                          if (cacheName.startsWith('dopetech-') && !cacheName.includes(currentVersion)) {
                            console.log('Clearing old cache:', cacheName);
                            return caches.delete(cacheName);
                          }
                        })
                      );
                    });
                  }
                  
                  // Reload if version changed
                  if (lastVersion) {
                    console.log('Version updated, reloading...');
                    window.location.reload();
                  }
                }
                
                // Register optimized service worker
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw-optimized.js?v=' + currentVersion)
                      .then(function(registration) {
                        console.log('Service Worker registered:', registration.scope);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', function() {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // New version available
                                console.log('New version available');
                              }
                            });
                          }
                        });
                      })
                      .catch(function(error) {
                        console.warn('Service Worker registration failed:', error);
                      });
                  });
                }
                
                // Performance monitoring
                if ('performance' in window) {
                  window.addEventListener('load', function() {
                    setTimeout(function() {
                      const perfData = performance.getEntriesByType('navigation')[0];
                      if (perfData) {
                        console.log('Page Load Performance:', {
                          'DOM Content Loaded': perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                          'Load Complete': perfData.loadEventEnd - perfData.loadEventStart,
                          'Total Load Time': perfData.loadEventEnd - perfData.fetchStart
                        });
                      }
                    }, 0);
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className={plusJakartaSans.className} suppressHydrationWarning={true}>
        <DynamicFavicon />
        <GlobalErrorHandler />
        <CartProvider>
          {children}
        </CartProvider>
      </body>
    </html>
  )
}

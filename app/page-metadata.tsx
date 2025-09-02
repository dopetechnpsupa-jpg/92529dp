import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Dopetech Nepal | Gaming Keyboards, Mouse & Headphones in Nepal",
  description: "Shop premium gaming keyboards, mouse, headphones & PC accessories at Dopetech Nepal. Dopetech Nepal brings you the best gear for your perfect setup.",
  keywords: "gaming keyboards, gaming mouse, gaming headphones, PC accessories, Nepal, Dopetech Nepal, gaming gear, mechanical keyboard, wireless mouse, gaming setup, tech accessories, computer peripherals",
  openGraph: {
    title: "Dopetech Nepal | Gaming Keyboards, Mouse & Headphones in Nepal",
    description: "Shop premium gaming keyboards, mouse, headphones & PC accessories at Dopetech Nepal. Dopetech Nepal brings you the best gear for your perfect setup.",
    type: 'website',
    locale: 'en_US',
    url: 'https://www.dopetechnp.com',
    siteName: 'Dopetech Nepal',
    images: [
      {
        url: '/logo/dopelogo.svg',
        width: 1200,
        height: 630,
        alt: 'Dopetech Nepal - Gaming Keyboards, Mouse & Headphones in Nepal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Dopetech Nepal | Gaming Keyboards, Mouse & Headphones in Nepal",
    description: "Shop premium gaming keyboards, mouse, headphones & PC accessories at Dopetech Nepal. Dopetech Nepal brings you the best gear for your perfect setup.",
    images: ['/logo/dopelogo.svg'],
    creator: '@dopetech_np',
  },
  alternates: {
    canonical: 'https://www.dopetechnp.com',
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
  other: {
    'geo.region': 'NP',
    'geo.placename': 'Nepal',
    'geo.position': '27.7172;85.3240',
    'ICBM': '27.7172, 85.3240',
  },
}

// SEO utility functions for DopeTech Nepal

/**
 * Generate a SEO-friendly slug from a string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate a product URL with slug
 */
export function generateProductUrl(product: { id: number; name: string; category?: string }): string {
  const slug = generateSlug(product.name)
  return `/product/${product.id}-${slug}`
}

/**
 * Generate structured data for products
 */
export function generateProductStructuredData(product: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image_url || product.images?.[0]?.image_url,
    "brand": {
      "@type": "Brand",
      "name": "DopeTech Nepal"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "NPR",
      "availability": product.in_stock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "DopeTech Nepal"
      },
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating || 4.5,
      "reviewCount": product.reviews || 0
    }
  }
}

/**
 * Generate structured data for the organization
 */
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DopeTech Nepal",
    "alternateName": ["Dopetech", "Dopetech_np", "Dopetech Nepal"],
    "url": "https://www.dopetechnp.com",
    "logo": "https://www.dopetechnp.com/logo/LOGO.svg",
    "description": "Dopetech Nepal - Your premier destination for gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories in Nepal. Shop the best gaming gear and computer peripherals.",
    "slogan": "Premium Gaming Gear & Tech Accessories in Nepal",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "NP",
      "addressLocality": "Patan",
      "addressRegion": "Bagmati",
      "postalCode": "44600"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "dopetechnp@gmail.com",
      "availableLanguage": ["English", "Nepali"]
    },
    "sameAs": [
      "https://instagram.com/dopetech_np",
      "https://www.facebook.com/dopetech.nepal",
      "https://twitter.com/dopetech_np"
    ],
    "knowsAbout": [
      "Gaming Keyboards",
      "Mechanical Keyboards", 
      "Gaming Mouse",
      "Wireless Mouse",
      "Gaming Headphones",
      "PC Accessories",
      "Gaming Gear",
      "Tech Accessories",
      "Computer Peripherals",
      "Mobile Gadgets",
      "Gaming Setup",
      "Esports Equipment"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    }
  }
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://www.dopetechnp.com${crumb.url}`
    }))
  }
}

/**
 * Generate FAQ structured data
 */
export function generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  }
}

/**
 * Generate gaming gear FAQ structured data with target keywords
 */
export function generateGamingGearFAQStructuredData() {
  const faqs = [
    {
      question: "Where can I buy gaming keyboards in Nepal?",
      answer: "Dopetech Nepal offers the best selection of gaming keyboards and mechanical keyboards in Nepal. Visit our store in Patan Mangalbazar or shop online at dopetechnp.com for premium gaming gear."
    },
    {
      question: "What gaming mouse options are available in Nepal?",
      answer: "Dopetech Nepal provides high-quality gaming mouse and wireless mouse options in Nepal. We offer various brands and models suitable for different gaming needs and preferences."
    },
    {
      question: "Do you sell gaming headphones in Nepal?",
      answer: "Yes, Dopetech Nepal is your premier destination for gaming headphones and headsets in Nepal. We offer professional-grade audio equipment for gamers and content creators."
    },
    {
      question: "What PC accessories do you offer in Nepal?",
      answer: "Dopetech Nepal provides a complete range of PC accessories and computer peripherals in Nepal, including gaming gear, tech accessories, and mobile gadgets for your perfect setup."
    },
    {
      question: "Is Dopetech Nepal the best tech store in Nepal?",
      answer: "Dopetech Nepal is recognized as one of the premier tech stores in Nepal, specializing in gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, and PC accessories."
    },
    {
      question: "Where is Dopetech Nepal located?",
      answer: "Dopetech Nepal is located in Patan Mangalbazar, Kathmandu, Nepal. We serve customers throughout Nepal with premium gaming gear and tech accessories."
    }
  ]
  
  return generateFAQStructuredData(faqs)
}

/**
 * Generate local business structured data
 */
export function generateLocalBusinessStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "DopeTech Nepal",
    "alternateName": ["Dopetech", "Dopetech_np", "Dopetech Nepal"],
    "description": "Dopetech Nepal - Your premier destination for gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories in Nepal. Shop the best gaming gear and computer peripherals.",
    "url": "https://www.dopetechnp.com",
    "telephone": "+977-9808640750",
    "email": "dopetechnp@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Patan Mangalbazar",
      "addressLocality": "Patan",
      "addressRegion": "Bagmati",
      "postalCode": "44600",
      "addressCountry": "NP"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 27.6726,
      "longitude": 85.3249
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday", 
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "priceRange": "$$",
    "currenciesAccepted": "NPR",
    "paymentAccepted": ["Cash", "Digital Payment", "Bank Transfer"],
    "category": [
      "Gaming Store",
      "Computer Store", 
      "Electronics Store",
      "Tech Accessories Store",
      "Gaming Gear Store"
    ],
    "serviceType": [
      "Gaming Keyboards",
      "Mechanical Keyboards",
      "Gaming Mouse", 
      "Wireless Mouse",
      "Gaming Headphones",
      "PC Accessories",
      "Mobile Gadgets",
      "Tech Accessories",
      "Computer Peripherals",
      "Gaming Setup",
      "Esports Equipment"
    ],
    "areaServed": {
      "@type": "Country",
      "name": "Nepal"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Gaming Gear & Tech Accessories",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Gaming Keyboards",
            "image": "https://www.dopetechnp.com/logo/LOGO.svg",
            "description": "Premium gaming keyboards and mechanical keyboards available at Dopetech Nepal",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NPR",
              "price": "0",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "NPR"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "NP",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
              }
            }
          }
        },
        {
          "@type": "Offer", 
          "itemOffered": {
            "@type": "Product",
            "name": "Gaming Mouse",
            "image": "https://www.dopetechnp.com/logo/LOGO.svg",
            "description": "High-performance gaming mouse and wireless mouse available at Dopetech Nepal",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NPR",
              "price": "0",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "NPR"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "NP",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
              }
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product", 
            "name": "Gaming Headphones",
            "image": "https://www.dopetechnp.com/logo/LOGO.svg",
            "description": "Professional gaming headphones and headsets available at Dopetech Nepal",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NPR",
              "price": "0",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "NPR"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "NP",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
              }
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "PC Accessories",
            "image": "https://www.dopetechnp.com/logo/LOGO.svg",
            "description": "Complete range of PC accessories and computer peripherals available at Dopetech Nepal",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NPR",
              "price": "0",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "NPR"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "NP",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
              }
            }
          }
        },
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Product",
            "name": "Mobile Gadgets",
            "image": "https://www.dopetechnp.com/logo/LOGO.svg",
            "description": "Premium mobile gadgets and smartphone accessories available at Dopetech Nepal",
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "NPR",
              "price": "0",
              "shippingDetails": {
                "@type": "OfferShippingDetails",
                "shippingRate": {
                  "@type": "MonetaryAmount",
                  "value": "0",
                  "currency": "NPR"
                },
                "deliveryTime": {
                  "@type": "ShippingDeliveryTime",
                  "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 2,
                    "unitCode": "DAY"
                  },
                  "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 1,
                    "maxValue": 3,
                    "unitCode": "DAY"
                  }
                }
              },
              "hasMerchantReturnPolicy": {
                "@type": "MerchantReturnPolicy",
                "applicableCountry": "NP",
                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                "merchantReturnDays": 7,
                "returnMethod": "https://schema.org/ReturnByMail",
                "returnFees": "https://schema.org/FreeReturn"
              }
            }
          }
        }
      ]
    }
  }
}

/**
 * Generate product category structured data
 */
export function generateProductCategoryStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Gaming Gear & Tech Accessories in Nepal",
    "description": "Complete collection of gaming keyboards, mechanical keyboards, gaming mouse, wireless mouse, gaming headphones, PC accessories, mobile gadgets, and tech accessories available at Dopetech Nepal",
    "url": "https://www.dopetechnp.com",
    "numberOfItems": 5,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@type": "Product",
          "name": "Gaming Keyboards in Nepal",
          "description": "Premium gaming keyboards and mechanical keyboards available at Dopetech Nepal",
          "url": "https://www.dopetechnp.com",
          "brand": {
            "@type": "Brand",
            "name": "Dopetech Nepal"
          },
          "category": "Gaming Keyboards",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "NPR",
            "price": "0",
            "description": "Premium gaming keyboards available at Dopetech Nepal",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "NPR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "NP",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        }
      },
      {
        "@type": "ListItem", 
        "position": 2,
        "item": {
          "@type": "Product",
          "name": "Gaming Mouse in Nepal",
          "description": "High-performance gaming mouse and wireless mouse available at Dopetech Nepal",
          "url": "https://www.dopetechnp.com",
          "brand": {
            "@type": "Brand",
            "name": "Dopetech Nepal"
          },
          "category": "Gaming Mouse",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "NPR",
            "price": "0",
            "description": "High-performance gaming mouse available at Dopetech Nepal",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "NPR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "NP",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 3,
        "item": {
          "@type": "Product",
          "name": "Gaming Headphones in Nepal",
          "description": "Professional gaming headphones and headsets available at Dopetech Nepal",
          "url": "https://www.dopetechnp.com",
          "brand": {
            "@type": "Brand",
            "name": "Dopetech Nepal"
          },
          "category": "Gaming Headphones",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "NPR",
            "price": "0",
            "description": "Professional gaming headphones available at Dopetech Nepal",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "NPR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "NP",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 4,
        "item": {
          "@type": "Product",
          "name": "PC Accessories in Nepal",
          "description": "Complete range of PC accessories and computer peripherals available at Dopetech Nepal",
          "url": "https://www.dopetechnp.com",
          "brand": {
            "@type": "Brand",
            "name": "Dopetech Nepal"
          },
          "category": "PC Accessories",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "NPR",
            "price": "0",
            "description": "Complete range of PC accessories available at Dopetech Nepal",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "NPR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        }
      },
      {
        "@type": "ListItem",
        "position": 5,
        "item": {
          "@type": "Product",
          "name": "Mobile Gadgets in Nepal",
          "keyword": "mobile and pc gadgets in Nepal",
          "description": "Premium mobile gadgets and smartphone accessories available at Dopetech Nepal",
          "url": "https://www.dopetechnp.com",
          "brand": {
            "@type": "Brand",
            "name": "Dopetech Nepal"
          },
          "category": "Mobile Gadgets",
          "offers": {
            "@type": "Offer",
            "availability": "https://schema.org/InStock",
            "priceCurrency": "NPR",
            "price": "0",
            "description": "Premium mobile gadgets available at Dopetech Nepal",
            "shippingDetails": {
              "@type": "OfferShippingDetails",
              "shippingRate": {
                "@type": "MonetaryAmount",
                "value": "0",
                "currency": "NPR"
              },
              "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 2,
                  "unitCode": "DAY"
                },
                "transitTime": {
                  "@type": "QuantitativeValue",
                  "minValue": 1,
                  "maxValue": 3,
                  "unitCode": "DAY"
                }
              }
            },
            "hasMerchantReturnPolicy": {
              "@type": "MerchantReturnPolicy",
              "applicableCountry": "NP",
              "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
              "merchantReturnDays": 7,
              "returnMethod": "https://schema.org/ReturnByMail",
              "returnFees": "https://schema.org/FreeReturn"
            }
          }
        }
      }
    ]
  }
}

/**
 * Generate sitemap data for products
 */
export function generateSitemapData(products: any[]) {
  const baseUrl = 'https://www.dopetechnp.com'
  const currentDate = new Date()
  
  const urls = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5
    },
    {
      url: `${baseUrl}/sitemap.xml`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7
    },
    ...products.map(product => ({
      url: `${baseUrl}${generateProductUrl(product)}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9
    }))
  ]
  
  return urls
}

// Schema Markup Generators for SEO
// All schemas follow Google's Rich Results guidelines

interface FAQItem {
  id: string
  question: string
  answer: string
}

const BASE_URL = "https://countryroof.in"

// Organization reference for linking schemas
const ORGANIZATION_REFERENCE = {
  "@type": "Organization",
  "@id": `${BASE_URL}/#organization`,
  name: "CountryRoof",
}

export function generateBlogSchema(post: any, authorName: string) {
  // If the post has pre-generated schema_markup from the editor, use it
  if (post.schema_markup && Array.isArray(post.schema_markup)) {
    return post.schema_markup
  }

  const schemas: object[] = []

  const publishDate = post.publication_date || post.createdAt
  const modifiedDate = post.updatedAt || publishDate
  const blogUrl = `${BASE_URL}/blogs/${post.slug}`
  const imageUrl = post.banner_image || post.cover_image || post.og_image || `${BASE_URL}/og-image.png`

  // Article Schema with all required fields for Google Rich Results
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": post.schema_markup?.article_type || "BlogPosting",
    "@id": `${blogUrl}#article`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": blogUrl,
    },
    headline: post.title,
    name: post.title,
    description: post.meta_description || post.excerpt || "",
    image: {
      "@type": "ImageObject",
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    datePublished: publishDate ? new Date(publishDate).toISOString() : new Date().toISOString(),
    dateModified: modifiedDate ? new Date(modifiedDate).toISOString() : new Date().toISOString(),
    author: {
      "@type": "Person",
      name: authorName || "CountryRoof",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "CountryRoof",
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/logo.png`,
        width: 512,
        height: 512,
      },
    },
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    inLanguage: "en-IN",
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(", ")
    }),
    articleSection: post.category
      ? (Array.isArray(post.category) ? post.category[0] : post.category)
      : "Real Estate",
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : undefined,
  }
  schemas.push(articleSchema)

  // FAQ Schema (if FAQs exist) - Required for FAQ Rich Results
  if (post.faqs && Array.isArray(post.faqs) && post.faqs.length > 0) {
    const validFaqs = post.faqs.filter((faq: FAQItem) => faq.question?.trim() && faq.answer?.trim())
    if (validFaqs.length > 0) {
      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "@id": `${blogUrl}#faq`,
        mainEntity: validFaqs.map((faq: FAQItem) => ({
          "@type": "Question",
          name: faq.question.trim(),
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer.trim()
          }
        }))
      }
      schemas.push(faqSchema)
    }
  }

  // BreadcrumbList Schema - Required for Breadcrumb Rich Results
  const categoryName = post.category
    ? (Array.isArray(post.category) ? post.category[0] : post.category)
    : "Blogs"

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${blogUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blogs",
        item: `${BASE_URL}/blogs`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: `${BASE_URL}/blogs?category=${encodeURIComponent(categoryName)}`
      },
      {
        "@type": "ListItem",
        position: 4,
        name: post.title,
        item: blogUrl
      }
    ]
  }
  schemas.push(breadcrumbSchema)

  return schemas
}

export function generatePropertySchema(property: any) {
  const schemas: object[] = []
  const propertyUrl = `${BASE_URL}/properties/${property.slug || property._id}`
  const imageUrl = property.main_banner || property.main_thumbnail || property.multiple_images?.[0] || `${BASE_URL}/og-image.png`
  
  // Determine price for schema
  const priceValue = property.lowest_price || property.max_price || 0
  const priceText = property.lowest_price && property.max_price 
    ? `${property.lowest_price}-${property.max_price}` 
    : priceValue.toString()

  // Use RealEstateListing for property listings (Google recommended)
  const realEstateSchema = {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    "@id": `${propertyUrl}#listing`,
    name: property.property_name,
    description: property.about_project || `${property.property_name} - Premium property in ${property.city}`,
    url: propertyUrl,
    datePosted: property.createdAt ? new Date(property.createdAt).toISOString() : new Date().toISOString(),
    image: Array.isArray(property.multiple_images) && property.multiple_images.length > 0
      ? [imageUrl, ...property.multiple_images.slice(0, 4)]
      : imageUrl,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: priceValue,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: property.status === "active" || property.status === "available" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: ORGANIZATION_REFERENCE,
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || "",
      addressLocality: property.city || "Gurugram",
      addressRegion: property.state || "Haryana",
      postalCode: property.postal_code || "",
      addressCountry: "IN",
    },
    ...(property.latitude && property.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
  }
  schemas.push(realEstateSchema)

  // Also add Product schema for better e-commerce rich results
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${propertyUrl}#product`,
    name: property.property_name,
    description: property.about_project || `${property.property_name} in ${property.city}`,
    image: imageUrl,
    brand: {
      "@type": "Brand",
      name: property.developer_name || "CountryRoof",
    },
    offers: {
      "@type": "Offer",
      url: propertyUrl,
      priceCurrency: "INR",
      price: priceValue,
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      availability: property.status === "active" || property.status === "available" 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock",
      seller: ORGANIZATION_REFERENCE,
    },
    category: property.property_type || "Real Estate",
    ...(property.rera_number && {
      identifier: property.rera_number,
    }),
  }
  schemas.push(productSchema)

  // Residence schema for additional property details
  const residenceSchema = {
    "@context": "https://schema.org",
    "@type": property.property_type?.toLowerCase().includes("commercial") ? "LocalBusiness" : "Residence",
    "@id": `${propertyUrl}#residence`,
    name: property.property_name,
    description: property.about_project,
    image: Array.isArray(property.multiple_images) && property.multiple_images.length > 0
      ? [imageUrl, ...property.multiple_images.slice(0, 4)]
      : imageUrl,
    address: {
      "@type": "PostalAddress",
      streetAddress: property.address || "",
      addressLocality: property.city || "Gurugram",
      addressRegion: property.state || "Haryana",
      postalCode: property.postal_code || "",
      addressCountry: "IN",
    },
    ...(property.latitude && property.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: property.latitude,
        longitude: property.longitude,
      },
    }),
    ...(property.bedrooms && {
      numberOfRooms: property.bedrooms,
    }),
    ...(property.bathrooms && {
      numberOfBathroomsTotal: property.bathrooms,
    }),
    ...(property.area_sqft && {
      floorSize: {
        "@type": "QuantitativeValue",
        value: property.area_sqft,
        unitCode: "FTK",
        unitText: "sq ft",
      },
    }),
    ...(property.amenities && property.amenities.length > 0 && {
      amenityFeature: property.amenities.map((amenity: string) => ({
        "@type": "LocationFeatureSpecification",
        name: amenity,
        value: true,
      })),
    }),
  }
  schemas.push(residenceSchema)

  return schemas
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "CountryRoof",
    alternateName: "Country Roof Real Estate",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.png`,
      width: 512,
      height: 512,
    },
    image: `${BASE_URL}/og-image.png`,
    description: "Premium property marketplace connecting buyers, sellers, and agents in Gurgaon and Delhi NCR",
    telephone: "+91-1244765940",
    priceRange: "$$-$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5th Floor, JMD Megapolis, 555-A, Badshahpur Sohna Rd, near Subhash Chowk, Sector 48",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4089,
      longitude: 77.0424,
    },
    areaServed: [
      {
        "@type": "City",
        name: "Gurugram",
      },
      {
        "@type": "Place",
        name: "Delhi NCR",
      }
    ],
    sameAs: [
      "https://www.facebook.com/countryroof",
      "https://www.instagram.com/countryroof",
      "https://www.linkedin.com/company/countryroof",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-1244765940",
      contactType: "Customer Service",
      availableLanguage: ["en", "hi"],
      areaServed: "IN",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00",
    },
  }
}

// Generate breadcrumb schema for property pages
export function generatePropertyBreadcrumbSchema(property: any, propertyTypeSlug: string, propertyTypeDisplayName: string) {
  const propertyUrl = `${BASE_URL}/properties/${propertyTypeSlug}/${property.slug || property._id}`
  
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${propertyUrl}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Properties",
        item: `${BASE_URL}/properties`
      },
      {
        "@type": "ListItem",
        position: 3,
        name: propertyTypeDisplayName,
        item: `${BASE_URL}/properties?type=${propertyTypeSlug}`
      },
      ...(property.city ? [{
        "@type": "ListItem",
        position: 4,
        name: property.city,
        item: `${BASE_URL}/properties?city=${encodeURIComponent(property.city.toLowerCase())}`
      }] : []),
      {
        "@type": "ListItem",
        position: property.city ? 5 : 4,
        name: property.property_name,
        item: propertyUrl
      }
    ]
  }
}

// Generate WebPage schema for static pages
export function generateWebPageSchema(page: {
  title: string
  description: string
  url: string
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  const schemas: object[] = []
  
  // WebPage schema
  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${page.url}#webpage`,
    url: page.url,
    name: page.title,
    description: page.description,
    isPartOf: {
      "@id": `${BASE_URL}/#website`,
    },
    about: {
      "@id": `${BASE_URL}/#organization`,
    },
    inLanguage: "en-IN",
  }
  schemas.push(webPageSchema)

  // Breadcrumb schema if provided
  if (page.breadcrumbs && page.breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${page.url}#breadcrumb`,
      itemListElement: page.breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        item: item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`
      }))
    }
    schemas.push(breadcrumbSchema)
  }

  return schemas
}

// Generate LocalBusiness schema for contact page
export function generateLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    "@id": `${BASE_URL}/#organization`,
    name: "CountryRoof",
    image: `${BASE_URL}/og-image.png`,
    url: BASE_URL,
    telephone: "+91-1244765940",
    priceRange: "$$-$$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: "5th Floor, JMD Megapolis, 555-A, Badshahpur Sohna Rd, near Subhash Chowk, Sector 48",
      addressLocality: "Gurugram",
      addressRegion: "Haryana",
      postalCode: "122001",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 28.4089,
      longitude: 77.0424,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "09:00",
        closes: "19:00",
      }
    ],
    sameAs: [
      "https://www.facebook.com/countryroof",
      "https://www.instagram.com/countryroof",
      "https://www.linkedin.com/company/countryroof",
    ],
  }
}

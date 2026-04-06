import type { Locale } from '$lib/i18n';

const SITE_URL = 'https://www.mp3-musica.com';
const SITE_NAME = 'mp3';

export function generateArticleSchema(
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  datePublished: string,
  dateModified: string,
  author: string = 'mp3 Editorial',
  lang: Locale = 'es'
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image: imageUrl,
    url: `${SITE_URL}${url}`,
    author: {
      '@type': 'Organization',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.svg`
      }
    },
    datePublished,
    dateModified,
    inLanguage: lang,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}${url}`
    }
  });
}

export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  });
}

export function generateHowToSchema(
  title: string,
  description: string,
  steps: { text: string; image?: string }[],
  totalTime: string = 'PT1H'
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: title,
    description,
    totalTime,
    step: steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      text: step.text,
      image: step.image
    }))
  });
}

export function generateProductSchema(
  name: string,
  description: string,
  brand: string,
  price: number,
  priceCurrency: string = 'USD',
  imageUrl: string = '',
  ratingValue: number = 4.5,
  ratingCount: number = 100
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    brand: {
      '@type': 'Brand',
      name: brand
    },
    offers: {
      '@type': 'Offer',
      price,
      priceCurrency,
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue,
      ratingCount
    },
    image: imageUrl
  });
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[],
  lang: Locale = 'es'
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`
    })),
    inLanguage: lang
  });
}

export function generateOrganizationSchema(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: 'Music content platform - reviews, tutorials, courses and tools for musicians',
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@mp3.com',
      contactType: 'customer service'
    },
    sameAs: [
      'https://youtube.com/@mp3',
      'https://instagram.com/mp3',
      'https://twitter.com/mp3'
    ]
  });
}

export function generateWebSiteSchema(): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/{search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  });
}

export function generateSpeakableSchema(headline: string, summary: string): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description: summary,
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['.article-intro', 'h1']
    }
  });
}

export function generateReviewSchema(
  itemName: string,
  reviewBody: string,
  author: string,
  datePublished: string,
  ratingValue: number,
  bestRating: number = 5,
  worstRating: number = 1
): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': 'Product',
      name: itemName
    },
    reviewBody,
    author: {
      '@type': 'Organization',
      name: author
    },
    datePublished,
    reviewRating: {
      '@type': 'Rating',
      ratingValue,
      bestRating,
      worstRating
    }
  });
}

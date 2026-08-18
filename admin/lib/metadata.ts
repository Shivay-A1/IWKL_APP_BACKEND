import { Metadata } from 'next'

export function generateMetadata(title: string, description: string, path?: string): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://iwkl.com'
  const url = path ? `${baseUrl}${path}` : baseUrl

  return {
    title,
    description,
    keywords: ['IWKL', 'Indian Wrestling League', 'Kabaddi League', 'Sports', 'Wrestling', 'Kabaddi'],
    authors: [{ name: 'IWKL' }],
    creator: 'IWKL',
    publisher: 'IWKL',
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      title,
      description,
      siteName: 'IWKL',
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${baseUrl}/og-image.jpg`],
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
    alternates: {
      canonical: url,
    },
  }
}

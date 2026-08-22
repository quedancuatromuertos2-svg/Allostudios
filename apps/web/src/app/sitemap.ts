import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://allostudios.net'
  const now = new Date()

  return [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/tu-web`, lastModified: now, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${base}/afiliados`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/privacidad`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/terminos`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${base}/cookies`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
  ]
}

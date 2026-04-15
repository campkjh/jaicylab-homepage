import type { MetadataRoute } from 'next'

const BASE = 'https://jaicylab.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`,                              lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/about`,                         lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/estimate`,                      lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/guides`,                        lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE}/guides/apple-developer`,        lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/google-play`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/kakao-developers`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/naver-developers`,       lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/firebase`,               lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/naver-cloud`,            lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/guides/toss-payments`,          lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
  ]
}

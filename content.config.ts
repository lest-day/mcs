import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'news/**/*.md',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        version: z.string().optional(),
        important: z.boolean().default(false)
      })
    })
  }
})
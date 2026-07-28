import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'news/*.md',
      schema: z.object({
        title: z
          .string()
          .min(1)
          .describe('标题'),
        description: z
          .string()
          .optional()
          .describe('摘要'),
        date: z
          .string()
          .default(() => new Date().toISOString().split('T')[0])
          .describe('发布日期'),
        server_id: z
          .enum(['all', 'main', 'modded', 'creative', 'survival'])
          .default('all')
          .describe('区服'),
        news_type: z
          .enum(['announcement', 'update', 'event'])
          .default('announcement')
          .describe('资讯分类'),
        author: z
          .string()
          .default('管理员')
          .describe('发布者'),
        is_pinned: z
          .boolean()
          .default(false)
          .describe('置顶'),
      }),
    }),
  },
})
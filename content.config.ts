import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'news/*.md',
      schema: z.object({
        title: z
          .string({ required_error: '标题不能为空' })
          .min(1, '标题不能为空')
          .max(120, '标题过长')
          .describe('标题'),
        description: z
          .string()
          .max(100, '摘要不能超过 100 字')
          .optional()
          .describe('摘要'),
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, '日期格式应为 YYYY-MM-DD')
          .default(() => new Date().toISOString().split('T')[0])
          .describe('发布日期'),
        serverId: z
          .enum(['all', 'main', 'mod', 'build', 'old'])
          .default('all')
          .describe('区服'),
        type: z
          .enum(['announcement', 'update', 'event'])
          .default('announcement')
          .describe('类别'),
        author: z
          .string()
          .max(20)
          .default('管理员')
          .describe('发布者'),
        isPinned: z
          .boolean()
          .default(false)
          .describe('置顶'),
      }),
    }),
  },
})
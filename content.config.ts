import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    news: defineCollection({
      type: 'page',
      source: 'news/*.md',
      schema: z.object({
        title: z
          .string()
          .min(1, '标题不能为空')
          .describe('资讯标题（显示在列表与文章顶部）'),
        description: z
          .string()
          .optional()
          .describe('文章摘要（可选：用于列表页预览及 SEO 描述）'),
        date: z
          .string()
          .default(() => new Date().toISOString().split('T')[0])
          .describe('发布日期，格式如：2026-07-27'),
        serverId: z
          .enum(['all', 'main', 'modded', 'creative', 'survival'])
          .default('all')
          .describe('选择所属区服：all(全服)/main(主服)/modded(模组服) 等'),
        type: z
          .enum(['announcement', 'update', 'event'])
          .default('announcement')
          .describe('选择资讯分类：公告 / 更新 / 活动'),
        author: z
          .string()
          .default('管理员')
          .describe('发布者名称或 OP 昵称'),
        isPinned: z
          .boolean()
          .default(false)
          .describe('开启后该文章将在列表中强制置顶')
      })
    })
  }
})
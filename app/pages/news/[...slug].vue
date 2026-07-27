<template>
  <div id="news-detail-page" class="relative min-h-screen text-white selection:bg-emerald-500/30">
    
    <!-- ================= Background Layer (固定背景，跟随全站) ================= -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      <NuxtImg src="/photo/wallpaper/91fd2fe5-b82b-4f16-b65f-76f124383c12.jpg" alt="背景墙纸"
        class="w-full h-full object-cover object-center transform scale-105"
        preload />
      <div class="absolute inset-0 bg-radial from-transparent via-black/60 to-black/90"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50 backdrop-blur-[2px]"></div>
    </div>

    <!-- ================= Main Content Container (顶部自然流) ================= -->
    <main class="relative z-10 max-w-4xl mx-auto px-4 py-10 md:py-16 flex flex-col gap-6">
      
      <!-- 顶部返回导航栏 -->
      <div class="w-full flex items-center justify-between">
        <NuxtLink to="/news"
          class="inline-flex items-center gap-2 text-xs md:text-sm font-bold text-gray-300 hover:text-emerald-400 bg-black/40 hover:bg-black/60 border border-white/10 px-4 py-2 rounded-xl backdrop-blur-md transition-all duration-200 group shadow-lg">
          <i class="fa-solid fa-arrow-left text-xs group-hover:-translate-x-1 transition-transform"></i>
          <span>返回资讯列表</span>
        </NuxtLink>

        <!-- 极简面包屑 -->
        <div class="hidden sm:flex items-center gap-2 text-xs text-gray-400 font-medium">
          <NuxtLink to="/news" class="hover:text-gray-200 transition-colors">资讯</NuxtLink>
          <span class="text-gray-600">/</span>
          <span class="text-emerald-400 truncate max-w-[200px]">{{ page?.title || '详情' }}</span>
        </div>
      </div>

      <!-- 加载中 Skeleton -->
      <div v-if="pending" class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 w-full animate-pulse flex flex-col gap-6 shadow-2xl">
        <div class="h-6 bg-white/10 rounded-lg w-1/4"></div>
        <div class="h-10 bg-white/10 rounded-lg w-3/4"></div>
        <div class="h-px bg-white/10 w-full my-2"></div>
        <div class="space-y-4">
          <div class="h-4 bg-white/10 rounded w-full"></div>
          <div class="h-4 bg-white/10 rounded w-5/6"></div>
          <div class="h-4 bg-white/10 rounded w-4/6"></div>
        </div>
      </div>

      <!-- 文章主容器 -->
      <article v-else-if="page"
        class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-10 w-full shadow-2xl flex flex-col gap-8 text-left relative overflow-hidden">
        
        <!-- 置顶高亮细条 -->
        <div v-if="page.isPinned" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

        <!-- 1. Header 属性与标题区 -->
        <header class="flex flex-col gap-4 border-b border-white/10 pb-6 relative">
          <!-- 标签栏 -->
          <div class="flex items-center justify-between flex-wrap gap-2 text-xs text-gray-400">
            <div class="flex items-center gap-2">
              <!-- 所属区服 -->
              <span class="font-medium text-gray-200 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                <i :class="getServerIcon(page.serverId)" class="text-[11px] text-emerald-400"></i>
                {{ getServerName(page.serverId) }}
              </span>
              <!-- 文章分类 -->
              <span :class="getTypeMeta(page.type).color" class="font-bold bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                {{ getTypeMeta(page.type).label }}
              </span>
            </div>

            <!-- 时间与阅读估算 -->
            <div class="flex items-center gap-3 font-mono text-[11px] text-gray-400">
              <span class="flex items-center gap-1">
                <i class="fa-regular fa-clock text-[10px]"></i>
                {{ page.date }}
              </span>
              <span class="text-gray-600">•</span>
              <span class="flex items-center gap-1">
                <i class="fa-regular fa-eye text-[10px]"></i>
                约 {{ readTime }} 分钟阅读
              </span>
            </div>
          </div>

          <!-- 主标题 -->
          <h1 class="text-2xl md:text-4xl font-black text-white tracking-tight leading-tight">
            <i v-if="page.isPinned" class="fa-solid fa-thumbtack text-emerald-400 text-xl md:text-2xl mr-2" title="置顶"></i>
            <span>{{ page.title }}</span>
          </h1>

          <!-- 摘要引言（如果有 description） -->
          <p v-if="page.description || page.summary" class="text-sm md:text-base text-gray-300 leading-relaxed bg-white/5 border-l-2 border-emerald-500 p-3.5 rounded-r-xl">
            {{ page.description || page.summary }}
          </p>

          <!-- 作者栏 -->
          <div class="flex items-center justify-between pt-2 text-xs text-gray-400">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <i class="fa-regular fa-user text-[10px]"></i>
              </div>
              <span>发布者：<strong class="text-gray-200">{{ page.author || '管理员' }}</strong></span>
            </div>
          </div>
        </header>

        <!-- 2. Markdown 富文本渲染区 -->
        <main class="prose prose-invert max-w-none prose-emerald
          prose-headings:font-bold prose-headings:text-white prose-headings:tracking-tight
          prose-h1:text-2xl prose-h2:text-xl prose-h2:border-b prose-h2:border-white/10 prose-h2:pb-2
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-base
          prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
          prose-code:text-emerald-300 prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-black/60 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-2xl prose-pre:shadow-xl
          prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-xl prose-blockquote:text-gray-300
          prose-img:rounded-2xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl">
          <ContentRenderer :value="page" />
        </main>

        <!-- 3. 文章底部交互区 -->
        <footer class="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div class="flex items-center gap-2">
            <button @click="copyLink" class="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-2 rounded-xl text-gray-300 transition-colors">
              <i class="fa-regular fa-copy text-xs"></i>
              <span>{{ copied ? '已复制链接' : '复制页面链接' }}</span>
            </button>
          </div>
        </footer>

      </article>

      <!-- 4. 404 / 文章不存在 -->
      <div v-else
        class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-12 w-full text-center flex flex-col items-center justify-center gap-4 text-gray-400 shadow-2xl">
        <i class="fa-solid fa-file-circle-xmark text-5xl text-gray-600"></i>
        <div class="flex flex-col gap-1">
          <h2 class="text-xl font-bold text-white">未找到对应文章</h2>
          <p class="text-xs md:text-sm text-gray-400">该资讯可能已被删除，或访问路径不正确。</p>
        </div>
        <NuxtLink to="/news" class="mt-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl hover:bg-emerald-500/20 transition-all">
          返回资讯列表
        </NuxtLink>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import siteConfig from '@@/site.config'

const route = useRoute()
const copied = ref(false)

// 查询文章数据
const { data: page, pending } = await useAsyncData(route.path, async () => {
  if (typeof queryCollection === 'function') {
    return await queryCollection('news').path(route.path).first()
  } else if (typeof queryContent === 'function') {
    return await queryContent(route.path).findOne()
  }
  return null
})

// 分类字典
const TYPE_MAP = {
  announcement: { label: '公告', color: 'text-emerald-400' },
  update: { label: '更新', color: 'text-amber-400' },
  event: { label: '活动', color: 'text-purple-400' }
}

// 简单粗暴的阅读时长估算（基于字数）
const readTime = computed(() => {
  if (!page.value) return 1
  const text = JSON.stringify(page.value.body || '')
  return Math.max(1, Math.ceil(text.length / 400))
})

const getServerName = (serverId) => {
  const server = siteConfig.MC_SERVERS.find(s => s.id === serverId)
  return server ? (server.shortname || server.name) : '通用'
}

const getServerIcon = (serverId) => {
  const server = siteConfig.MC_SERVERS.find(s => s.id === serverId)
  return server ? server.icon : 'fa-solid fa-server'
}

const getTypeMeta = (type) => {
  return TYPE_MAP[type] || { label: '资讯', color: 'text-blue-400' }
}

// 复制链接功能
const copyLink = () => {
  if (process.client) {
    navigator.clipboard.writeText(window.location.href)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<style scoped>
::selection {
  background: rgba(16, 185, 129, 0.3);
}
</style>
<template>
  <section id="news-page" class="relative min-h-screen text-white px-4 selection:bg-emerald-500/30">

    <div class="fixed inset-0 overflow-hidden pointer-events-none select-none z-0">
      <NuxtImg src="/photo/wallpaper/91fd2fe5-b82b-4f16-b65f-76f124383c12.jpg"
        class="w-full h-full object-cover object-center transform scale-105" preload />
      <div class="absolute inset-0 bg-radial from-transparent via-black/60 to-black/90"></div>
      <div class="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/50 backdrop-blur-[2px]"></div>
    </div>

    <div class="relative z-10 max-w-5xl mx-auto py-10 md:py-16 flex flex-col gap-6">

      <header class="flex items-center gap-4 w-full px-2 py-2">
        <div class="shrink-0">
          <div
            class="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center text-emerald-400 shadow-lg backdrop-blur-md">
            <i class="fa-solid fa-newspaper text-xl md:text-2xl"></i>
          </div>
        </div>
        <div class="flex flex-col text-left">
          <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow">
            新闻公告
          </h1>
        </div>
      </header>

      <section class="grid grid-cols-2 md:grid-cols-4 gap-3.5 w-full">
        <button @click="selectedServer = 'all'" :class="[
          'cursor-pointer relative overflow-hidden rounded-2xl p-3.5 border transition-all duration-300 backdrop-blur-xl flex items-center justify-between group select-none text-left',
          selectedServer === 'all'
            ? 'bg-black/70 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50 scale-[1.01]'
            : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50'
        ]">
          <div class="flex items-center gap-2.5 min-w-0">
            <i
              :class="['fa-solid fa-server', selectedServer === 'all' ? 'text-emerald-400' : 'text-gray-400', 'text-base shrink-0']"></i>
            <span
              :class="selectedServer === 'all' ? 'font-bold text-sm text-white' : 'font-bold text-sm text-gray-400 group-hover:text-white'">
              全部区服
            </span>
          </div>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {{ allNewsList.length }}
          </span>
        </button>

        <button v-for="server in siteConfig.MC_SERVERS" :key="server.id" @click="selectedServer = server.id" :class="[
          'cursor-pointer relative overflow-hidden rounded-2xl p-3.5 border transition-all duration-300 backdrop-blur-xl flex items-center justify-between group select-none text-left',
          selectedServer === server.id
            ? 'bg-black/70 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50 scale-[1.01]'
            : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50'
        ]">
          <div class="flex items-center gap-2.5 min-w-0">
            <i
              :class="[server.icon, selectedServer === server.id ? 'text-emerald-400' : 'text-gray-400', 'text-base shrink-0']"></i>
            <span
              :class="selectedServer === server.id ? 'font-bold text-sm text-white' : 'font-bold text-sm text-gray-400 group-hover:text-white'"
              class="truncate">
              {{ server.shortname || server.name }}
            </span>
          </div>
          <span class="text-xs font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-400">
            {{ getServerNewsCount(server.id) }}
          </span>
        </button>
      </section>

      <main class="flex flex-col gap-4 w-full">
        <div
          class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col w-full min-h-[420px] shadow-2xl">

          <div class="flex items-center justify-between border-b border-white/5 pb-3.5 mb-4 flex-wrap gap-2">
            <div class="flex items-center gap-1.5">
              <button v-for="(info, key) in filterOptions" :key="key" @click="selectedType = key" :class="[
                'text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer',
                selectedType === key
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'bg-transparent text-gray-400 hover:text-gray-200'
              ]">
                {{ info.label }}
              </button>
            </div>
          </div>

          <div v-if="pending" class="flex flex-col gap-3">
            <div v-for="i in 3" :key="i" class="p-5 bg-black/20 rounded-2xl animate-pulse border border-white/5 h-28">
            </div>
          </div>

          <div v-else-if="filteredNews.length > 0"
            class="flex flex-col gap-3.5 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            <NuxtLink v-for="item in filteredNews" :key="item._path || item.path" :to="item._path || item.path"
              class="group cursor-pointer bg-black/30 hover:bg-black/50 border border-white/5 hover:border-emerald-500/40 rounded-2xl p-4 md:p-5 transition-all duration-300 shadow-sm flex flex-col gap-2.5 relative overflow-hidden">

              <div v-if="checkIsPinned(item)" class="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>

              <div class="flex items-center justify-between text-xs text-gray-400">
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-300 flex items-center gap-1.5">
                    <i :class="getServerIcon(item.serverId)" class="text-[11px] text-gray-400"></i>
                    {{ getServerName(item.serverId) }}
                  </span>
                  <span class="text-gray-600">•</span>
                  <span :class="getTypeMeta(item.type).color" class="font-bold">
                    {{ getTypeMeta(item.type).label }}
                  </span>
                </div>
                <time class="font-mono text-[11px] text-gray-500">{{ item.date }}</time>
              </div>

              <h3
                class="font-bold text-base md:text-lg text-white group-hover:text-emerald-300 transition-colors flex items-center gap-2 flex-wrap">
                <span v-if="checkIsPinned(item)"
                  class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md shrink-0 shadow-sm">
                  <i class="fa-solid fa-thumbtack text-[10px]"></i>
                  置顶
                </span>
                <span>{{ item.title }}</span>
              </h3>

              <p class="text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">
                {{ item.description || item.summary }}
              </p>

              <div class="flex items-center justify-between pt-1 text-xs text-gray-500">
                <span class="flex items-center gap-1.5">
                  <i class="fa-regular fa-user text-[11px]"></i>
                  {{ item.author || '管理员' }}
                </span>
                <span
                  class="group-hover:translate-x-1 transition-transform flex items-center gap-1 text-emerald-400 font-bold">
                  阅读全文 <i class="fa-solid fa-arrow-right text-[10px]"></i>
                </span>
              </div>
            </NuxtLink>
          </div>

          <div v-else class="h-64 flex flex-col items-center justify-center text-gray-400">
            <i class="fa-solid fa-box-open text-4xl mb-3 text-gray-600 animate-pulse"></i>
            <p class="text-xs md:text-sm">该区服或分类下暂无相关资讯</p>
          </div>

        </div>
      </main>

    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import siteConfig from '@@/site.config'

const selectedServer = ref('all')
const selectedType = ref('all')

const TYPE_MAP = {
  announcement: { label: '公告', color: 'text-emerald-400' },
  update: { label: '更新', color: 'text-amber-400' },
  event: { label: '活动', color: 'text-purple-400' }
}

const filterOptions = computed(() => ({
  all: { label: '全部分类' },
  ...TYPE_MAP
}))

// 数据查询与兼容性封装
const { data: newsData, pending } = await useAsyncData('news-content-list', async () => {
  if (typeof queryCollection === 'function') {
    return await queryCollection('news').all()
  } else if (typeof queryContent === 'function') {
    return await queryContent('/news').find()
  }
  return []
})

const allNewsList = computed(() => newsData.value || [])

// 判断是否置顶辅助函数（兼容多种类型）
const checkIsPinned = (item) => {
  return item?.isPinned === true || item?.isPinned === 'true' || item?.isPinned === 1
}

// 严谨的筛选与置顶优先排序
const filteredNews = computed(() => {
  if (!allNewsList.value) return []

  return allNewsList.value
    .filter(item => {
      // 兼容字符串前后空格与大小写问题
      const itemServer = String(item.serverId || '').trim().toLowerCase()
      const targetServer = String(selectedServer.value).trim().toLowerCase()
      const matchServer = targetServer === 'all' || itemServer === targetServer

      const itemType = String(item.type || '').trim().toLowerCase()
      const targetType = String(selectedType.value).trim().toLowerCase()
      const matchType = targetType === 'all' || itemType === targetType

      return matchServer && matchType
    })
    .sort((a, b) => {
      const aPinned = checkIsPinned(a) ? 1 : 0
      const bPinned = checkIsPinned(b) ? 1 : 0

      // 1. 置顶优先
      if (aPinned !== bPinned) {
        return bPinned - aPinned
      }

      // 2. 按日期倒序 (最新的在上面)
      const dateA = a.date ? new Date(a.date).getTime() : 0
      const dateB = b.date ? new Date(b.date).getTime() : 0
      return dateB - dateA
    })
})

const getServerNewsCount = (serverId) => {
  const target = String(serverId).trim().toLowerCase()
  return allNewsList.value.filter(n => String(n.serverId || '').trim().toLowerCase() === target).length
}

const getServerName = (serverId) => {
  const server = siteConfig.MC_SERVERS.find(s => String(s.id).toLowerCase() === String(serverId).toLowerCase())
  return server ? (server.shortname || server.name) : '通用'
}

const getServerIcon = (serverId) => {
  const server = siteConfig.MC_SERVERS.find(s => String(s.id).toLowerCase() === String(serverId).toLowerCase())
  return server ? server.icon : 'fa-solid fa-server'
}

const getTypeMeta = (type) => {
  return TYPE_MAP[type] || { label: '资讯', color: 'text-blue-400' }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(16, 185, 129, 0.4);
}
</style>
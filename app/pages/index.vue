<template>
  <section id="hero" class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-hidden">
    <NuxtImg src="/photo/wallpaper/18ba3525-9f0b-4e1c-baad-c01185236e38.jpg"
      class="absolute inset-0 w-full h-full object-cover" preload />
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>

    <div class="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 max-w-7xl w-full px-6 py-20">
      <div class="shrink-0 flex-none">
        <NuxtImg src="/logo_radius.png" alt="图标"
          class="w-40 h-40 lg:w-44 lg:h-44 rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105 border border-white/10 object-cover" />
      </div>

      <div class="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
        <h1 class="text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-lg">
          {{ siteConfig.SITE_NAME }}
        </h1>

        <div class="mt-8 flex flex-col lg:flex-row items-stretch lg:items-start gap-4 w-full lg:w-auto">
          <div
            class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 min-w-[300px] break-all leading-snug">
            <div class="text-left flex-1">
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                主服地址
              </p>
              <p class="text-sm font-mono text-gray-100 mt-1 select-all overflow-auto break-all h-[3ch]">
                {{ mainServer.ip }}:{{ mainServer.port }}
              </p>
            </div>
            <button @click="copyIp"
              class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
              <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'
                "></i>
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>

          <div
            class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">
            <div class="relative flex h-3.5 w-3.5 ml-1">
              <span :class="overallStatusClass.bgPing
                " class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
              <span :class="overallStatusClass.bgSolid
                " class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white/10"></span>
            </div>

            <div class="text-left flex-1">
              <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                {{ loading ? '正在连接...' : '全区在线' }}
              </p>
              <div class="text-sm font-bold text-gray-100 mt-1">
                <template v-if="loading">
                  <span class="text-gray-400 font-normal text-xs animate-pulse">获取中...</span>
                </template>
                <template v-else>
                  {{ totalOnline }} <span class="text-xs text-gray-400 font-normal">/ {{ totalMax }} 人</span>
                </template>
              </div>
            </div>

            <div v-if="!loading && mergedPlayers.length > 0" class="flex -space-x-3 overflow-hidden ml-auto">
              <div v-for="(player, index) in mergedPlayers.slice(0, 3)" :key="player.id || player.name"
                :class="getAvatarBg(index)"
                class="relative inline-block h-8 w-8 rounded-full ring-2 ring-black/50 flex items-center justify-center text-[11px] font-sans font-black uppercase overflow-hidden shadow-inner shadow-black/20"
                :title="player.name">
                <span
                  class="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] select-none">
                  {{ player.name ? player.name[0] : '?' }}
                </span>
              </div>

              <div v-if="totalOnline > 3"
                class="shrink-0 flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-black/50 bg-gray-800 text-[10px] text-gray-200 font-bold z-20 shadow-md select-none">
                +{{ totalOnline - 3 }}
              </div>
            </div>
          </div>
        </div>

        <div v-if="!loading" class="mt-4 flex flex-wrap gap-2 justify-center lg:justify-start">
          <div v-for="s in serversStatus" :key="s.id" class="text-[11px] px-2 py-1 rounded-lg border"
            :class="s.online ? 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' : 'border-rose-500/30 text-rose-300 bg-rose-500/10'">
            <i :class="s.icon"></i> {{ s.shortname || s.name }}
            {{ s.online ? `· ${s.onlineCount} 在线` : '· 离线' }}
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import siteConfig from '@@/site.config'

/** 子服列表 */
const servers = siteConfig.MC_SERVERS || []

/** 主服（优先 id=main，兜底旧字段） */
const mainServer = computed(() => {
  return (
    servers.find(s => s.id === 'main') || {
      ip: siteConfig.MC_SERVER_IP,
      port: siteConfig.MC_SERVER_PORT
    }
  )
})

/** 每个子服状态 */
const serversStatus = ref([])
const loading = ref(true)
const copied = ref(false)

/** 并发拉取所有子服状态 */
const fetchAllServers = async () => {
  const statusApiTpl = siteConfig.API_ENDPOINTS?.SERVER_STATUS

  const results = await Promise.allSettled(
    servers.map(async s => {
      try {
        const url = statusApiTpl
          .replace('{ip}', s.ip)
          .replace('{port}', s.port)

        const res = await $fetch(url, {
          headers: { Accept: 'application/json' }
        })
        const info = res?.info || res?.data || res
        const online = !!(
          res?.status === 'success' ||
          res?.status === true ||
          res?.status === 200 ||
          res?.online
        )
        return {
          id: s.id,
          name: s.name,
          shortname: s.shortname,
          icon: s.icon,
          online,
          onlineCount: info?.players?.online ?? 0,
          maxCount: info?.players?.max ?? 0,
          players: info?.players?.sample || info?.players?.list || []
        }
      } catch {
        return {
          id: s.id,
          name: s.name,
          shortname: s.shortname,
          icon: s.icon,
          online: false,
          onlineCount: 0,
          maxCount: 0,
          players: []
        }
      }
    })
  )

  serversStatus.value = results.map(r => r.value)
  loading.value = false
}

onMounted(fetchAllServers)

/** 全区在线 / 最大 */
const totalOnline = computed(() =>
  serversStatus.value.reduce((sum, s) => sum + s.onlineCount, 0)
)
const totalMax = computed(() =>
  serversStatus.value.reduce((sum, s) => sum + s.maxCount, 0)
)

/** 合并所有子服玩家（去重靠 name，前 3 给头像） */
const mergedPlayers = computed(() =>
  Array.from(
    new Map(
      serversStatus.value.flatMap(s => s.players.map(p => [p.name, p]))
    ).values()
  )
)

/**
 * 子服整体状态灯：
 * - 全离线 → 红
 * - 全在线 → 绿
 * - 部分在线 → 黄
 */
const overallStatusClass = computed(() => {
  if (serversStatus.value.length === 0) {
    return {
      bgPing: 'bg-amber-400 animate-ping',
      bgSolid: 'bg-amber-500'
    }
  }
  const onlineCount = serversStatus.value.filter(s => s.online).length
  const total = serversStatus.value.length

  if (onlineCount === 0) {
    return {
      bgPing: 'bg-rose-400 animate-ping',
      bgSolid: 'bg-rose-500'
    }
  }
  if (onlineCount === total) {
    return {
      bgPing: 'bg-emerald-400 animate-ping',
      bgSolid: 'bg-emerald-500'
    }
  }
  return {
    bgPing: 'bg-amber-400 animate-ping',
    bgSolid: 'bg-amber-500'
  }
})

/** 头像配色（不变） */
const getAvatarBg = index => {
  const bgs = [
    'bg-gradient-to-br from-emerald-600 to-teal-800',
    'bg-gradient-to-br from-blue-600 to-indigo-800',
    'bg-gradient-to-br from-amber-500 to-orange-700',
    'bg-gradient-to-br from-purple-600 to-pink-700',
    'bg-gradient-to-br from-rose-600 to-red-800',
    'bg-gradient-to-br from-cyan-500 to-blue-700',
    'bg-gradient-to-br from-fuchsia-600 to-purple-900',
    'bg-gradient-to-br from-lime-500 to-emerald-700',
    'bg-gradient-to-br from-sky-500 to-indigo-700',
    'bg-gradient-to-br from-amber-600 to-yellow-800'
  ]
  return bgs[index % bgs.length]
}

/** 复制主服地址 */
const copyIp = async () => {
  const full = `${mainServer.value.ip}:${mainServer.value.port}`
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(full)
    } else {
      const ta = document.createElement('textarea')
      ta.value = full
      ta.style.position = 'absolute'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('复制失败', e)
  }
}
</script>
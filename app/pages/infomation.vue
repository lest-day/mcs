<template>
  <section id="server-dashboard"
    class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-y-auto py-10 md:py-16 selection:bg-emerald-500/30">
    <!-- 背景图及遮罩 -->
    <NuxtImg src="/photo/wallpaper/91fd2fe5-b82b-4f16-b65f-76f124383c12.jpg" alt="服务器背景墙纸"
      class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" preload />
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 backdrop-blur-[2px]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center max-w-5xl w-full gap-5 px-2 md:px-6">

      <!-- 1. 最顶层：品牌 Header 与 全局聚合数据 -->
      <header
        class="flex flex-col sm:flex-row items-center justify-between gap-5 w-full bg-black/40 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-3xl shadow-2xl">
        <div class="flex items-center gap-4 text-left">
          <div class="shrink-0 relative group">
            <NuxtImg src="/logo_radius.png" alt="服务器图标"
              class="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 border border-white/15 object-cover" />
          </div>
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow">
              {{ siteConfig.SITE_NAME || 'Minecraft Server' }}
            </h1>
            <p class="text-xs md:text-sm text-gray-300 font-medium">
              亲友生存，发展建造
            </p>
          </div>
        </div>

        <!-- 聚合状态指标 -->
        <div class="flex items-center gap-3">
          <div class="bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <i class="fa-solid fa-users text-emerald-400 text-sm"></i>
            <div class="text-left">
              <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">总在线</p>
              <p class="text-sm font-black font-mono text-gray-200">
                {{ isInitialLoading ? '--' : `${totalOnlinePlayers} 人` }}
              </p>
            </div>
          </div>

          <div class="bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl flex items-center gap-3">
            <i class="fa-solid fa-server text-blue-400 text-sm"></i>
            <div class="text-left">
              <p class="text-[11px] text-gray-400 font-bold uppercase tracking-wider">子服状态</p>
              <p class="text-sm font-black font-mono text-gray-200">
                {{ isInitialLoading ? '--' : `${onlineServerCount} / ${serverList.length} 在线` }}
              </p>
            </div>
          </div>

          <button @click="fetchAllServers" :disabled="loading"
            class="w-10 h-10 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:border-white/20 disabled:opacity-40 active:scale-95 transition-all shadow-sm shrink-0"
            title="刷新数据">
            <i
              :class="loading ? 'fa-solid fa-spinner animate-spin text-gray-200 text-sm' : 'fa-solid fa-rotate text-sm'"></i>
          </button>
        </div>
      </header>

      <!-- 2. 中层：服务器切换 Tabs 卡片网格 -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-3.5 w-full">
        <div v-for="(server, index) in serverList" :key="server.id" @click="switchServer(index)" :class="[
          'cursor-pointer relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 backdrop-blur-xl flex items-center justify-between group select-none',
          currentServerIndex === index
            ? 'bg-black/70 border-emerald-500/80 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/50 scale-[1.01]'
            : 'bg-black/30 border-white/10 hover:border-white/20 hover:bg-black/50'
        ]">
          <div class="flex items-center gap-2.5 min-w-0">
            <i :class="[server.icon, currentServerIndex === index ? 'text-emerald-400' : 'text-gray-400']"
              class="text-base shrink-0"></i>
            <span class="font-bold text-base text-gray-100 truncate">{{ server.name }}</span>
          </div>
          <span :class="server.tagClass"
            class="text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 border border-white/5 ml-2">
            {{ server.tag }}
          </span>
        </div>
      </section>

      <!-- 3. 下层：全宽一体化控制台 -->
      <main class="flex flex-col gap-4 w-full">
        <!-- 核心 IP 与架构参数面板 -->
        <section
          class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <!-- 左侧：IP地址 + 复制按钮 -->
          <div
            class="flex items-center justify-between gap-3 w-full md:w-auto bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl">
            <div class="flex items-center gap-3 min-w-0">
              <span class="flex h-2.5 w-2.5 relative shrink-0">
                <span :class="{
                  'bg-amber-400 animate-ping': currentServerState === 'LOADING',
                  'bg-emerald-400 animate-ping': currentServerState === 'ONLINE',
                  'bg-rose-400': currentServerState === 'OFFLINE'
                }" class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                <span :class="{
                  'bg-amber-500': currentServerState === 'LOADING',
                  'bg-emerald-500': currentServerState === 'ONLINE',
                  'bg-rose-500': currentServerState === 'OFFLINE'
                }" class="relative inline-flex rounded-full h-2.5 w-2.5"></span>
              </span>
              <span class="text-sm font-mono text-emerald-300 font-bold select-all truncate">{{ fullServerAddress
                }}</span>
            </div>
            <button @click="copyIp"
              class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5">
              <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>

          <!-- 右侧：指标标签 (状态 / 架构 / 版本) -->
          <div class="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-xs flex-wrap">
            <!-- 状态标签 -->
            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span class="text-gray-400 text-xs uppercase font-bold">STATUS</span>
              <span class="font-bold font-mono text-xs" :class="{
                'text-amber-400': currentServerState === 'LOADING',
                'text-emerald-400': currentServerState === 'ONLINE',
                'text-rose-400': currentServerState === 'OFFLINE'
              }">
                <template v-if="currentServerState === 'LOADING'">CHECKING</template>
                <template v-else-if="currentServerState === 'ONLINE'">ONLINE</template>
                <template v-else>OFFLINE</template>
              </span>
            </div>

            <!-- 服务端架构 -->
            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <i class="fa-solid fa-box-open text-orange-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase font-bold">SOFTWARE</span>
              <span class="font-bold font-mono text-gray-200 text-xs truncate max-w-[120px]" :title="softwareName">
                {{ currentServerState === 'LOADING' ? '--' : (currentServerState === 'ONLINE' ? softwareName : 'N/A') }}
              </span>
            </div>

            <!-- 版本 -->
            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <i class="fa-solid fa-code-branch text-blue-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase font-bold">VERSION</span>
              <span class="font-bold font-mono text-gray-200 text-xs truncate max-w-[120px]" :title="versionName">
                {{ currentServerState === 'LOADING' ? '--' : (currentServerState === 'ONLINE' ? versionName : 'N/A') }}
              </span>
            </div>
          </div>
        </section>

        <!-- 实时在线玩家列表区 -->
        <section
          class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col w-full min-h-[280px] shadow-2xl">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/5 pb-3.5">
            <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <i class="fa-solid fa-circle-user text-emerald-400 text-sm"></i>
              <span>{{ currentServer.name }} - 在线玩家 ( {{ currentServerState === 'LOADING' ? '0' : onlinePlayersCount }}
                / {{
                  currentServerState === 'LOADING' ? '0' : maxPlayersCount }} )</span>
            </h2>
            <div
              class="font-mono text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-md border border-white/5 self-start sm:self-auto">
              同步时间: {{ lastUpdatedText }}
            </div>
          </div>

          <!-- 玩家列表网格 -->
          <div class="flex-1 overflow-y-auto max-h-[320px] pr-1 custom-scrollbar">
            <!-- 加载状态：骨架屏 -->
            <template v-if="currentServerState === 'LOADING'">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="i in 6" :key="i"
                  class="flex items-center gap-3 p-3.5 bg-black/20 rounded-xl animate-pulse border border-white/5">
                  <div class="w-9 h-9 bg-white/10 rounded-lg"></div>
                  <div class="h-4 bg-white/10 rounded w-24"></div>
                </div>
              </div>
            </template>

            <!-- 在线玩家卡片网格 -->
            <template v-else-if="currentServerState === 'ONLINE' && playersList.length > 0">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-0.5">
                <div v-for="(player, index) in playersList" :key="getPlayerKey(player, index)"
                  class="flex items-center justify-between p-3 bg-black/30 border border-white/5 hover:border-emerald-500/40 rounded-xl shadow-sm hover:bg-black/50 transition-all duration-200 group">
                  <div class="flex items-center gap-3 min-w-0">
                    <div
                      class="shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative bg-black/50">
                      <img v-if="!avatarErrorMap[getPlayerKey(player, index)]" :src="getAvatarUrl(player)"
                        :alt="getPlayerName(player)" class="w-full h-full object-cover z-10 relative"
                        @error="() => handleAvatarError(getPlayerKey(player, index))" />
                      <div :class="getAvatarBg(index)"
                        class="absolute inset-0 flex items-center justify-center text-xs font-black uppercase text-white shadow-inner select-none">
                        {{ getPlayerName(player) ? getPlayerName(player)[0] : '?' }}
                      </div>
                    </div>

                    <span
                      class="font-mono text-xs md:text-sm text-gray-200 group-hover:text-emerald-400 transition-colors truncate">
                      {{ getPlayerName(player) }}
                    </span>
                  </div>

                  <span v-if="isStaff(getPlayerName(player))"
                    class="text-xs font-medium tracking-tight px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded select-none font-sans shrink-0 ml-2">
                    管理
                  </span>
                </div>
              </div>
            </template>

            <!-- 无在线玩家/真实离线状态 -->
            <template v-else>
              <div class="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
                <i class="fa-solid fa-ghost text-4xl mb-3 text-gray-600 animate-bounce"></i>
                <p class="text-xs md:text-sm tracking-wide">
                  {{ currentServerState === 'ONLINE' ? '四周寂静无声，当前子服暂无在线玩家' : '服务器可能正在打盹（离线中）' }}
                </p>
              </div>
            </template>
          </div>
        </section>
      </main>

    </div>
  </section>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import siteConfig from '@@/site.config'

const INITIAL_SERVERS = [
  {
    id: 'main',
    name: '主服',
    ip: 'mc.r55770545.nyat.app',
    port: siteConfig.MC_SERVER_PORT || 61482,
    tag: '核心主服',
    tagClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    icon: 'fa-solid fa-server'
  },
  {
    id: 'survival',
    name: '生存与建造服',
    ip: 'play.simpfun.cn',
    port: 19532,
    tag: '纯净生存',
    tagClass: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    icon: 'fa-solid fa-cubes'
  },
  {
    id: 'classic',
    name: '怀旧服',
    ip: 'free-c1.tudouai.cn',
    port: 20005,
    tag: '经典复古',
    tagClass: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    icon: 'fa-solid fa-clock-rotate-left'
  }
]

const serverList = ref(INITIAL_SERVERS)
const currentServerIndex = ref(0)
const currentServer = computed(() => serverList.value[currentServerIndex.value] || serverList.value[0])

const serverStatuses = reactive({})
const avatarErrorMap = reactive({})

const loading = ref(true)
const hasLoadedOnce = ref(false)
const copied = ref(false)
const lastUpdated = ref(null)

let timer = null
let copyTimer = null

const isInitialLoading = computed(() => loading.value && !hasLoadedOnce.value)

const getServerFullAddress = (server) => {
  return Number(server.port) === 25565 ? server.ip : `${server.ip}:${server.port}`
}

const fullServerAddress = computed(() => getServerFullAddress(currentServer.value))

const switchServer = (index) => {
  currentServerIndex.value = index
}

const getServerOnlineState = (serverId) => {
  const res = serverStatuses[serverId]
  if (!res) {
    return isInitialLoading.value || loading.value ? 'LOADING' : 'OFFLINE'
  }

  if (typeof res.online === 'boolean') {
    return res.online ? 'ONLINE' : 'OFFLINE'
  }

  const status = res.status
  const isOk = status === 'success' || status === true || status === 200
  return isOk ? 'ONLINE' : 'OFFLINE'
}

const currentServerState = computed(() => getServerOnlineState(currentServer.value.id))

const getServerOnlineCount = (serverId) => {
  const res = serverStatuses[serverId]
  if (!res) return 0
  const info = res.info || res.data || res
  return Number(info?.players?.online) || 0
}

const totalOnlinePlayers = computed(() => {
  return serverList.value.reduce((acc, server) => {
    return acc + getServerOnlineCount(server.id)
  }, 0)
})

const onlineServerCount = computed(() => {
  return serverList.value.filter(server => getServerOnlineState(server.id) === 'ONLINE').length
})

const isStaff = (name) => {
  if (!name || !Array.isArray(siteConfig.MC_SERVER_STAFF)) return false
  return siteConfig.MC_SERVER_STAFF.some(
    staffName => staffName && String(staffName).toLowerCase() === String(name).toLowerCase()
  )
}

const currentRawStatus = computed(() => serverStatuses[currentServer.value.id])

const infoData = computed(() => {
  if (!currentRawStatus.value) return null
  return currentRawStatus.value.info || currentRawStatus.value.data || currentRawStatus.value
})

const onlinePlayersCount = computed(() => Number(infoData.value?.players?.online) || 0)
const maxPlayersCount = computed(() => Number(infoData.value?.players?.max) || 0)

const playersList = computed(() => {
  const list = infoData.value?.players?.sample || infoData.value?.players?.list || []
  return Array.isArray(list) ? list : []
})

const fullVersionStr = computed(() => String(infoData.value?.version?.name || ''))

const softwareName = computed(() => {
  const str = fullVersionStr.value.trim()
  if (!str) return 'Minecraft'
  if (str.includes(' ')) return str.split(' ')[0]
  return 'Minecraft'
})

const versionName = computed(() => {
  const str = fullVersionStr.value.trim()
  if (!str) return '1.21.x'
  if (str.includes(' ')) return str.split(' ').slice(1).join(' ')
  return str
})

const getPlayerName = (player) => {
  if (typeof player === 'string') return player
  return player?.name || player?.username || '未知玩家'
}

const getPlayerUuid = (player) => {
  const id = player?.id || player?.uuid
  if (typeof id === 'string') {
    return id.replace(/-/g, '')
  }
  return null
}

const getPlayerKey = (player, index) => {
  return getPlayerUuid(player) || `${getPlayerName(player)}-${index}`
}

const getAvatarUrl = (player) => {
  const uuid = getPlayerUuid(player)
  const name = getPlayerName(player)

  if (uuid) {
    return `https://api.mineatar.io/face/${uuid}?size=36&default=MHF_Steve`
  }
  return `https://mc-heads.net/avatar/${encodeURIComponent(name)}/36`
}

const handleAvatarError = (key) => {
  avatarErrorMap[key] = true
}

const fetchAllServers = async () => {
  loading.value = true
  try {
    const promises = serverList.value.map(async (server) => {
      let timeoutId
      try {
        const targetUrl = `https://api.hanximeng.com/mc/?server_addr=${server.ip}&server_port=${server.port}`

        const controller = new AbortController()
        timeoutId = setTimeout(() => controller.abort(), 8000)

        const res = await $fetch(targetUrl, {
          method: 'GET',
          headers: { 'Accept': 'application/json' },
          signal: controller.signal
        })

        serverStatuses[server.id] = res
      } catch (err) {
        console.warn(`[MC Dashboard] 获取服务器 ${server.name} 状态失败:`, err?.message || err)
        serverStatuses[server.id] = { status: 'error', online: false }
      } finally {
        if (timeoutId) clearTimeout(timeoutId)
      }
    })

    await Promise.all(promises)
    lastUpdated.value = new Date()
  } finally {
    loading.value = false
    hasLoadedOnce.value = true
  }
}

onMounted(() => {
  fetchAllServers()
  timer = setInterval(fetchAllServers, 60000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
  if (copyTimer) clearTimeout(copyTimer)
})

const lastUpdatedText = computed(() => {
  if (!lastUpdated.value) return '00:00:00'
  return lastUpdated.value.toTimeString().split(' ')[0]
})

const getAvatarBg = (index) => {
  const bgs = [
    'bg-gradient-to-br from-emerald-600 to-teal-800',  // 翡翠绿 (Emerald)
    'bg-gradient-to-br from-blue-600 to-indigo-800',   // 深邃蓝 (Lapis)
    'bg-gradient-to-br from-amber-500 to-orange-700',  // 温暖橙 (Gold/Copper)
    'bg-gradient-to-br from-purple-600 to-pink-700',   // 紫罗兰 (Amethyst)
    'bg-gradient-to-br from-rose-600 to-red-800',      // 红石赤 (Redstone)
    'bg-gradient-to-br from-cyan-500 to-blue-700',     // 钻石青 (Diamond)
    'bg-gradient-to-br from-fuchsia-600 to-purple-900',// 迷幻紫 (Nether Portal)
    'bg-gradient-to-br from-lime-500 to-emerald-700',  // 苔藓绿 (Moss)
    'bg-gradient-to-br from-sky-500 to-indigo-700',    // 冰霜蓝 (Ice)
    'bg-gradient-to-br from-amber-600 to-yellow-800'   // 烈焰黄 (Blaze)
  ]
  return bgs[index % bgs.length]
}

const copyIp = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fullServerAddress.value)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = fullServerAddress.value
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => { copied.value = false }, 2000)
  } catch (err) {
    console.error('复制失败', err)
  }
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}
</style>
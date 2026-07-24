<template>
  <section id="server-dashboard"
    class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-y-auto py-10 md:py-16 selection:bg-emerald-500/30">
    <!-- 背景图及遮罩 -->
    <NuxtImg src="/photo/wallpaper/91fd2fe5-b82b-4f16-b65f-76f124383c12.jpg" alt="服务器背景墙纸"
      class="absolute inset-0 w-full h-full object-cover select-none pointer-events-none" preload />
    <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/80 to-black/60 backdrop-blur-[2px]"></div>

    <div class="relative z-10 flex flex-col items-center justify-center max-w-5xl w-full gap-5 px-2 md:px-6">

      <!-- 1. 品牌 Header -->
      <header
        class="flex flex-col sm:flex-row items-center justify-between gap-5 w-full bg-black/40 backdrop-blur-xl border border-white/10 p-5 md:p-6 rounded-3xl shadow-2xl">
        <div class="flex items-center gap-4 text-left">
          <div class="shrink-0 relative group">
            <NuxtImg src="/logo_radius.png" alt="服务器图标"
              class="w-14 h-14 md:w-16 md:h-16 rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 border border-white/15 object-cover" />
          </div>
          <div class="flex flex-col gap-0.5">
            <h1 class="text-2xl md:text-3xl font-black tracking-tight text-white drop-shadow">
              {{ siteConfig.SITE_NAME }}
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

      <!-- 2. 服务器 Tabs -->
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

      <!-- 3. 一体化控制台 -->
      <main class="flex flex-col gap-4 w-full">
        <!-- IP + 参数面板 -->
        <section
          class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
          <div
            class="flex items-center justify-between gap-3 w-full md:w-auto bg-black/50 border border-white/10 px-4 py-2.5 rounded-xl">
            <div class="flex items-center gap-3 min-w-0">
              <span class="flex h-2.5 w-2.5 relative shrink-0">
                <span :class="statusPingColor" class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                <span :class="statusDotColor" class="relative inline-flex rounded-full h-2.5 w-2.5"></span>
              </span>
              <span class="text-sm font-mono text-emerald-300 font-bold select-all truncate">
                {{ fullServerAddress }}
              </span>
            </div>
            <button @click="copyIp"
              class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg transition-all shadow-md shadow-emerald-950/40 flex items-center gap-1.5">
              <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
              <span>{{ copied ? '已复制' : '复制' }}</span>
            </button>
          </div>

          <div class="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end text-xs flex-wrap">
            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <span class="text-gray-400 text-xs uppercase font-bold">STATUS</span>
              <span class="font-bold font-mono text-xs" :class="statusTextColor">
                {{ statusLabel }}
              </span>
            </div>

            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <i class="fa-solid fa-box-open text-orange-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase font-bold">CORE</span>
              <span class="font-bold font-mono text-gray-200 text-xs truncate max-w-[120px]" :title="softwareName">
                {{ currentServerState === SERVER_STATE.ONLINE ? softwareName : 'N/A' }}
              </span>
            </div>

            <div class="bg-black/30 border border-white/5 px-3.5 py-2 rounded-xl flex items-center gap-2">
              <i class="fa-solid fa-code-branch text-blue-400 text-xs"></i>
              <span class="text-gray-400 text-xs uppercase font-bold">VERSION</span>
              <span class="font-bold font-mono text-gray-200 text-xs truncate max-w-[120px]" :title="versionName">
                {{ currentServerState === SERVER_STATE.ONLINE ? versionName : 'N/A' }}
              </span>
            </div>
          </div>
        </section>

        <!-- 在线玩家 -->
        <section
          class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-5 md:p-6 flex flex-col w-full min-h-[280px] shadow-2xl">
          <div
            class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-white/5 pb-3.5">
            <h2 class="text-xs md:text-sm font-bold uppercase tracking-wider text-gray-200 flex items-center gap-2">
              <i class="fa-solid fa-circle-user text-emerald-400 text-sm"></i>
              <span>
                {{ currentServer.name }}
                在线玩家 ({{ onlinePlayersCount }} / {{ maxPlayersCount }})
              </span>
            </h2>
            <div
              class="font-mono text-xs text-gray-400 bg-black/40 px-3 py-1 rounded-md border border-white/5 self-start sm:self-auto">
              同步时间: {{ lastUpdatedText }}
            </div>
          </div>

          <div class="flex-1 overflow-y-auto max-h-[320px] pr-1 custom-scrollbar">
            <!-- Loading -->
            <template v-if="currentServerState === SERVER_STATE.LOADING && !hasCachedPlayers">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="i in 6" :key="i"
                  class="flex items-center gap-3 p-3.5 bg-black/20 rounded-xl animate-pulse border border-white/5">
                  <div class="w-9 h-9 bg-white/10 rounded-lg"></div>
                  <div class="h-4 bg-white/10 rounded w-24"></div>
                </div>
              </div>
            </template>

            <!-- 有玩家 -->
            <template v-else-if="playersList.length > 0">
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-0.5">
                <div v-for="(player, index) in playersList" :key="getPlayerKey(player, index)"
                  class="flex items-center justify-between p-3 bg-black/30 border border-white/5 hover:border-emerald-500/40 rounded-xl shadow-sm hover:bg-black/50 transition-all duration-200 group">
                  <div class="flex items-center gap-3 min-w-0">
                    <!-- ✅ 稳定版头像 -->
                    <div
                      class="avatar-container shrink-0 w-9 h-9 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative bg-black/50">
                      <img
                        v-show="!avatarErrorMap[getPlayerKey(player, index)]"
                        :src="getAvatarUrl(player)"
                        :alt="getPlayerName(player)"
                        class="avatar-img absolute inset-0 w-full h-full object-cover z-10"
                        @error="() => handleAvatarError(getPlayerKey(player, index))"
                      />
                      <div
                        v-show="avatarErrorMap[getPlayerKey(player, index)]"
                        :class="getAvatarBg(index)"
                        class="avatar-fallback absolute inset-0 z-20 flex items-center justify-center text-[11px] font-black uppercase text-white leading-none select-none">
                        {{ getPlayerName(player)?.[0] || '?' }}
                      </div>
                    </div>

                    <span
                      class="font-mono text-xs md:text-sm text-gray-200 group-hover:text-emerald-400 transition-colors truncate">
                      {{ getPlayerName(player) }}
                    </span>
                  </div>
                  <span v-if="isStaff(getPlayerName(player))"
                    class="text-xs font-medium tracking-tight px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded select-none shrink-0 ml-2">
                    管理
                  </span>
                </div>
              </div>
            </template>

            <!-- 空状态 -->
            <template v-else>
              <div class="h-full flex flex-col items-center justify-center text-center text-gray-400 py-10">
                <i class="fa-solid fa-ghost text-4xl mb-3 text-gray-600 animate-bounce"></i>
                <p class="text-xs md:text-sm tracking-wide">
                  {{ emptyTip }}
                </p>
              </div>
            </template>
          </div>
        </section>
      </main>

      <!-- 页脚 -->
      <footer class="relative z-10 text-center text-xs text-gray-500 mt-6 select-none">
        © {{ siteConfig.SITE_SINCE }}
        • {{ siteConfig.SITE_AUTHOR }}
        •
        <a :href="siteConfig.SITE_URL" target="_blank" class="hover:text-emerald-400 transition-colors">
          官网
        </a>
      </footer>
    </div>
  </section>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import siteConfig from '@@/site.config'

/* ===================== 常量 ===================== */
const SERVER_STATE = {
  LOADING: 'LOADING',
  ONLINE: 'ONLINE',
  OFFLINE: 'OFFLINE'
}

/* ===================== 服务器数据 ===================== */
const serverList = ref(siteConfig.MC_SERVERS)
const currentServerIndex = ref(0)
const currentServer = computed(() => serverList.value[currentServerIndex.value])

/* ===================== 状态 ===================== */
const serverStatuses = reactive({})
const avatarErrorMap = reactive({})

const loading = ref(true)
const hasLoadedOnce = ref(false)
const copied = ref(false)
const lastUpdated = ref(null)

let timer = null
let copyTimer = null

/* ===================== 计算属性 ===================== */
const isInitialLoading = computed(() => loading.value && !hasLoadedOnce.value)

const fullServerAddress = computed(() => {
  const s = currentServer.value
  return s.port === 25565 ? s.ip : `${s.ip}:${s.port}`
})

const getServerState = (id) => {
  const res = serverStatuses[id]
  if (!res) {
    return isInitialLoading.value ? SERVER_STATE.LOADING : SERVER_STATE.OFFLINE
  }

  const online =
    res.online === true ||
    res.status === 'success' ||
    res.status === true ||
    res.status === 200

  return online ? SERVER_STATE.ONLINE : SERVER_STATE.OFFLINE
}

const currentServerState = computed(() => getServerState(currentServer.value.id))

const getInfo = (id) => {
  const res = serverStatuses[id]
  return res?.info || res?.data || res || {}
}

const totalOnlinePlayers = computed(() =>
  serverList.value.reduce((sum, s) => sum + (getInfo(s.id)?.players?.online || 0), 0)
)

const onlineServerCount = computed(() =>
  serverList.value.filter(s => getServerState(s.id) === SERVER_STATE.ONLINE).length
)

const infoData = computed(() => getInfo(currentServer.value.id))

const onlinePlayersCount = computed(() => Number(infoData.value?.players?.online) || 0)
const maxPlayersCount = computed(() => Number(infoData.value?.players?.max) || 0)

const playersList = computed(() => {
  const list = infoData.value?.players?.sample || infoData.value?.players?.list || []
  return Array.isArray(list) ? list : []
})

const hasCachedPlayers = computed(() => playersList.value.length > 0)

const fullVersionStr = computed(() => String(infoData.value?.version?.name || ''))

const softwareName = computed(() => {
  const str = fullVersionStr.value.trim()
  if (!str) return 'Minecraft'
  const m = str.match(/^([a-zA-Z][\w\-]*)/)
  return m ? m[1] : 'Minecraft'
})

const versionName = computed(() => {
  const str = fullVersionStr.value.trim()
  if (!str) return '1.21.x'
  return str.replace(/^[^\d]*/, '').trim() || str
})

/* ===================== 状态样式 ===================== */
const statusPingColor = computed(() => ({
  'bg-amber-400': currentServerState.value === SERVER_STATE.LOADING,
  'bg-emerald-400': currentServerState.value === SERVER_STATE.ONLINE,
  'bg-rose-400': currentServerState.value === SERVER_STATE.OFFLINE
}))

const statusDotColor = computed(() => ({
  'bg-amber-500': currentServerState.value === SERVER_STATE.LOADING,
  'bg-emerald-500': currentServerState.value === SERVER_STATE.ONLINE,
  'bg-rose-500': currentServerState.value === SERVER_STATE.OFFLINE
}))

const statusTextColor = computed(() => ({
  'text-amber-400': currentServerState.value === SERVER_STATE.LOADING,
  'text-emerald-400': currentServerState.value === SERVER_STATE.ONLINE,
  'text-rose-400': currentServerState.value === SERVER_STATE.OFFLINE
}))

const statusLabel = computed(() => ({
  [SERVER_STATE.LOADING]: 'CHECKING',
  [SERVER_STATE.ONLINE]: 'ONLINE',
  [SERVER_STATE.OFFLINE]: 'OFFLINE'
})[currentServerState.value])

const emptyTip = computed(() => {
  if (currentServerState.value === SERVER_STATE.OFFLINE) return '服务器离线，无法获取玩家列表'
  if (onlinePlayersCount.value === 0) return '当前世界空无一人，快来成为第一位访客吧'
  return ''
})

/* ===================== 工具方法 ===================== */
const switchServer = (index) => {
  currentServerIndex.value = index
}

const isStaff = (name) =>
  name &&
  Array.isArray(siteConfig.MC_SERVER_STAFF) &&
  siteConfig.MC_SERVER_STAFF.some(s => s.toLowerCase() === name.toLowerCase())

const getPlayerName = (p) =>
  typeof p === 'string' ? p : p?.name || p?.username || '未知玩家'

const getPlayerUuid = (p) => {
  const id = p?.id || p?.uuid
  return typeof id === 'string' ? id.replace(/-/g, '') : null
}

const getPlayerKey = (player, index) =>
  getPlayerUuid(player) || `${getPlayerName(player)}-${index}`

const getAvatarUrl = (player) => {
  const uuid = getPlayerUuid(player)
  const name = getPlayerName(player)
  return uuid
    ? `https://api.mineatar.io/face/${uuid}?size=36`
    : `https://mc-heads.net/avatar/${encodeURIComponent(name)}/36`
}

const handleAvatarError = (key) => {
  avatarErrorMap[key] = true
}

const getAvatarBg = (index) => {
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

/* ===================== 数据拉取 ===================== */
const fetchAllServers = async () => {
  loading.value = true
  try {
    await Promise.all(
      serverList.value.map(async (server) => {
        try {
          serverStatuses[server.id] = await $fetch(
            `https://api.hanximeng.com/mc/?server_addr=${server.ip}&server_port=${server.port}`,
            {
              timeout: 8000,
              server: false
            }
          )
        } catch {
          serverStatuses[server.id] = { online: false }
        }
      })
    )
    lastUpdated.value = new Date()
  } finally {
    loading.value = false
    hasLoadedOnce.value = true
  }
}

/* ===================== 复制 IP ===================== */
const copyIp = async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(fullServerAddress.value)
    } else {
      const ta = document.createElement('textarea')
      ta.value = fullServerAddress.value
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 2000)
  } catch {}
}

const lastUpdatedText = computed(() =>
  lastUpdated.value ? lastUpdated.value.toTimeString().split(' ')[0] : '00:00:00'
)

/* ===================== 生命周期 ===================== */
onMounted(() => {
  fetchAllServers()
  timer = setInterval(fetchAllServers, 60000)
})

onUnmounted(() => {
  clearInterval(timer)
  clearTimeout(copyTimer)
})
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

.avatar-container {
  flex-shrink: 0;
}

.avatar-img {
  image-rendering: pixelated;
}
</style>
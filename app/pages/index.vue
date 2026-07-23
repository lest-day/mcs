<template>
    <section id="hero" class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-hidden">
      <NuxtImg src="/photo/wallpaper/18ba3525-9f0b-4e1c-baad-c01185236e38.jpg" alt="服务器背景墙纸"
        class="absolute inset-0 w-full h-full object-cover" preload />
      <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
      <div
        class="relative z-10 flex flex-col lg:flex-row items-center justify-center gap-10 max-w-7xl w-full px-6 py-20">
  
        <!-- 服务器 Icon（强行固定为 /logo_radius.png） -->
        <div class="shrink-0 flex-none">
          <NuxtImg src="/logo_radius.png" alt="清花MC服务器图标"
            class="w-36 h-36 lg:w-44 lg:h-44 rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105 border border-white/10 object-cover" />
        </div>
  
        <div class="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start">
  
          <h1 class="text-4xl lg:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {{ siteConfig.SITE_NAME }}
          </h1>
  
          <div class="mt-8 flex flex-col lg:flex-row items-stretch lg:items-start gap-4 w-full lg:w-auto">
            <!-- 服务器 IP 卡片 -->
            <div
              class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 min-w-[300px] break-all leading-snug">
              <div class="text-left flex-1">
                <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">服务器地址</p>
                <p class="text-sm font-mono text-gray-100 mt-1 select-all overflow-auto break-all h-[3ch]">
                  {{ serverIp }}:{{ serverPort }}
                </p>
              </div>
              <button @click="copyIp"
                class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
                <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
                <span>{{ copied ? '已复制' : '复制' }}</span>
              </button>
            </div>
  
            <!-- 在线状态卡片 -->
            <div
              class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">
  
              <div class="relative flex h-3.5 w-3.5 ml-1">
                <span
                  :class="loading ? 'bg-amber-400 animate-ping' : (isOnline ? 'bg-emerald-400 animate-ping' : 'bg-rose-400')"
                  class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                <span :class="loading ? 'bg-amber-500' : (isOnline ? 'bg-emerald-500' : 'bg-rose-500')"
                  class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white/10"></span>
              </div>
  
              <div class="text-left flex-1">
                <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                  {{ loading ? '正在连接...' : (isOnline ? '当前在线' : '服务器状态') }}
                </p>
                <div class="text-sm font-bold text-gray-100 mt-1">
                  <template v-if="loading">
                    <span class="text-gray-400 font-normal text-xs animate-pulse">获取中...</span>
                  </template>
                  <template v-else-if="isOnline">
                    {{ onlinePlayersCount }} <span class="text-xs text-gray-400 font-normal">/
                      {{ maxPlayersCount }} 人</span>
                  </template>
                  <template v-else>
                    <span class="text-rose-400">离线 / 维护中</span>
                  </template>
                </div>
              </div>
  
              <!-- 在线玩家预览头像列 -->
              <div v-if="!loading && isOnline && playersList.length > 0"
                class="flex -space-x-3 overflow-hidden ml-auto">
  
                <div v-for="(player, index) in playersList.slice(0, 3)" :key="player.id || player.name"
                  :class="getAvatarBg(index)"
                  class="relative inline-block h-8 w-8 rounded-full ring-2 ring-black/50 flex items-center justify-center text-[11px] font-sans font-black uppercase overflow-hidden shadow-inner shadow-black/20"
                  :title="player.name">
  
                  <span
                    class="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] select-none">
                    {{ player.name ? player.name[0] : '?' }}
                  </span>
                </div>
  
                <div v-if="onlinePlayersCount > 3"
                  class="shrink-0 flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-black/50 bg-gray-800 text-[10px] text-gray-200 font-bold z-20 shadow-md select-none">
                  +{{ onlinePlayersCount - 3 }}
                </div>
              </div>
  
            </div>
  
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import siteConfig from '@@/site.config'
  
  const serverIp = siteConfig.MC_SERVER_IP || 'mc.r55770545.nyat.app'
  const serverPort = siteConfig.MC_SERVER_PORT || 61482
  
  const serverStatus = ref(null)
  const loading = ref(true)
  const copied = ref(false)
  
  // 针对后端 API 结构计算属性
  const infoData = computed(() => {
    if (!serverStatus.value) return null
    return serverStatus.value.info || serverStatus.value.data || serverStatus.value
  })
  
  const isOnline = computed(() => {
    if (!serverStatus.value) return false
    const status = serverStatus.value.status
    return status === 'success' || status === true || status === 200 || Boolean(serverStatus.value.online)
  })
  
  const onlinePlayersCount = computed(() => {
    return infoData.value?.players?.online ?? 0
  })
  
  const maxPlayersCount = computed(() => {
    return infoData.value?.players?.max ?? 20
  })
  
  const playersList = computed(() => {
    return infoData.value?.players?.sample || infoData.value?.players?.list || []
  })
  
  onMounted(async () => {
    try {
      const res = await $fetch(`https://api.hanximeng.com/mc/?server_addr=${serverIp}&server_port=${serverPort}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      })
      serverStatus.value = res
    } catch (err) {
      console.error('获取MC服务器状态失败:', err)
      serverStatus.value = { status: 'error' }
    } finally {
      loading.value = false
    }
  })
  
  // 丰富后的 MC 特色渐变背景色生成逻辑
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
    const fullAddress = `${serverIp}:${serverPort}`
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(fullAddress)
        copied.value = true
      } else {
        const textarea = document.createElement('textarea')
        textarea.value = fullAddress
        textarea.style.position = 'absolute'
        textarea.style.opacity = '0'
        document.body.appendChild(textarea)
        textarea.select()
        const successful = document.execCommand('copy')
        document.body.removeChild(textarea)
        if (!successful) throw new Error('copy failed')
        copied.value = true
      }
      setTimeout(() => { copied.value = false }, 2000)
    } catch (err) {
      console.error('复制失败: ', err)
    }
  }
  </script>
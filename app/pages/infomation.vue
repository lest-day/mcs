<template>
    <section id="server-dashboard"
        class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-y-auto py-12 md:py-20 selection:bg-emerald-500/30">
        <!-- 动态背景壁纸（保留第一版的视觉冲击力） -->
        <NuxtImg src="/photo/wallpaper/91fd2fe5-b82b-4f16-b65f-76f124383c12.jpg" alt="服务器背景墙纸"
            class="absolute inset-0 w-full h-full object-cover fixed" preload />
        <!-- 沉浸式渐变层遮罩 -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/95 via-black/75 to-black/55 backdrop-blur-[2px]"></div>

        <div class="relative z-10 flex flex-col items-center justify-center max-w-5xl w-full gap-8 px-4 md:px-6">

            <!-- 头部区域：服务器 Logo + 名字 + 核心快捷面板 -->
            <header
                class="flex flex-col min-[928px]:flex-row items-center justify-between gap-8 w-full bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-3xl shadow-2xl">
                <div
                    class="flex flex-col min-[928px]:flex-row items-center gap-6 text-center min-[928px]:text-left w-full min-[928px]:w-auto">
                    <!-- 服务器图标（支持动态获取或本地兜底） -->
                    <div class="shrink-0 flex-none relative group">
                        <NuxtImg v-if="status?.icon" :src="status.icon" alt="Server Icon"
                            class="w-28 h-28 rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 border border-white/10 object-cover" />
                        <NuxtImg v-else src="/logo_radius.png" alt="清花MC服务器图标"
                            class="w-28 h-28 rounded-2xl shadow-xl transition-transform duration-300 group-hover:scale-105 border border-white/10" />
                    </div>

                    <div class="flex flex-col items-center min-[928px]:items-start gap-3">
                        <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-lg text-white">
                            {{ siteConfig.SITE_NAME }}
                        </h1>
                        <!-- 地址复制卡片 -->
                        <div
                            class="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between gap-4 min-w-[280px] break-all leading-snug">
                            <div class="text-left flex-1">
                                <p class="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">服务器地址</p>
                                <p class="text-xs font-mono text-gray-200 mt-0.5 select-all">{{ serverIp }}:{{
                                    serverPort }}</p>
                            </div>
                            <button @click="copyIp"
                                class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-[11px] font-bold px-3 py-2 rounded-lg transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
                                <i :class="copied ? 'fa-solid fa-check' : 'fa-regular fa-copy'"></i>
                                <span>{{ copied ? '已复制' : '复制' }}</span>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- 右侧在线状态与手动刷新 -->
                <div
                    class="bg-black/40 border border-white/10 pl-5 pr-3 py-3 rounded-xl flex items-center justify-between gap-6 min-w-[220px] max-w-full">
                    <div class="flex items-center gap-3">
                        <div class="relative flex h-2.5 w-2.5">
                            <span
                                :class="loading ? 'bg-amber-400 animate-ping' : (status?.online ? 'bg-emerald-400 animate-ping' : 'bg-rose-400')"
                                class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                            <span
                                :class="loading ? 'bg-amber-500' : (status?.online ? 'bg-emerald-500' : 'bg-rose-500')"
                                class="relative inline-flex rounded-full h-2.5 w-2.5 border border-black/40"></span>
                        </div>
                        <div class="text-left">
                            <p class="text-[9px] text-gray-400 font-bold uppercase tracking-wider">STATUS</p>
                            <p class="text-xs font-bold mt-0.5 text-gray-200">
                                {{ loading ? '正在检测...' : (status?.online ? '在线 / 运行中' : '离线 / 维护中') }}
                            </p>
                        </div>
                    </div>
                    <button @click="fetchServerStatus" :disabled="loading"
                        class="w-8 h-8 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-40 active:scale-95 transition-all shadow-sm"
                        title="刷新数据">
                        <i :class="loading ? 'fa-solid fa-spinner animate-spin' : 'fa-solid fa-rotate'"></i>
                    </button>
                </div>
            </header>

            <!-- 核心指标与宣言区 -->
            <section class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                <!-- 玩家人数 -->
                <div
                    class="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div
                        class="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center text-emerald-400 text-sm border border-white/5">
                        <i class="fa-solid fa-users"></i>
                    </div>
                    <div class="text-left">
                        <p class="text-[9px] font-bold tracking-wider text-gray-400">PLAYERS</p>
                        <p class="text-base font-black mt-0.5 text-gray-100">
                            {{ loading ? '--' : (status?.online ? `${status.players?.online} / ${status.players?.max}` :
                                '0 / 0') }}
                        </p>
                    </div>
                </div>

                <!-- 服务端 -->
                <div
                    class="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div
                        class="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center text-orange-400 text-sm border border-white/5">
                        <i class="fa-solid fa-box-open"></i>
                    </div>
                    <div class="text-left max-w-[calc(100%-3.5rem)]">
                        <p class="text-[9px] font-bold tracking-wider text-gray-400">SOFTWARE</p>
                        <p class="text-base font-black mt-0.5 text-gray-100 truncate" :title="status?.software">
                            {{ loading ? '--' : (status?.online ? (status.software || 'Minecraft') : '无') }}
                        </p>
                    </div>
                </div>

                <!-- 游戏版本 -->
                <div
                    class="bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 shadow-xl">
                    <div
                        class="w-10 h-10 rounded-xl bg-black/50 flex items-center justify-center text-blue-400 text-sm border border-white/5">
                        <i class="fa-solid fa-code-branch"></i>
                    </div>
                    <div class="text-left max-w-[calc(100%-3.5rem)]">
                        <p class="text-[9px] font-bold tracking-wider text-gray-400">VERSION</p>
                        <p class="text-base font-black mt-0.5 text-gray-100 truncate" :title="status?.version">
                            {{ loading ? '--' : (status?.online ? (status.version || 'Minecraft') : '无') }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- 在线玩家细化面板 -->
            <section
                class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-6 flex flex-col w-full min-h-[280px] shadow-2xl">
                <div
                    class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-white/5 pb-4">
                    <h2 class="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                        <i class="fa-solid fa-circle-user text-emerald-400"></i>
                        <span>实时在线玩家 ({{ status?.players?.online || 0 }})</span>
                    </h2>
                    <div
                        class="font-mono text-[10px] text-gray-400 bg-black/40 px-2.5 py-1 rounded-md border border-white/5">
                        同步时间: {{ lastUpdatedText }}
                    </div>
                </div>

                <!-- 滚动列表 -->
                <div class="flex-1 overflow-y-auto max-h-[340px] pr-1 custom-scrollbar">
                    <!-- 加载骨架屏 -->
                    <template v-if="loading">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                            <div v-for="i in 6" :key="i"
                                class="flex items-center gap-3 p-3 bg-black/20 rounded-xl animate-pulse border border-white/5">
                                <div class="w-8 h-8 bg-white/10 rounded-lg"></div>
                                <div class="h-3 bg-white/10 rounded w-20"></div>
                            </div>
                        </div>
                    </template>

                    <!-- 玩家渲染网格 -->
                    <template v-else-if="status?.online && (status.players?.list || []).length > 0">
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-0.5">
                            <div v-for="(player, index) in status.players.list" :key="player.uuid || player.name"
                                class="flex items-center justify-between p-3 bg-black/30 border border-white/5 hover:border-emerald-500/40 rounded-xl shadow-sm hover:bg-black/50 transition-all duration-200 group">

                                <div class="flex items-center gap-3 min-w-0">
                                    <div
                                        class="shrink-0 w-8 h-8 rounded-lg overflow-hidden border border-white/10 flex items-center justify-center relative">
                                        <img :src="`https://crafatar.com/avatars/${player.uuid || '8667ba71b85a4004af54457a9734eed7'}?size=32&default=MHF_Steve`"
                                            alt="avatar" class="w-full h-full object-cover"
                                            @error="(e) => (e.target.style.display = 'none')" />
                                        <div :class="getAvatarBg(index)"
                                            class="absolute inset-0 flex items-center justify-center text-[11px] font-black uppercase text-white shadow-inner select-none z-[-1]">
                                            {{ player.name ? player.name[0] : '?' }}
                                        </div>
                                    </div>

                                    <span
                                        class="font-mono text-xs text-gray-200 group-hover:text-emerald-400 transition-colors truncate">
                                        {{ player.name }}
                                    </span>
                                </div>

                                <span v-if="isStaff(player.name)"
                                    class="text-[9px] font-medium tracking-tight px-1.5 py-0.5 bg-white/10 text-gray-300 border border-white/10 rounded select-none font-sans">
                                    管理
                                </span>
                            </div>
                        </div>
                    </template>

                    <template v-else>
                        <div class="h-full flex flex-col items-center justify-center text-center text-gray-500 py-12">
                            <i class="fa-solid fa-ghost text-3xl mb-3 text-gray-600 animate-bounce"></i>
                            <p class="text-xs tracking-wide">{{ status?.online ? '四周寂静无声，暂无在线玩家' : '服务器可能正在打盹（离线中）' }}
                            </p>
                        </div>
                    </template>
                </div>
            </section>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import siteConfig from '@@/site.config'

const serverIp = siteConfig.MC_SERVER_IP
const serverPort = siteConfig.MC_SERVER_PORT

const status = ref(null)
const loading = ref(true)
const copied = ref(false)
const lastUpdated = ref(null)

const isStaff = (name) => {
    if (!name || !siteConfig.MC_SERVER_STAFF || !Array.isArray(siteConfig.MC_SERVER_STAFF)) return false
    return siteConfig.MC_SERVER_STAFF.some(staffName => staffName.toLowerCase() === name.toLowerCase())
}

const fetchServerStatus = async () => {
    loading.value = true
    try {
        const res = await $fetch(`https://api.mcsrvstat.us/3/${encodeURIComponent(serverIp)}:${encodeURIComponent(serverPort)}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
        status.value = res
        lastUpdated.value = new Date()
    } catch (err) {
        console.error('获取MC服务器状态失败:', err)
        status.value = { online: false }
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchServerStatus()
    // 每3分钟静默刷新一次
    setInterval(fetchServerStatus, 180000)
})

const lastUpdatedText = computed(() => {
    if (!lastUpdated.value) return '00:00:00'
    return lastUpdated.value.toTimeString().split(' ')[0]
})

const getAvatarBg = (index) => {
    const bgs = [
        'bg-gradient-to-br from-emerald-600 to-teal-700',
        'bg-gradient-to-br from-blue-600 to-indigo-700',
        'bg-gradient-to-br from-amber-500 to-orange-600'
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
            textarea.style.position = 'fixed'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.select()
            const successful = document.execCommand('copy')
            document.body.removeChild(textarea)
            if (!successful) throw new Error()
            copied.value = true
        }
        setTimeout(() => { copied.value = false }, 2000)
    } catch (err) {
        console.error('复制失败')
    }
}
</script>

<style scoped>
/* 隐藏底层滚动条，替换为更细腻的现代毛玻璃滚动槽 */
.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(255, 255, 255, 0.25);
}
</style>
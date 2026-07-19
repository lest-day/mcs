<template>
    <section id="hero" class="relative min-h-screen flex items-center justify-center text-white px-4 overflow-hidden">
        <NuxtImg src="/photo/wallpaper/18ba3525-9f0b-4e1c-baad-c01185236e38.jpg" alt="服务器背景墙纸"
            class="absolute inset-0 w-full h-full object-cover" preload />
        <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/40"></div>
        <div
            class="relative z-10 flex flex-col min-[928px]:flex-row items-center justify-center gap-10 max-w-7xl w-full px-6 py-20">

            <div class="shrink-0 flex-none">
                <NuxtImg src="/logo_radius.png" alt="清花MC服务器图标"
                    class="w-36 h-36 min-[928px]:w-44 min-[928px]:h-44 rounded-3xl shadow-2xl transition-transform duration-300 hover:scale-105" />
            </div>

            <div class="flex-1 text-center min-[928px]:text-left flex flex-col items-center min-[928px]:items-start">

                <h1 class="text-4xl min-[928px]:text-6xl font-extrabold tracking-tight drop-shadow-lg">
                    {{ siteConfig.SITE_NAME }}
                </h1>

                <div
                    class="mt-8 flex flex-col min-[928px]:flex-row items-stretch min-[928px]:items-start gap-4 w-full min-[928px]:w-auto">
                    <div
                        class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-6 min-w-[300px] break-all leading-snug">
                        <div class="text-left flex-1">
                            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">服务器地址</p>
                            <p class="text-sm font-mono text-gray-100 mt-1 select-all">{{ siteConfig.MC_SERVER_IP }}:{{ siteConfig.MC_SERVER_PORT }}
                            </p>
                        </div>
                        <button @click="copyIp"
                            class="shrink-0 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 shadow-lg shadow-emerald-950/40">
                            <span>{{ copied ? '已复制' : '复制地址' }}</span>
                        </button>
                    </div>

                    <div
                        class="bg-black/50 backdrop-blur-lg border border-white/10 rounded-2xl p-4 flex items-center gap-4 min-w-[240px]">

                        <div class="relative flex h-3.5 w-3.5 ml-1">
                            <span
                                :class="loading ? 'bg-gray-400' : (status?.online ? 'bg-emerald-400 animate-ping' : 'bg-rose-400')"
                                class="absolute inline-flex h-full w-full rounded-full opacity-75"></span>
                            <span :class="loading ? 'bg-gray-500' : (status?.online ? 'bg-emerald-500' : 'bg-rose-500')"
                                class="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-white/10"></span>
                        </div>

                        <div class="text-left flex-1">
                            <p class="text-xs text-gray-400 font-semibold uppercase tracking-wider">
                                {{ loading ? '正在连接...' : (status?.online ? '当前在线' : '服务器状态') }}
                            </p>
                            <div class="text-sm font-bold text-gray-100 mt-1">
                                <template v-if="loading">
                                    <span class="text-gray-400 font-normal text-xs animate-pulse">获取中...</span>
                                </template>
                                <template v-else-if="status?.online">
                                    {{ status.players?.online || 0 }} <span class="text-xs text-gray-400 font-normal">/
                                        {{ status.players?.max || 20 }} 人</span>
                                </template>
                                <template v-else>
                                    <span class="text-rose-400">离线 / 维护中</span>
                                </template>
                            </div>
                        </div>

                        <div v-if="!loading && status?.online && (status.players?.list || []).length > 0"
                            class="flex -space-x-3 overflow-hidden ml-auto">

                            <div v-for="(player, index) in (status.players?.list || []).slice(0, 3)"
                                :key="player.uuid || player.name" :class="getAvatarBg(index)"
                                class="relative inline-block h-8 w-8 rounded-full ring-2 ring-black/50 flex items-center justify-center text-[11px] font-sans font-black uppercase overflow-hidden shadow-inner shadow-black/20"
                                :title="player.name">

                                <span
                                    class="absolute inset-0 flex items-center justify-center text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] select-none">
                                    {{ player.name ? player.name[0] : '?' }}
                                </span>
                            </div>

                            <div v-if="(status.players?.online || 0) > 3"
                                class="shrink-0 flex items-center justify-center h-8 w-8 rounded-full ring-2 ring-black/50 bg-gray-800 text-[10px] text-gray-200 font-bold z-20 shadow-md select-none">
                                +{{ status.players.online - 3 }}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import siteConfig from '@@/site.config'

const serverIp = siteConfig.MC_SERVER_IP
const serverPort = siteConfig.MC_SERVER_PORT
const status = ref(null)
const loading = ref(true)
const copied = ref(false)

onMounted(async () => {
    try {
        const res = await $fetch(`https://api.mcsrvstat.us/3/${serverIp}:${serverPort}`, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        })
        status.value = res
    } catch (err) {
        console.error('获取MC服务器状态失败:', err)
        status.value = { online: false }
    } finally {
        loading.value = false
    }
})

// 重新加回了你写得非常好看的渐变背景色生成逻辑
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
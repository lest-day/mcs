<script setup lang="ts">
import { computed } from 'vue'
import type { NuxtError } from '#app'
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const props = defineProps<{
  error: NuxtError
}>()
const config = useRuntimeConfig()
const shouldShowStack = config.public.showErrorStack && import.meta.dev
const errorDetails = computed(() => {
  const statusCode = Number(props.error?.statusCode) || 500
  const map: Record<number, { title: string; message: string; sub: string }> = {
    404: {
      title: '404 - Not Found',
      message: '页面不小心走丢了',
      sub: '抱歉，我们找不到您要查看的页面，请检查路径是否正确。'
    },
    403: {
      title: '403 - Forbidden',
      message: '访问受限',
      sub: '您没有权限查看此内容，请联系管理员或尝试登录。'
    },
    500: {
      title: '500 - Internal Server Error',
      message: '服务器开小差了',
      sub: '我们正在努力修复中，请稍后再试。'
    }
  }

  return map[statusCode] || {
    title: statusCode.toString(),
    message: '发生了一些错误',
    sub: props.error?.statusMessage || '遇到了一些未知的错误。'
  }
})
</script>

<template>
  <div class="app-shell relative min-h-screen overflow-x-hidden text-white">
    <div class="relative z-10 flex min-h-screen flex-col">
      <header class="app-header sticky top-0 z-50">
        <AppHeader />
      </header>

      <main class="app-main flex flex-1 flex-col">
        <div class="grid flex-1 place-items-center bg-[#0b0b0b] px-6 py-24 sm:py-32 lg:px-8">
          <div class="text-center">
            <p class="text-base text-mist-300">
              {{ errorDetails.title }}
            </p>
            <h1 class="mt-4 text-5xl tracking-tight text-white sm:text-7xl">
              {{ errorDetails.message }}
            </h1>
            <p class="mt-6 text-lg font-medium text-gray-400 sm:text-xl/8 text-balance max-w-xl mx-auto">
              {{ errorDetails.sub }}
            </p>
            <div v-if="shouldShowStack" class="mt-8 text-left p-4 bg-gray-800 rounded-lg border border-gray-700 max-w-2xl mx-auto overflow-auto">
              <p class="text-xs font-mono text-red-400 mb-2">Debug 信息（仅限开发模式）</p>
              <pre class="text-xs text-gray-400 whitespace-pre-wrap">{{ error.stack }}</pre>
            </div>
          </div>
        </div>
      </main>

      <footer class="app-footer mt-auto">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

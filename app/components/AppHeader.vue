<script setup>
import { ref } from 'vue';
import config from '../../site.config.ts';

const isMobileMenuOpen = ref(false);
const siteName = config.SITE_NAME;
</script>

<template>
  <div
    class="relative bg-neutral-950 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
    <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
      <div class="relative flex h-16 items-center justify-between">
        <div class="absolute inset-y-0 right-0 flex items-center sm:hidden">
          <button type="button" @click="isMobileMenuOpen = !isMobileMenuOpen"
            class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
            <span class="absolute -inset-0.5"></span>
            <span class="sr-only">打开顶栏</span>
            <svg v-if="!isMobileMenuOpen" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
              aria-hidden="true" class="size-6">
              <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"
              class="size-6">
              <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
        <div class="w-full flex justify-between items-center ">
          <a href="/" class="flex shrink-0 items-center gap-2.5 pl-2.5">
            <img src="\logo_cropper.png" alt="" class="h-8 w-auto" />
            <span class="font-bold text-gray-100 text-lg tracking-wide transition-colors">{{ siteName }}</span>
          </a>
          <div class="hidden sm:ml-6 sm:block">
            <div class="flex space-x-4 items-center h-full">
              <a href="/news"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
                <i class="fa-solid fa-newspaper"></i> 新闻
              </a>
              <a href="/photo"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
                <i class="fa-solid fa-file-image"></i> 照片
              </a>
              <a href="/command"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
                <i class="fa-solid fa-terminal"></i> 命令
              </a>
              <a href="/infomation"
                class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
                <i class="fa-solid fa-compass"></i> 状态
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MOBILE -->
    <div v-show="isMobileMenuOpen" class="sm:hidden" id="mobile-menu">
      <div class="space-y-1 px-2 pt-2 pb-3">
        <div class="grid grid-cols-2 gap-2">
          <a href="/news"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
            <i class="fa-solid fa-newspaper"></i> 新闻
          </a>
          <a href="/photo"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
            <i class="fa-solid fa-file-image"></i> 照片
          </a>
          <a href="/command"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
            <i class="fa-solid fa-terminal"></i> 命令
          </a>
          <a href="/infomation"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-200 hover:bg-white/5 hover:text-white">
            <i class="fa-solid fa-compass"></i> 状态
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
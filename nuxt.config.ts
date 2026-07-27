// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  colorMode: {
    classSuffix: '',
    preference: 'dark'
  },
  app: {
    head: {
      title: '清花MC服务器',
      htmlAttrs: { lang: 'zh-CN' },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css' },
      ],
    },
  },
  css: ['~/assets/css/global.css'],
  vite: {
    plugins: [tailwindcss()],
  },
  modules: ['@caeher/nuxt-gallery', '@nuxt/image', '@nuxt/content', 'nuxt-studio', '@nuxtjs/color-mode'],
  studio: {
    repository: {
      provider: 'github',
      owner: 'lest-day',
      repo: 'mcs',
      branch: 'master',
      private: false
    },
  },
  content: {
    build: {
      markdown: {
        highlight: {
          theme: 'github-dark'
        }
      }
    },
  },
  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      routes: ['/'],
      crawlLinks: true
    },
    cloudflare: {
      nodeCompat: true
    }
  }
})
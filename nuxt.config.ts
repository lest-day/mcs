// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      title: '清花MC服务器',
      htmlAttrs: {
        lang: 'zh-CN',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css' },
      ],
    },
  },
  css: ['~/assets/css/global.css'],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@caeher/nuxt-gallery', '@nuxt/image']
})
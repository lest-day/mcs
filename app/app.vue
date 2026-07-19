<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>

<template>
  <div class="app-shell relative min-h-screen overflow-x-hidden">
    <div class="relative z-10 flex min-h-screen flex-col">
      <header class="app-header sticky top-0 z-50">
        <AppHeader />
      </header>
      <main class="app-main flex-grow mx-auto w-full">
        <NuxtPage />
      </main>
      <footer class="app-footer mt-auto">
        <AppFooter />
      </footer>
    </div>
  </div>
</template>

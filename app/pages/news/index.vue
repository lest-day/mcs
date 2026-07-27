<script setup lang="ts">
const { data: newsList } = await useAsyncData('news-list', () =>
  queryCollection('news')
    .order('date', 'DESC')
    .all()
)
</script>

<template>
  <div class="mx-auto max-w-3xl py-8">
    <h1 class="text-3xl font-bold mb-6">📰 服务器公告</h1>

    <div v-if="!newsList?.length" class="text-red-500">
      没有找到任何公告
    </div>

    <article
      v-for="item in newsList"
      :key="item.path"
      class="mb-6 border rounded-lg p-5 hover:shadow-lg transition"
    >
      <h2 class="text-xl font-bold mb-2">
        <NuxtLink :to="item.path" class="text-blue-500 hover:underline">
          {{ item.title }}
        </NuxtLink>
      </h2>
      <div class="text-sm text-gray-500 mb-2">
        <span>{{ item.date }}</span>
        <span v-if="item.version" class="ml-2">🎮 {{ item.version }}</span>
      </div>
      <p v-if="item.description" class="text-gray-700">{{ item.description }}</p>
      <span v-if="item.important" class="inline-block mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded">
        🔴 重要
      </span>
    </article>
  </div>
</template>
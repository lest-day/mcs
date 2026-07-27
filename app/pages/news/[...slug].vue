<script setup lang="ts">
const route = useRoute()
const slugPath = '/news/' + (route.params.slug as string[]).join('/')

const { data: article } = await useAsyncData(
  `news-${slugPath}`,
  () => queryCollection('news').path(slugPath).first(),
  { default: () => null }
)

if (!article.value) {
  throw createError({
    statusCode: 404,
    statusMessage: '公告不存在'
  })
}

// ✅ 关键：从 ref 中解包，得到一个“非 null 的值”
const safeArticle = article.value
</script>

<template>
  <div class="prose mx-auto py-8">
    <h1 class="text-3xl font-bold">{{ safeArticle.title }}</h1>
    <p class="text-gray-500">{{ safeArticle.date }}</p>

    <span
      v-if="safeArticle.important"
      class="inline-block mt-2 text-xs bg-red-500 text-white px-2 py-1 rounded"
    >
      🔴 重要公告
    </span>

    <hr class="my-6" />

    <!-- ✅ TS / Volar 完全安静 -->
    <ContentRenderer :value="safeArticle" />
  </div>
</template>
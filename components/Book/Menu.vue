<template>
  <v-btn rounded="lg" variant="tonal" text class="mx-1" @click="share">
    <v-icon start> mdi-share-variant </v-icon>
    공유
  </v-btn>
</template>

<script setup>
const share = () => {
  const { title, content } = post.value
  const url = `https://libris.kr/book/content/${post.value.time}`
  const text = `${title} - ${content}`

  navigator.share({
    title,
    text,
    url
  })

  Libris(userInfo.uid, 1)
}
</script>

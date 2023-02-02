<template>
  <v-btn rounded="lg" variant="tonal" text class="mx-1" @click="share">
    <v-icon start> mdi-share-variant </v-icon>
    공유
  </v-btn>
</template>

<script setup>
const share = async () => {
  const { title, content } = post.value
  await navigator.share({
    title,
    text: content,
    url: `https://littlechildwriter.app/book/content/${time}`
  })
  Libris(userInfo.uid, 1)
}
</script>

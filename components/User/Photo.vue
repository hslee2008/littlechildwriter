<template>
  <v-avatar :size="size">
    <v-img
      v-if="isValidImage(src?.toString())"
      :src="src?.toString()"
      alt="User Photo"
      cover
    />
    <v-img
      v-else
      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdvw7elxhHy_b8I_8M-NaNI8AqpjFeoF5EMrZkBITOMg&usqp=CAU&ec=48600113"
      alt="User Photo"
      cover
    />
  </v-avatar>
</template>

<script setup lang="ts">
defineProps<{
  src: any
  size: number
}>()

const isValidImage = (src: string | undefined) =>
  src?.match(/\.(jpeg|jpg|gif|png)$/) != null ||
  src?.match(/data:image\/(jpeg|jpg|gif|png);base64/) != null ||
  src?.match(/https:\/\/lh3.googleuser/) != null ||
  src?.includes('webp')
</script>

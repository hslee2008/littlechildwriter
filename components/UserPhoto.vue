<template>
  <v-avatar size="50">
    <v-img v-if="src" :lazy-src="src" :src="src" alt="User Photo" />
    <v-icon v-else>mdi-account</v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
defineProps<{
  src: string | undefined | null
}>()
</script>

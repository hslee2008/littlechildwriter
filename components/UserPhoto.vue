<template>
  <v-avatar size="50">
    <v-img v-if="src" :src="src" alt="User Photo" />
    <v-img
      v-else
      src="https://www.pngkey.com/png/detail/202-2024792_user-profile-icon-png-download-fa-user-circle.png"
      alt="User Photo"
    />
    <v-icon v-else>mdi-account</v-icon>
  </v-avatar>
</template>

<script setup lang="ts">
defineProps<{
  src: string | null;
}>();
</script>

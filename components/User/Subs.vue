<template>
  <v-list nav :bg-color="themeColor()">
    <v-list-item
      v-for="(item, UID) in subscription"
      v-show="item"
      :key="UID"
      :to="`/user/${UID}`"
    >
      <v-list-item-title>{{ item }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
defineProps({
  subscription: {
    type: Object,
    required: true
  }
})
</script>

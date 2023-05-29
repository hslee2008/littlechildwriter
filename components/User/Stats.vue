<template>
  <div v-if="targetUser.bio" class="my-10 ml-4">
    <p>{{ targetUser.bio }}</p>
  </div>

  <v-list flat class="rounded-lg" bg-color="#212121">
    <v-list-item>
      <template #prepend>
        <v-icon> mdi-crown-circle </v-icon>
      </template>

      <v-list-item-title>
        리브리스:
        {{ Math.round(targetUser.libris) }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <template #prepend>
        <v-icon> mdi-card-account-details </v-icon>
      </template>

      <v-list-item-title> {{ uid }} </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <template #prepend>
        <v-icon> mdi-book </v-icon>
      </template>

      <v-list-item-title> {{ bookCount }}권 </v-list-item-title>
    </v-list-item>

    <v-divider />

    <v-list-item>
      <template #prepend>
        <v-icon> mdi-account-plus </v-icon>
      </template>

      <v-list-item-title>
        {{ Keys(targetUser.subscribe).length }}명 구독
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script setup>
defineProps({
  targetUser: {
    type: Object,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  bookCount: {
    type: Number,
    required: true
  }
})
</script>

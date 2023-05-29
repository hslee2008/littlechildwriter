<template>
  <div v-if="targetUser.bio" class="my-10">
    <v-card-title>{{ targetUser.bio }}</v-card-title>
  </div>

  <v-list flat class="rounded-lg">
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

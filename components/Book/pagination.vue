<template>
  <v-slide-group>
    <v-slide-group-item v-for="data in books" :key="data.time">
      <v-card color="grey-lighten-1" class="ma-4" height="135" width="100">
        <div class="d-flex fill-height align-center justify-center">
          <v-img :src="data.image" height="200" width="100" />
        </div>
      </v-card>
    </v-slide-group-item>
  </v-slide-group>

  <v-card
    v-for="data in books"
    :key="data.time"
    :class="`d-${mobile ? 'block' : 'flex'}`"
    :to="`/book/content/${data.time}`"
  >
    <template #prepend>
      <v-avatar size="250" rounded="0">
        <v-img :src="data.image" />
      </v-avatar>
    </template>

    <v-card-text class="d-flex justify-center align-center">
      <div>
        <v-card-title>
          {{ data.title }}
        </v-card-title>
        <v-card-subtitle v-if="data">
          {{ data.displayName }}님의 책
        </v-card-subtitle>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
defineProps<{
  books: any
}>()
</script>

<template>
  <v-card
    :class="`d-${mobile ? 'block' : 'flex'}`"
    :to="`/book/content/${data.time}`"
    :color="colored ? '#385F73' : ''"
  >
    <template #prepend>
      <v-avatar size="250" rounded="0">
        <v-img :src="data.image" />
      </v-avatar>
    </template>

    <v-card-text class="d-flex justify-center align-center">
      <div>
        <v-card-title>
          {{ ReduceTitle(data.title) }}
        </v-card-title>
        <v-card-subtitle v-if="data">
          {{ data.displayName }}님의 책
        </v-card-subtitle>

        <v-card-text>
          {{ ToDisplay(data.content) }}
        </v-card-text>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()
defineProps<{
  data: any
  colored: any
}>()
</script>

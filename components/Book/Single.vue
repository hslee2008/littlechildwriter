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
          {{ data.title }}
        </v-card-title>
        <v-card-subtitle v-if="targetUser">
          {{ targetUser.displayName }}님의 책
        </v-card-subtitle>

        <v-card-text>
          {{ data.content?.replaceAll('&lt;br>', '') }}
        </v-card-text>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()
const props = defineProps<{
  data: any
  targetUser: any
  colored: any
}>()

onMounted(() => {
  if (props.data.time)
    $db
      .ref(`contents/${props.data.time}/views`)
      .transaction((views: any) => (views || 0) + 1)
})
</script>

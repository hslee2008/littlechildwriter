<template>
  <v-timeline :dense="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs" clipped>
    <v-timeline-item v-for="(item, i) in lbt" :key="lbt[i].uid" :icon="Icon(i)">
      <v-card
        v-if="item.photoURL || item.displayName"
        class="mx-auto"
        max-width="344"
        :to="`/user/${lbt[i].uid}`"
        :color="item.uid === userInfo.uid ? 'primary' : ''"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle class="text-overline mb-4">
              {{ i + 1 }}등 ({{ Math.round(item.libris) }} Libris)
            </v-list-item-subtitle>
            <v-list-item-title v-if="item.displayName" class="mb-1">
              {{ item.displayName }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar v-if="item.status === 'online'">
            <v-icon>mdi-account-badge</v-icon>
          </v-list-item-avatar>

          <v-list-item-avatar
            v-if="item.photoURL"
            :size="$vuetify.breakpoint.xs ? 50 : 70"
          >
            <v-img
              :src="item.photoURL"
              :lazy-src="item.photoURL"
              class="rounded"
            >
              <template #placeholder>
                <v-row class="fill-height ma-0" align="center" justify="center">
                  <v-progress-circular indeterminate color="grey lighten-5" />
                </v-row>
              </template>
            </v-img>
          </v-list-item-avatar>
        </v-list-item>
      </v-card>
    </v-timeline-item>
  </v-timeline>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const props = defineProps({
  limit: {
    type: Boolean,
    required: true
  }
})
const lbt = ref<any>([])

onBeforeMount(() => (props.limit ? Limited() : UnLimited()))

const Limited = () => {
  db.ref('/users')
    .orderByChild('libris')
    .limitToLast(5)
    .on('child_added', async s => {
      const { displayName, libris, photoURL, status } = await s.val()

      lbt.value.unshift({
        displayName,
        libris,
        photoURL,
        status,
        uid: s.key
      })
    })
}

const UnLimited = () => {
  db.ref('/users')
    .orderByChild('libris')
    .on('child_added', async s => {
      const { displayName, libris, photoURL, status } = await s.val()

      lbt.value.unshift({
        displayName,
        libris,
        photoURL,
        status,
        uid: s.key
      })
    })
}

const Icon = (a: number) => {
  switch (a) {
    case 0:
      return 'mdi-chess-king'
    case 1:
      return 'mdi-chess-queen'
    case 2:
      return 'mdi-chess-knight'
    case 3:
      return 'mdi-chess-bishop'
    case 4:
      return 'mdi-chess-rook'
    default:
      return 'mdi-chess-pawn'
  }
}
</script>

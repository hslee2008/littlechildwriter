
<template>
  <v-timeline :dense="$vuetify.breakpoint.sm || $vuetify.breakpoint.xs" clipped>
    <v-timeline-item
      v-for="(item, i) in lbt"
      :key="item.uid"
      :icon="iconify(i)"
    >
      <v-card
        v-if="item.image || item.name"
        class="mx-auto"
        max-width="344"
        :to="`/user/${item.uid}`"
        :color="item.uid === userInfo.uid ? 'primary' : ''"
      >
        <v-list-item>
          <v-list-item-content>
            <v-list-item-subtitle class="text-overline mb-4">
              {{ i + 1 }}등 ({{ Math.round(item.libris) }} Libris)
            </v-list-item-subtitle>
            <v-list-item-title v-if="item.name" class="mb-1">
              {{ item.name }}
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-avatar
            v-if="item.image"
            :size="$vuetify.breakpoint.xs ? 50 : 70"
          >
            <v-img :src="item.image" :lazy-src="item.image" class="rounded-lg">
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

<script>
import { db } from '@/plugins/firebase'

export default {
  props: {
    limit: {
      type: Boolean
    }
  },
  data() {
    return {
      lbt: []
    }
  },
  created() {
    this.limit ? this.librisLimited() : this.libris()
  },
  methods: {
    iconify(a) {
      return (
        'mdi-chess-' +
        (a === 0
          ? 'king'
          : a === 1
            ? 'queen'
            : a === 2
              ? 'knight'
              : a === 3
                ? 'bishop'
                : 'pawn')
      )
    },
    libris() {
      db.ref('/users')
        .orderByChild('libris')
        .on('child_added', async s => {
          const data = await s.val()

          this.lbt.unshift({
            name: data.displayName,
            libris: data.libris ?? 0,
            image: data.photoURL,
            uid: s.key
          })
        })
    },
    librisLimited() {
      db.ref('/users')
        .orderByChild('libris')
        .limitToLast(5)
        .on('child_added', async s => {
          const data = await s.val()

          this.lbt.unshift({
            name: data.displayName,
            libris: data.libris ?? 0,
            image: data.photoURL,
            uid: s.key
          })
        })
    }
  }
}
</script>

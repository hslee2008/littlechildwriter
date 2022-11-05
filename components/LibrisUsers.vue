<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-list nav class="transparent">
    <v-list-item
      v-for="(item, i) in lbt"
      v-if="item.displayName"
      :key="lbt[i].uid"
      :to="`/user/${lbt[i].uid}`"
    >
      <v-list-item-action-text class="mr-4">
        {{ i + 1 }} 등
      </v-list-item-action-text>

      <v-list-item-avatar size="50" class="mr-2">
        <UserPhoto :src="lbt[i].photoURL" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ lbt[i].displayName }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ Math.round(lbt[i].libris) }} 리브리스
        </v-list-item-subtitle>
      </v-list-item-content>

      <v-spacer />

      <v-list-item-action>
        <v-icon :color="item.status === 'online' ? 'primary' : 'grey'">
          mdi-account-{{ item.status === 'online' ? 'check' : 'remove' }}
        </v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
import { db } from 'plugins/firebase'

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
</script>

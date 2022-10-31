<template>
  <div>
    <h1>구독</h1>
    <v-overlay v-if="loading">
      <v-progress-circular indeterminate size="64" />
    </v-overlay>
    <LazyBookCard v-else :items="books" />
  </div>
</template>

<script setup lang="ts">
import { auth, db } from 'plugins/firebase'

const subscription = ref<any>()
const books = ref<any>([])
const loading = ref<boolean>(true)

onMounted(() => {
  auth.onAuthStateChanged(u => {
    if (!u) {
      return
    }

    db.ref(`/users/${u.uid}/subscribe`).on('value', async s => {
      subscription.value = Object.keys(await s.val())
    })

    db.ref('/contents/')
      .orderByChild('time')
      .limitToLast(20)
      .on('value', async s => {
        const data: any = Object.values(await s.val())

        for (let i = 0; i < data.length; i++) {
          if (subscription.value?.includes(data[i].uid)) {
            books.value.unshift(data[i])
          }
        }
      })

    setTimeout(() => (loading.value = false), 1000)
  })
})

useHead({
  title: '구독 - LCW'
})
</script>

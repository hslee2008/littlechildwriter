<template>
  <v-list>
    <v-list-item v-for="libri in libris" :key="libri.id">
      <v-list-item-content>
        <v-list-item-title>{{ libri.uid }}</v-list-item-title>
        <v-list-item-subtitle>
          {{ libri.incrementBy }} ({{ libri.date }})
        </v-list-item-subtitle>
      </v-list-item-content>

      <template #append>
        <v-btn
          icon
          variant="tonal"
          color="red"
          @click="
            Delete(
              `${libri.uid}-${libri.date}-${libri.rawDate}`,
              libri.incrementBy,
              libri.uid
            )
          "
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const { $firestore } = useNuxtApp()

const libris = ref<any[]>([])
const userInfo = User()
userInfo.initUserInfo()

onBeforeMount(() => {
  const password = prompt('관리자 암호(틀리면 -1000): ')
  if (password !== 'javascript') {
    alert('관리자 암호가 틀렸습니다.')
    PureLibris(userInfo.uid, -1000)
    navigateTo('/')
  }
})

onMounted(async () => {
  const librisRef = $firestore.collection('libris')
  const librisSnapshot = await librisRef.get()
  libris.value = librisSnapshot.docs.map((doc: any) => {
    return {
      id: doc.id,
      ...doc.data()
    }
  })

  libris.value.reverse()
})

const Delete = (id: string, incrementBy: number, uid: string) => {
  PureLibris(uid, -incrementBy)
  alert(id)
  $firestore.collection('libris').doc(id).delete()
}
</script>

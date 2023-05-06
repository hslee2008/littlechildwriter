<template>
  <div>
    <div class="mb-5">
      <h1>토론 광장</h1>

      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="my-3 mr-2"
        to="/debate/new"
        prepend-icon="mdi-plus"
      >
        새 주제
      </v-btn>
      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="my-3 mr-2"
        prepend-icon="mdi-account"
        :to="`/debate/user/${userInfo.uid}`"
      >
        나의 주제
      </v-btn>
    </div>

    <v-row>
      <v-col
        v-for="(item, i) in ImageList.sort((a: any, b: any) => b.count - a.count)"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card :to="`/debate/user/${item.uid}`" variant="outlined">
          <v-card-text class="text-center">
            <UserPhoto :size="65" :src="item.src" />
          </v-card-text>

          <v-card-subtitle class="text-center">
            {{ item.count }}
          </v-card-subtitle>
          <v-card-title class="text-center">
            {{ item.displayName }}
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const ImageList = ref<any>([])

onMounted(async () => {
  await $db.ref('/debate/posted').once('value', async (snapshot: any) => {
    const data = await snapshot.val()

    for (const uid in data) {
      await $db.ref(`/users/${uid}`).once('value', async (snapshot: any) => {
        const user = await snapshot.val()

        ImageList.value.push({
          uid,
          count: data[uid],
          displayName: user?.displayName ?? '이름 없음',
          src: user?.photoURL ?? '이미지 없음'
        })
      })
    }
  })
})

useHead({
  title: '토론 광장 - LCW'
})
</script>

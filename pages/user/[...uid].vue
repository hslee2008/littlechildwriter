<template>
  <div>
    <UserHeader
      :target-user="targetUser"
      :sub-count="subCount"
      :uid="uid"
      :subscribed="subscribed"
      :subscribe="Subscribe"
      :user-info="userInfo"
    />

    <v-tabs v-model="tab" center-active grow bg-color="#23262E">
      <v-tab> 홈 </v-tab>
      <v-tab> 게시물 </v-tab>
      <v-tab> 정보 </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="py-5" color="#23262E">
      <v-window-item :value="0">
        <BookSingle
          v-if="
            (chosen || books[0]) && Object.keys(chosen || books[0]).length > 2
          "
          :data="chosen || books[0]"
          :target-user="targetUser"
          :colored="false"
        />
        <v-card v-else>
          <v-card-text>
            <v-card-title> 책이 없습니다. </v-card-title>
            <v-card-subtitle>
              책을 추가하고 다른 사람들과 공유해보세요!
            </v-card-subtitle>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item :value="1">
        <BookList :user="uid" :search="false" />
      </v-window-item>

      <v-window-item :value="2">
        <UserStats :uid="uid" :target-user="targetUser" />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const route = useRoute()

const tab = ref<number>(0)
const uid = route.params.uid[0]
const targetUser = ref<any>({
  libris: 0,
  displayName: '',
  photoURL: '',
  bio: ''
})
const books = ref<any>([])

const subscription = ref<any>({})
const subscribed = ref<boolean>(false)
const subCount = ref<number>(0)

const chosen = ref<any>({})
const blockSubscribe = ref<number>(0)

onBeforeMount(() => {
  $db
    .ref(`/users/${uid}/`)
    .once('value')
    .then((res: any) => res.val())
    .then(
      ({ libris, displayName, photoURL, bio, subscriber, featured }: any) => {
        targetUser.value = {
          libris,
          displayName,
          photoURL,
          bio
        }

        $db
          .ref(`/contents/${featured}`)
          .on('value', async (s: any) => (chosen.value = await s.val()))

        subCount.value = Object.keys(subscriber ?? {}).length
        subscribed.value = Object.keys(subscriber ?? {}).includes(userInfo.uid)
      }
    )

  $db
    .ref('/contents/')
    .orderByChild('uid')
    .equalTo(uid)
    .limitToLast(1)
    .once('value', (snapshot: any) => {
      const data = snapshot.val()

      if (data) {
        const key = Object.keys(data)[0]
        const value = data[key]

        books.value.unshift(value)
      }
    })
})

onMounted(() => {
  $db
    .ref('/contents/')
    .orderByChild('uid')
    .equalTo(uid)
    .limitToLast(1)
    .once('value')
    .then((res: any) => res.val())
    .then((res: any) => {
      if (res) {
        const key = Object.keys(res)[0]
        const data = res[key]

        books.value.unshift(data)
      }
    })
})

const Subscribe = () => {
  if (blockSubscribe.value > 3) return

  if (subscribed.value) {
    $db.ref(`/users/${userInfo.uid}/subscribe/${uid}`).remove()
    $db.ref(`/users/${uid}/subscriber/${userInfo.uid}`).remove()

    delete subscription[userInfo.uid]
    subscribed.value = false
    subCount.value--
    targetUser.value.libris -= 15

    Libris(uid, -15)
    Libris(userInfo.uid, -15)
  } else {
    $db
      .ref(`/users/${userInfo.uid}/subscribe/${uid}`)
      .set(targetUser.value.displayName)
    $db
      .ref(`/users/${uid}/subscriber/${userInfo.uid}`)
      .set(userInfo.displayName)

    subscription[userInfo.uid] = userInfo.displayName
    subscribed.value = true
    subCount.value++
    targetUser.value.libris += 15

    Libris(uid, 15)
    Libris(userInfo.uid, 15)
    Notify(
      uid,
      userInfo.photoURL,
      `${userInfo.displayName}님이 구독했습니다`,
      `/user/${uid}`
    )
  }

  blockSubscribe.value += 1
}

useHead({
  title: '사용자 - LCW'
})
</script>

<style scoped>
.imgback {
  position: absolute;
  top: 0;
  left: 0;
}

@media (max-width: 600px) {
  .badge {
    flex-direction: column;
  }
}
</style>

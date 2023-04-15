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

    <v-tabs v-model="tab" center-active grow :bg-color="themeColor()">
      <v-tab> 홈 </v-tab>
      <v-tab> 게시물 </v-tab>
      <v-tab v-if="!mobile"> 구독자 </v-tab>
      <v-tab v-if="!mobile" @click="FetchUserStats"> 정보 </v-tab>
      <v-tab v-if="!mobile" @click="FetchUserStats"> 업적 </v-tab>

      <v-menu v-if="mobile">
        <template #activator="{ props }">
          <v-btn
            variant="plain"
            rounded="0"
            class="align-self-center me-4"
            height="100%"
            v-bind="props"
          >
            더보기
            <v-icon end> mdi-menu-down </v-icon>
          </v-btn>
        </template>

        <v-list ey-li="bg-grey-lighten-3">
          <v-list-item @click="tab = 2"> 구독자 </v-list-item>
          <v-list-item @click="tab = 3"> 정보 </v-list-item>
          <v-list-item @click="tab = 4"> 업적 </v-list-item>
        </v-list>
      </v-menu>
    </v-tabs>

    <v-window v-model="tab" class="py-5" :color="themeColor()">
      <v-window-item :value="0">
        <v-card
          v-if="chosenBookData || books[0]"
          :class="`d-${mobile ? 'block' : 'flex'}`"
          :to="`/book/content/${(chosenBookData || books[0]).time}`"
        >
          <template #prepend>
            <v-avatar size="250" rounded="0">
              <v-img :src="(chosenBookData || books[0]).image" />
            </v-avatar>
          </template>

          <v-card-text class="d-flex justify-center align-center">
            <div>
              <v-card-title>
                {{ (chosenBookData || books[0]).title }}
              </v-card-title>
              <v-card-subtitle>
                {{ targetUser.displayName }}님의 책
              </v-card-subtitle>

              <v-card-text>
                {{
                  (chosenBookData || books[0]).content?.replaceAll('&lt;br>', '')
                }}
              </v-card-text>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item :value="1">
        <BookList :user="uid" star />
      </v-window-item>

      <v-window-item :value="2">
        <UserSubs :subscription="subscription" />
      </v-window-item>

      <v-window-item :value="3">
        <UserStats
          :user="uid"
          :length="books.length"
          :target-user="targetUser"
          :read-count="readCount"
          :like-count="likeCount"
          :avg-rating="avgRating"
        />
      </v-window-item>

      <v-window-item :value="4">
        <UserBadge
          :sub-count="subCount"
          :read-count="readCount"
          :length="books.length"
        />
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { $db } = useNuxtApp()

const { mobile } = useDisplay()
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
const privateBooks = ref<any>([])
const subscription = ref<any>({})
const subscribed = ref<boolean>(false)

const subCount = ref<number>(0)
const likeCount = ref<number>(0)
const readCount = ref<number>(0)
const avgRating = ref<number>(0)

const chosenBookData = ref<any>({})

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
          .on('value', async (s: any) => (chosenBookData.value = await s.val()))

        subscription.value = subscriber ?? []
        subCount.value = Object.keys(subscriber ?? {}).length
        subscribed.value = Object.keys(subscriber ?? {}).includes(userInfo.uid)
      }
    )

  if (userInfo.uid === uid) {
    $db.ref(`/private/${uid}/`).on('child_added', async (s: any) => {
      const data = await s.val()
      privateBooks.value.unshift(data)
    })
  }
})

const FetchUserStats = () => {
  $db.ref('/contents/').on('child_added', async (s: any) => {
    const data = await s.val()

    if (data.uid === uid) {
      readCount.value += data.views
      likeCount.value += data.likes
      avgRating.value += data.rating

      books.value.unshift(data)
    }
  })
}

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

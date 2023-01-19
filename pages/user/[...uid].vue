<template>
  <div>
    <v-row class="mb-5">
      <v-avatar size="70" class="mt-4 ml-5">
        <UserPhoto :src="targetUser?.photoURL" />
      </v-avatar>

      <div class="d-flex align-center">
        <div>
          <v-card-title>{{ targetUser.displayName }}</v-card-title>
          <v-card-subtitle class="text--grey">
            구독자 {{ formatter(subCount) }}명
          </v-card-subtitle>
        </div>
      </div>

      <div class="ml-auto my-auto float-right mr-5">
        <v-btn rounded="lg"
          v-if="userInfo.uid !== uid"
          variant="tonal"
          color="red"
          class="rounded-xl"
          @click="Subscribe"
        >
          {{ subscribed ? '구독 취소' : '구독' }}
        </v-btn>
        <v-btn rounded="lg"
          v-else
          variant="tonal"
          color="primary"
          to="/account/account"
          class="rounded-xl"
        >
          편집 <v-icon right> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-row>

    <v-tabs v-model="tab" show-arrows center-active grow bg-color="#23262e">
      <v-tab> 홈 </v-tab>
      <v-tab> 게시물 </v-tab>
      <v-tab> 구독자 </v-tab>
      <v-tab> 정보 </v-tab>
      <v-tab v-if="userInfo.uid === uid"> 비공개 글 </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="py-5" color="#23262e">
      <v-window-item :value="0">
        <v-card
          v-if="books.length > 0"
          :class="`elevation-0 d-${mobile ? 'block' : 'flex'}`"
          color="#23262e"
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

              <v-card-text v-html="(chosenBookData || books[0]).content" />
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item :value="1">
        <v-select
          v-model="rating"
          variant="outlined"
          :items="['모두', 5, 4, 3, 2, 1]"
          label="평점 선택"
          flat
          prepend-inner-icon="mdi-star"
        />
        <LazyBookCard :items="books.filter(ratingFilter)" :simple="true" />
      </v-window-item>

      <v-window-item :value="2">
        <v-list nav bg-color="#23262e">
          <v-list-item
            v-for="(item, UID) in subscription"
            v-show="item"
            :key="UID"
            :to="`/user/${UID}`"
          >
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-window-item>

      <v-window-item :value="3">
        <div v-if="targetUser.bio" class="my-10">
          <v-card-title>{{ targetUser.bio }}</v-card-title>
        </div>

        <v-list flat class="rounded-lg">
          <v-list-item>
            <template #prepend>
              <v-icon> mdi-crown-circle </v-icon>
            </template>

            <v-list-item-title>
              리브리스:
              {{ Math.round(targetUser.libris) }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon> mdi-book </v-icon>
            </template>

            <v-list-item-title>
              총 책 업로드: {{ books.length }}
            </v-list-item-title>
          </v-list-item>

          <v-list-item>
            <template #prepend>
              <v-icon> mdi-card-account-details </v-icon>
            </template>

            <v-list-item-title> UID: {{ uid }} </v-list-item-title>
          </v-list-item>

          <template v-if="books.length > 0">
            <v-divider />

            <v-list-item>
              <template #prepend>
                <v-icon> mdi-read </v-icon>
              </template>

              <v-list-item-title>
                사람들이 책 읽은 수: {{ formatter(readCount) }}번
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon> mdi-thumbs-up-down </v-icon>
              </template>

              <v-list-item-title>
                총 좋아요: {{ formatter(likeCount) }}번
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item>
              <template #prepend>
                <v-icon> mdi-star </v-icon>
              </template>

              <v-list-item-title>
                평균 평점: {{ (avgRating / books.length).toFixed(2) }}
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon> mdi-read </v-icon>
              </template>

              <v-list-item-title>
                권당 평균 읽힌 수:
                {{ (readCount / books.length).toFixed(2) }}번
              </v-list-item-title>
            </v-list-item>

            <v-list-item>
              <template #prepend>
                <v-icon> mdi-thumbs-up-down </v-icon>
              </template>

              <v-list-item-title>
                권당 평균 좋아요:
                {{ (likeCount / books.length).toFixed(2) }}번
              </v-list-item-title>
            </v-list-item>
          </template>
        </v-list>
      </v-window-item>

      <v-window-item :value="4">
        <LazyBookCard
          v-if="privateBooks.length > 0"
          :items="privateBooks"
          :simple="true"
        />
        <v-card v-else color="#23262e" class="elevation-0">
          <v-card-text>비공개 글이 없습니다.</v-card-text>
        </v-card>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const { $db } = useNuxtApp()

const { mobile } = useDisplay()
const userInfo = User()
const route = useRoute()

const rating = ref<string>('모두')
const tab = ref<string>('홈')
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

onBeforeMount(() => {
  $db.ref('/contents/').on('child_added', async (s: any) => {
    const data = await s.val()

    if (data.uid === uid) {
      readCount.value += data.views
      likeCount.value += data.likes
      avgRating.value += data.rating

      books.value.unshift(data)
    }
  })

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
        subscribed.value = Object.keys(subscriber ?? {}).includes(
          userInfo.value.uid
        )
      }
    )

  if (userInfo.value.uid === uid) {
    $db.ref(`/private/${uid}/`).on('child_added', async (s: any) => {
      const data = await s.val()
      privateBooks.value.unshift(data)
    })
  }
})

const Subscribe = () => {
  if (subscribed.value) {
    $db.ref(`/users/${userInfo.value.uid}/subscribe/${uid}`).remove()
    $db.ref(`/users/${uid}/subscriber/${userInfo.value.uid}`).remove()

    delete subscription[userInfo.value.uid]
    subscribed.value = false
    subCount.value--
    targetUser.value.libris -= 15

    Libris(uid, -15)
    Libris(userInfo.value.uid, -15)
  } else {
    $db
      .ref(`/users/${userInfo.value.uid}/subscribe/${uid}`)
      .set(targetUser.value.displayName)
    $db
      .ref(`/users/${uid}/subscriber/${userInfo.value.uid}`)
      .set(userInfo.value.displayName)

    subscription[userInfo.value.uid] = userInfo.value.displayName
    subscribed.value = true
    subCount.value++
    targetUser.value.libris += 15

    Libris(uid, 15)
    Libris(userInfo.value.uid, 15)
    Notify(
      uid,
      userInfo.value.photoURL,
      `${userInfo.value.displayName}님이 구독했습니다`,
      `/user/${uid}`
    )
  }
}

const ratingFilter = (a: any) =>
  rating.value === '모두' ? 1 : a.rating === rating.value

useHead({
  title: '사용자 - LCW'
})
</script>

<script lang="ts">
export default {
  name: 'User',
  inheritAttrs: false,
  customOptions: {}
}
</script>

<style scoped>
.imgback {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

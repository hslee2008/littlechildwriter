<template>
  <div>
    <v-row class="mb-5">
      <v-avatar size="75" class="mt-4 ml-5">
        <UserPhoto :src="targetUser?.photoURL" :size="75" />
      </v-avatar>

      <div class="d-flex align-center">
        <div>
          <v-card-title>{{ targetUser.displayName }}</v-card-title>
          <v-card-subtitle class="text--grey">
            구독자 {{ formatter(subCount) }}명
          </v-card-subtitle>
        </div>
      </div>

      <div v-if="userInfo.loggedIn" class="ml-auto my-auto float-right mr-5">
        <v-btn
          v-if="userInfo.uid !== uid"
          rounded="lg"
          variant="tonal"
          color="red"
          class="rounded-xl"
          @click="Subscribe"
        >
          {{ subscribed ? '구독 취소' : '구독' }}
        </v-btn>
        <v-btn
          v-else
          rounded="lg"
          variant="tonal"
          color="primary"
          to="/account/account"
          class="rounded-xl"
        >
          편집 <v-icon right> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-row>

    <v-tabs v-model="tab" center-active grow :bg-color="themeColor()">
      <v-tab> 홈 </v-tab>
      <v-tab> 게시물 </v-tab>
      <v-tab v-if="!mobile"> 구독자 </v-tab>
      <v-tab v-if="!mobile"> 정보 </v-tab>
      <v-tab v-if="!mobile"> 업적 </v-tab>

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
          v-if="books.length > 0"
          :class="`elevation-0 d-${mobile ? 'block' : 'flex'}`"
          :color="themeColor()"
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
                  (chosenBookData || books[0]).content.replaceAll('&lt;br>', '')
                }}
              </v-card-text>
            </div>
          </v-card-text>
        </v-card>
      </v-window-item>

      <v-window-item :value="1">
        <ListComponent :user="uid" star />
      </v-window-item>

      <v-window-item :value="2">
        <v-list nav :bg-color="themeColor()">
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
        <div class="d-flex justify-center align-center badge">
          <v-card
            v-if="readCount > 9"
            class="d-flex justify-center elevation-0"
            :color="themeColor()"
          >
            <v-tooltip :text="readCount.toString()" location="bottom">
              <template #activator="{ props }">
                <v-badge
                  v-bind="props"
                  color="primary"
                  location="bottom end"
                  offset-x="75"
                  :offset-y="mobile ? 150 : 200"
                  :content="`x ${Math.floor(Math.log10(readCount))}`"
                >
                  <v-img src="/img/views.png" :width="mobile ? 200 : 300" />
                </v-badge>
              </template>
            </v-tooltip>
          </v-card>

          <v-card
            v-if="subCount > 1"
            class="d-flex justify-center elevation-0"
            :color="themeColor()"
          >
            <v-tooltip
              :text="`구독자: ${subCount.toString()}`"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-badge
                  v-bind="props"
                  color="primary"
                  location="bottom end"
                  offset-x="75"
                  :offset-y="mobile ? 150 : 200"
                  :content="`x ${Math.floor(Math.log2(subCount))}`"
                >
                  <v-img src="/img/followers.png" :width="mobile ? 200 : 300" />
                </v-badge>
              </template>
            </v-tooltip>
          </v-card>

          <v-card
            v-if="books.length > 9"
            class="d-flex justify-center elevation-0"
            :color="themeColor()"
          >
            <v-tooltip
              :text="`업로드 수: ${books.length.toString()}`"
              location="bottom"
            >
              <template #activator="{ props }">
                <v-badge
                  v-bind="props"
                  color="primary"
                  location="bottom end"
                  offset-x="75"
                  :offset-y="mobile ? 150 : 200"
                  :content="`x ${Math.floor(Math.log10(books.length))}`"
                >
                  <v-img src="/img/uploads.png" :width="mobile ? 200 : 300" />
                </v-badge>
              </template>
            </v-tooltip>
          </v-card>
        </div>
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
  bio: '',
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
          bio,
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

const Subscribe = () => {
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
}

useHead({
  title: '사용자 - LCW',
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

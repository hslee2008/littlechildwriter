<template>
  <div>
    <v-row class="mb-5">
      <v-avatar size="80" class="mt-2">
        <UserPhoto :src="targetUser.photoURL" />
      </v-avatar>

      <div class="d-flex align-center">
        <div>
          <v-card-title>{{ targetUser.displayName }}</v-card-title>
          <v-card-subtitle class="grey--text">
            구독자 {{ formatter.format(subCount) }}명
          </v-card-subtitle>
        </div>
      </div>

      <div class="ml-auto my-auto float-right">
        <v-btn
          v-if="userInfo.uid !== uid"
          color="red"
          class="rounded-xl"
          @click="Subscribe"
        >
          {{ subscribed ? '구독 취소' : '구독' }}
        </v-btn>
        <v-btn v-else color="primary" to="/account/account" class="rounded-xl">
          편집 <v-icon right> mdi-pencil </v-icon>
        </v-btn>
      </div>
    </v-row>

    <v-tabs v-model="tab" show-arrows center-active grow class="transparent">
      <v-tab> 게시물 </v-tab>
      <v-tab> 구독자 </v-tab>
      <v-tab> 정보 </v-tab>
      <v-tab v-if="userInfo.uid === uid"> 비공개 글 </v-tab>

      <v-tabs-items v-model="tab" class="py-5 transparent">
        <v-tab-item>
          <v-select
            v-model="rating"
            :items="['모두', 5, 4, 3, 2, 1]"
            label="평점 선택"
            outlined
            prepend-inner-icon="mdi-star"
          />
          <LazyBookCard :items="books.filter(ratingFilter)" :simple="true" />
        </v-tab-item>

        <v-tab-item>
          <v-list nav class="transparent">
            <v-list-item
              v-for="(item, UID) in subscription"
              :key="item"
              :to="`/user/${UID}`"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <div v-if="targetUser.bio">
            <v-card-title>{{ targetUser.bio }}</v-card-title>
            <v-divider class="my-10" />
          </div>

          <v-list flat class="rounded-lg">
            <v-subheader>통계</v-subheader>

            <v-list-item>
              <v-list-item-icon>
                <v-icon> mdi-crown-circle </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  리브리스:
                  {{ Math.round(targetUser.libris) }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon> mdi-book </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  총 책 업로드: {{ books.length }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <LazyBookCard :items="books" :simple="true" :showprivate="true" />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <br /><br />
  </div>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { formatter, User } from '@/plugins/global'

const userInfo = User()
const route = useRoute()
const rating = ref<string>('모두')
const tab = ref<number>(0)
const uid = route.params.uid
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

onBeforeMount(() => {
  db.ref('/contents/').on('child_added', async s => {
    const data = await s.val()
    data.uid === uid && books.value.unshift(data)
  })

  db.ref(`/users/${uid}/`)
    .once('value')
    .then(res => res.val())
    .then(({ libris, displayName, photoURL, bio, subscriber }) => {
      targetUser.value = {
        libris,
        displayName,
        photoURL,
        bio
      }

      subscription.value = subscriber ?? []
      subCount.value = Object.keys(subscriber).length
      subscribed.value = Object.keys(subscriber).includes(userInfo.value.uid)
    })
})

const Subscribe = () => {
  if (subscribed.value) {
    db.ref(`/users/${userInfo.value.uid}/subscribe/${uid}`).remove()
    db.ref(`/users/${uid}/subscriber/${userInfo.value.uid}`).remove()

    delete subscription[userInfo.value.uid]
    subscribed.value = false
    subCount.value--
    targetUser.value.libris -= 10

    Libris(uid, -10)
  } else {
    db.ref(`/users/${userInfo.value.uid}/subscribe/${uid}`).set(
      targetUser.value.displayName
    )
    db.ref(`/users/${uid}/subscriber/${userInfo.value.uid}`).set(
      userInfo.value.displayName
    )

    subscription[userInfo.value.uid] = userInfo.value.displayName
    subscribed.value = true
    subCount.value++
    targetUser.value.libris += 10

    Libris(uid, 10)
  }
}

const ratingFilter = (a: any) => (rating.value === '모두' ? 1 : a.rating === rating.value)

useHead({
  title: '유저 - LCW'
})
</script>

<style scoped>
.imgback {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

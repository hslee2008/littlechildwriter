<template>
  <div>
    <v-row class="mb-5">
      <v-avatar size="70" class="mt-2">
        <UserPhoto :src="targetUser.photoURL" />
      </v-avatar>

      <div class="d-flex align-center">
        <div>
          <v-card-title>{{ targetUser.displayName }}</v-card-title>
          <v-card-subtitle class="grey--text">
            구독자 {{ formatter(subCount) }}명
          </v-card-subtitle>
        </div>
      </div>

      <div class="ml-auto my-auto float-right">
        <v-btn
          v-if="userInfo.uid !== uid"
          color="red"
          class="rounded-xl"
          :small="$vuetify.breakpoint.smAndDown"
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
      <v-tab> 홈 </v-tab>
      <v-tab> 게시물 </v-tab>
      <v-tab> 구독자 </v-tab>
      <v-tab> 정보 </v-tab>
      <v-tab v-if="userInfo.uid === uid"> 비공개 글 </v-tab>

      <v-tabs-items v-model="tab" class="py-5 transparent">
        <v-tab-item>
          <v-card
            :class="`transparent d-${
              $vuetify.breakpoint.mobile ? 'block' : 'flex'
            }`"
            :to="`/book/content/${(chosenBookData || books[0]).time}`"
          >
            <img
              :src="(chosenBookData || books[0]).image"
              class="rounded-lg ma-2"
              width="250px"
            />

            <v-card-text>
              <v-card-title>
                {{ (chosenBookData || books[0]).title }}
              </v-card-title>
              <v-card-subtitle>
                {{ targetUser.displayName }}님의 책
              </v-card-subtitle>

              <v-card-text v-html="(chosenBookData || books[0]).content" />
            </v-card-text>
          </v-card>
        </v-tab-item>

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
              :key="UID"
              :to="`/user/${UID}`"
            >
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <div v-if="targetUser.bio" class="my-10">
            <v-card-title>{{ targetUser.bio }}</v-card-title>
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
            <v-list-item>
              <v-list-item-icon>
                <v-icon> mdi-card-account-details </v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title> UID: {{ uid }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>

            <template v-if="books.length > 0">
              <v-divider />

              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-read </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    사람들이 책 읽은 수: {{ formatter(readCount) }}번
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-thumbs-up-down </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    총 좋아요: {{ formatter(likeCount) }}번
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>

              <v-divider />

              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-star </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    평균 평점: {{ (avgRating / books.length).toFixed(2) }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-read </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    권당 평균 읽힌 수:
                    {{ (readCount / books.length).toFixed(2) }}번
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-icon>
                  <v-icon> mdi-thumbs-up-down </v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    권당 평균 좋아요:
                    {{ (likeCount / books.length).toFixed(2) }}번
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
          </v-list>

          <line-chart
            :chart-options="chartOptions"
            :chart-data="chartData"
            class="mt-5"
          />
        </v-tab-item>

        <v-tab-item>
          <LazyBookCard
            v-if="privateBooks.length > 0"
            :items="privateBooks"
            :simple="true"
          />
          <v-card v-else class="transparent">
            <v-card-text>비공개 글이 없습니다.</v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>

<script setup lang="ts">
import { db } from 'plugins/firebase'
import { formatter, User } from 'plugins/global'

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
const privateBooks = ref<any>([])
const subscription = ref<any>({})
const subscribed = ref<boolean>(false)

const subCount = ref<number>(0)
const likeCount = ref<number>(0)
const readCount = ref<number>(0)
const avgRating = ref<number>(0)

const chosenBookData = ref<any>({})

const byMonth = ref<any>([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0])

const chartOptions = ref<any>({
  type: 'line',
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: '월별 업로드 수'
    }
  }
})

const chartData = ref<any>({
  labels: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월'
  ],
  datasets: [
    {
      label: '책 올린 수',
      data: byMonth.value,
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
      tension: 0.1,
      fill: false
    }
  ]
})

onBeforeMount(() => {
  db.ref('/contents/').on('child_added', async s => {
    const data = await s.val()

    if (data.uid === uid) {
      byMonth.value[new Date(data.time).getMonth()]++
      readCount.value += data.views
      likeCount.value += data.likes
      avgRating.value += data.rating

      books.value.unshift(data)
    }
  })

  db.ref(`/users/${uid}/`)
    .once('value')
    .then(res => res.val())
    .then(({ libris, displayName, photoURL, bio, subscriber, featured }) => {
      targetUser.value = {
        libris,
        displayName,
        photoURL,
        bio
      }

      db.ref(`/contents/${featured}`).on(
        'value',
        async s => (chosenBookData.value = await s.val())
      )

      subscription.value = subscriber ?? []
      subCount.value = Object.keys(subscriber ?? {}).length
      subscribed.value = Object.keys(subscriber ?? {}).includes(
        userInfo.value.uid
      )
    })

  if (userInfo.value.uid === uid) {
    db.ref(`/private/${uid}/`).on('child_added', async s => {
      const data = await s.val()
      privateBooks.value.unshift(data)
    })
  }
})

const Subscribe = () => {
  if (subscribed.value) {
    db.ref(`/users/${userInfo.value.uid}/subscribe/${uid}`).remove()
    db.ref(`/users/${uid}/subscriber/${userInfo.value.uid}`).remove()

    delete subscription[userInfo.value.uid]
    subscribed.value = false
    subCount.value--
    targetUser.value.libris -= 15

    Libris(uid, -15)
    Libris(userInfo.value.uid, -15)
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
  title: `사용자 - LCW`
})
</script>

<style scoped>
.imgback {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

<script lang="ts">
export default {
  name: 'User',
  inheritAttrs: false,
  customOptions: {}
}
</script>

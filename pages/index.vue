<template>
  <div>
    <v-parallax
      :src="image"
      :height="y === 0 ? height - 64 : 450"
      class="parallax align-center"
      scale="contain"
    >
      <v-col class="d-flex justify-center align-center">
        <div>
          <div class="text-center mb-5 mt-3 button">
            <v-btn
              v-if="userInfo.loggedIn"
              rounded="xl"
              to="/book/post"
              color="primary"
              min-width="300"
              prepend-icon="mdi-pencil"
            >
              작성하기
            </v-btn>
            <v-btn
              v-else
              rounded="xl"
              to="/account/login"
              color="primary"
              min-width="300"
              append-icon="mdi-account"
            >
              로그인
            </v-btn>
          </div>

          <v-card
            class="d-flex justify-center align-center rounded-xl ma-auto text-center"
            height="250"
            max-width="450"
            :elevation="5"
          >
            <div>
              <v-card-title class="text-h4">Little 작가</v-card-title>
              <v-card-subtitle>Little Child Writer</v-card-subtitle>
            </div>
          </v-card>

          <div class="d-flex justify-center mb-3 mt-5">
            <v-btn
              rounded="lg"
              to="/book/list"
              class="mx-3"
              append-icon="mdi-format-list-text"
            >
              글
            </v-btn>
            <v-btn
              rounded="lg"
              to="/class/classes"
              class="mx-3"
              append-icon="mdi-school"
            >
              알림판
            </v-btn>
          </div>
          <div class="d-flex justify-center mb-10">
            <v-btn
              rounded="lg"
              to="/debate/home"
              class="mr-2"
              append-icon="mdi-lectern"
            >
              토론 광장
            </v-btn>
            <v-btn rounded="lg" to="/blog/home" append-icon="mdi-typewriter">
              창작 코너
            </v-btn>
          </div>
        </div>
      </v-col>
    </v-parallax>

    <v-tabs
      v-model="tab"
      show-arrows
      center-active
      grow
      class="transparent mt-5"
    >
      <v-tab>최근 순</v-tab>
      <v-tab @click="FetchLikes">좋아요 순</v-tab>
      <v-tab @click="FetchViews">인기 순</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item :value="0">
        <BookCard :items="time" :simple="true" />
      </v-window-item>
      <v-window-item :value="1">
        <BookCard :items="likes" :simple="true" />
      </v-window-item>
      <v-window-item :value="2">
        <BookCard :items="views" :simple="true" />
      </v-window-item>
    </v-window>

    <v-card class="mx-3 my-10" color="#385F73">
      <v-card-title>
        핀
        <v-tooltip right>
          <template #activator="{ props }">
            <v-icon color="grey" size="small" v-bind="props">
              mdi-information-outline
            </v-icon>
          </template>
          <span> 설정에서 Libris를 사용해서 핀을 설정할 수 있습니다. </span>
        </v-tooltip>
      </v-card-title>

      <v-card-text v-if="Keys(pin).length > 0">
        <div v-for="(item, i) in Values(pin)" :key="i">
          <BookSingle :data="item.book" :colored="true" />
        </div>
      </v-card-text>
      <v-card-text v-else>
        <div class="text-center">
          <v-icon size="100">mdi-pin-off-outline</v-icon>
          <div>핀이 없습니다.</div>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mx-1 my-10">
      <v-card-text class="text-center">
        <h2>명예의 전당</h2>
        <UserList :limit="true" />

        <div class="text-center">
          <v-btn rounded="lg" variant="tonal" to="/libris/libris">
            더보기
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { useWindowScroll, useWindowSize } from '@vueuse/core'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { x, y } = useWindowScroll()
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { width, height } = useWindowSize()

const userInfo = User()
const time = ref<any>([])
const likes = ref<any[]>([])
const views = ref<any[]>([])
const tab = ref<number>(0)
const pin = ref<any[]>([])
const pinnedBooks = ref<any[]>([])

const list = [
  'https://static01.nyt.com/images/2015/10/24/opinion/24manguel/24manguel-superJumbo.jpg',
  'https://www.protocol.com/media-library/librarians-depend-on-libby-but-they-also-worry-that-its-newfound-likesity-could-seriously-strain-their-budgets.jpg?id=25634798&width=1245&height=700&quality=85&coordinates=0%2C230%2C0%2C230',
  'https://www.eastman.org/sites/default/files/styles/full_width_slider/public/library-01-1920_0.jpg.webp?itok=fiWZlYpB',
  'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl16915765068-image-kybem7r7.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=1051d18eb5124f051dcce8f4f702dff3',
  'https://livestorm.imgix.net/1127/1642785418-home_017.jpg?w=1280&h=720&fit=crop&dl=wall-of-bookshelves-in-cozy-library.jpg',
  'https://cdn.wallpapersafari.com/0/80/KIiEkW.jpg'
]
const image = ref<string>('https://cdn.wallpapersafari.com/0/80/KIiEkW.jpg')

onMounted(() => {
  $db
    .ref('/contents')
    .limitToLast(mobile.value ? 4 : 5)
    .once('value', (s: any) => (time.value = Object.values(s.val()).reverse()))

  $db.ref('/pin').once('value', (s: any) => {
    if (!s.val()) return

    const data = s.val()

    pin.value = data

    for (let i = 0; i < 2; i++) {
      pinnedBooks.value.push(data[Keys(data)[i]]?.book)
    }
  })

  setInterval(
    () => (image.value = list[Math.floor(Math.random() * list.length)]),
    600000
  )
})

onMounted(() => {
  setTimeout(() => {
    for (let i = 0; i < Keys(pin.value).length; i++) {
      // check the value of pin time and delete it if it is over 1 week
      if (Object.values(pin.value)[i].time < new Date().getTime() - 604800000) {
        $db.ref(`/pin/${Keys(pin.value)[i]}`).remove()
      }
    }
  }, 3000)
})

const FetchLikes = () => {
  if (likes.value.length > 0) return

  $db
    .ref('/contents')
    .orderByChild('likes')
    .limitToLast(mobile.value ? 4 : 5)
    .once('value', (s: any) => (likes.value = Object.values(s.val()).reverse()))
}

const FetchViews = () => {
  if (views.value.length > 0) return

  $db
    .ref('/contents')
    .orderByChild('views')
    .limitToLast(mobile.value ? 4 : 5)
    .once('value', (s: any) => (views.value = Object.values(s.val()).reverse()))
}
</script>

<style scoped>
.button {
  margin-top: 100px;
}

.parallax {
  opacity: 0.9;
  transition: 0.5s;
}

.parallax:hover {
  opacity: 1;
}
</style>

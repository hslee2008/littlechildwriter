<template>
  <div>
    <v-parallax :src="image" height="500" class="parallax">
      <v-col class="d-flex justify-center align-center">
        <div>
          <div class="text-center mb-5 mt-3 button">
            <v-btn
              v-if="userInfo.loggedIn"
              rounded="lg"
              to="/book/post"
              color="primary"
              min-width="300"
            >
              <v-icon start> mdi-pencil </v-icon> 작성하기
            </v-btn>
            <v-btn
              v-else
              rounded="lg"
              to="/account/login"
              color="primary"
              min-width="300"
            >
              로그인 <v-icon right> mdi-account </v-icon>
            </v-btn>
          </div>

          <v-card
            class="d-flex justify-center align-center pa-10 rounded-lg ma-auto"
            height="300"
            max-width="500"
            :elevation="2"
          >
            <div>
              <h1>Little 작가</h1>
              <br />
              <p>글을 올리고, 새롭게 배우고, 대화하기!</p>
            </div>
          </v-card>

          <div class="d-flex justify-center mb-3 mt-5">
            <v-btn rounded="lg" to="/book/list" class="mx-3">
              글 <v-icon right> mdi-format-list-text </v-icon>
            </v-btn>
            <v-btn rounded="lg" to="/class/classes" class="mx-3">
              알림판
              <v-icon right> mdi-clipboard-multiple </v-icon>
            </v-btn>
          </div>
          <div class="d-flex justify-center">
            <v-btn rounded="lg" to="/debate/home" class="mr-2">
              토론 광장 <v-icon right> mdi-lectern </v-icon>
            </v-btn>
            <v-btn rounded="lg" to="/blog/home">
              창작 코너 <v-icon right> mdi-typewriter </v-icon>
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
      <v-tab>최근 포스트</v-tab>
      <v-tab @click="FetchLikes">좋아요 많은 포스트</v-tab>
      <v-tab @click="FetchViews">인기있는 포스트</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item :value="0">
        <BookCard :items="recent" :simple="true" />
      </v-window-item>
      <v-window-item :value="1">
        <BookCard :items="popular" :simple="true" />
      </v-window-item>
      <v-window-item :value="2">
        <BookCard :items="views" :simple="true" />
      </v-window-item>
    </v-window>

    <v-card v-if="pin" class="mx-1 my-10" color="#385F73">
      <v-card-title>
        핀
        <v-tooltip right>
          <template #activator="{ props }">
            <v-icon color="grey" size="small" v-bind="props">
              mdi-information-outline
            </v-icon>
          </template>
          <span>
            설정에서 Libris를 사용해서 핀을 설정할 수 있습니다.
          </span>
        </v-tooltip>
      </v-card-title>
      <v-card-text>
        <div v-for="item in pinnedBooks" :key="item.time">
          <BookSingle :data="item" target-user="" :colored="true" />
        </div>
      </v-card-text>
    </v-card>

    <v-card class="mx-1 my-10">
      <v-card-text>
        <h2>명예의 전당</h2>
        <UserLibris :limit="true" />

        <div class="text-center">
          <v-btn rounded="lg" variant="tonal" to="/libris/libris">
            더보기
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <br />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()

const userInfo = User()
const recent = ref<any>([])
const popular = ref<any[]>([])
const views = ref<any[]>([])
const tab = ref<number>(0)
const pin = ref<any[]>([])
const pinnedBooks = ref<any[]>([])

const list = [
  'https://static01.nyt.com/images/2015/10/24/opinion/24manguel/24manguel-superJumbo.jpg',
  'https://www.protocol.com/media-library/librarians-depend-on-libby-but-they-also-worry-that-its-newfound-popularity-could-seriously-strain-their-budgets.jpg?id=25634798&width=1245&height=700&quality=85&coordinates=0%2C230%2C0%2C230',
  'https://www.eastman.org/sites/default/files/styles/full_width_slider/public/library-01-1920_0.jpg.webp?itok=fiWZlYpB',
  'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl16915765068-image-kybem7r7.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=1051d18eb5124f051dcce8f4f702dff3',
  'https://livestorm.imgix.net/1127/1642785418-home_017.jpg?w=1280&h=720&fit=crop&dl=wall-of-bookshelves-in-cozy-library.jpg',
  'https://cdn.wallpapersafari.com/0/80/KIiEkW.jpg'
]
const image = ref<string>('https://cdn.wallpapersafari.com/0/80/KIiEkW.jpg')

onBeforeMount(() => {
  $db
    .ref('/contents')
    .limitToLast(mobile.value ? 4 : 5)
    .on('child_added', async (s: any) => recent.value.unshift(await s.val()))

  $db.ref('/pin').once('value', (s: any) => {
    const data = s.val()

    pin.value = data

    for (let i = 0; i < Object.keys(data).length; i++) {
      pinnedBooks.value.push(data[Object.keys(data)[i]].book)
    }
  })

  setInterval(
    () => (image.value = list[Math.floor(Math.random() * list.length)]),
    600000
  )
})

onMounted(() => {
  setTimeout(() => {
    for (let i = 0; i < Object.keys(pin.value).length; i++) {
      // check the value of pin time and delete it if it is over 1 week
      if (Object.values(pin.value)[i].time < new Date().getTime() - 604800000) {
        $db.ref(`/pin/${Object.keys(pin.value)[i]}`).remove()
      }
    }
  }, 3000)
})

const FetchLikes = () => {
  if (popular.value.length > 0) return

  $db
    .ref('/contents')
    .orderByChild('likes')
    .limitToLast(mobile.value ? 4 : 5)
    .on('child_added', async (s: any) => popular.value.unshift(await s.val()))
}

const FetchViews = () => {
  if (views.value.length > 0) return

  $db
    .ref('/contents')
    .orderByChild('views')
    .limitToLast(mobile.value ? 4 : 5)
    .on('child_added', async (s: any) => views.value.unshift(await s.val()))
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

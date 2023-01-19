<template>
  <div>
    <v-parallax :src="image" height="500" class="parallax">
      <v-col class="d-flex justify-center align-center">
        <div>
          <div class="text-center mb-5 mt-3 button">
            <v-btn
              rounded="lg"
              v-if="userInfo.uid"
              to="/book/post"
              color="primary"
              min-width="300"
            >
              <v-icon start> mdi-pencil </v-icon> 작성하기
            </v-btn>
            <v-btn
              rounded="lg"
              v-else
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
            <v-btn rounded="lg" to="/list" class="mx-3">
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
      <v-tab>좋아요 많은 포스트</v-tab>
      <v-tab>인기있는 포스트</v-tab>
    </v-tabs>

    <v-window v-model="tab">
      <v-window-item :value="0">
        <BookCard :items="recent" :simple="true" />
      </v-window-item>
      <v-window-item :value="1">
        <LazyBookCard :items="popular" :simple="true" />
      </v-window-item>
      <v-window-item :value="2">
        <LazyBookCard :items="views" :simple="true" />
      </v-window-item>
    </v-window>

    <v-card class="mx-5 my-10 elevation-0" :color="themeColor()">
      <v-card-text>
        <h2>명예의 전당</h2>
        <LibrisUsers :limit="true" />

        <div class="text-center">
          <v-btn rounded="lg" variant="tonal" to="/libris/libris">
            더보기
          </v-btn>
        </div>
      </v-card-text>
    </v-card>

    <br />

    <LazyBookCard :items="random" :simple="true" />

    <br />
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const recent = ref<any>([])
const random = ref<any>([])
const popular = ref<any[]>([])
const views = ref<any[]>([])
const tab = ref<number>(0)

const list = [
  'https://static01.nyt.com/images/2015/10/24/opinion/24manguel/24manguel-superJumbo.jpg',
  'https://i.pinimg.com/originals/1b/01/27/1b01274ac5ed6f2a117ba4754c0f8755.jpg',
  './background.avif',
  'https://www.protocol.com/media-library/librarians-depend-on-libby-but-they-also-worry-that-its-newfound-popularity-could-seriously-strain-their-budgets.jpg?id=25634798&width=1245&height=700&quality=85&coordinates=0%2C230%2C0%2C230',
  'https://d4804za1f1gw.cloudfront.net/wp-content/uploads/sites/50/2018/11/06110356/hero.jpg',
  'https://img.freepik.com/premium-photo/pile-books-table-library_130388-600.jpg?w=2000',
  'https://www.eastman.org/sites/default/files/styles/full_width_slider/public/library-01-1920_0.jpg.webp?itok=fiWZlYpB',
  'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/fl16915765068-image-kybem7r7.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=1051d18eb5124f051dcce8f4f702dff3',
  'https://cdn.pixabay.com/photo/2015/10/10/13/03/prague-980732__340.jpg'
]
const image = ref<string>('./background.avif')

onBeforeMount(async () => {
  $db
    .ref('/contents')
    .limitToLast(5)
    .on('child_added', async (s: any) => recent.value.unshift(await s.val()))

  $db
    .ref('/contents')
    .orderByChild('likes')
    .limitToLast(5)
    .on('child_added', async (s: any) => popular.value.unshift(await s.val()))

  $db
    .ref('/contents')
    .orderByChild('views')
    .limitToLast(5)
    .on('child_added', async (s: any) => views.value.unshift(await s.val()))

  const all = await $db
    .ref('/contents')
    .once('value')
    .then((s: any) => s.val())

  random.value = Object.values(all)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  setInterval(
    () => (image.value = list[Math.floor(Math.random() * list.length)]),
    10000
  )
})
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

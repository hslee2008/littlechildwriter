<template>
  <div>
    <v-parallax src="/background.avif" height="500">
      <v-col class="d-flex justify-center align-center">
        <div>
          <div class="text-center mb-5 mt-3 button">
            <v-btn
              v-if="userInfo.uid"
              to="/book/post"
              color="primary"
              min-width="300"
            >
              <v-icon left> mdi-pencil </v-icon> 작성하기
            </v-btn>
            <v-btn v-else to="/account/login" color="primary" min-width="300">
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
            <v-btn to="/list" class="mx-3">
              글 <v-icon right> mdi-format-list-text </v-icon>
            </v-btn>
            <v-btn to="/class/classes" class="mx-3">
              알림판
              <v-icon right> mdi-clipboard-multiple </v-icon>
            </v-btn>
          </div>
          <div class="d-flex justify-center">
            <v-btn to="/debate/home" class="mr-2">
              토론 광장 <v-icon right> mdi-lectern </v-icon>
            </v-btn>
            <v-btn to="/blog/home">
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

    <v-card class="mx-5 my-10 elevation-0" color="#23262e">
      <v-card-text>
        <h2>명예의 전당</h2>
        <LibrisUsers :limit="true" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text to="/libris/libris" color="primary" class="mx-3">
          명예의 전당 더보기
        </v-btn>
      </v-card-actions>
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
})
</script>

<style scoped>
.button {
  margin-top: 100px;
}
</style>

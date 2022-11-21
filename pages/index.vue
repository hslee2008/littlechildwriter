<template>
  <div>
    <v-parallax class="parallax" src="/background.avif">
      <div class="ma-auto">
        <div class="mx-3">
          <v-btn v-if="userInfo.uid" to="/book/post" color="primary" block>
            <v-icon left> mdi-pencil </v-icon> 작성하기
          </v-btn>
          <v-btn v-else to="/account/login" color="primary" block>
            로그인 <v-icon right> mdi-account </v-icon>
          </v-btn>
        </div>

        <v-card
          class="d-flex justify-center align-center pa-10 rounded-lg my-5"
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

        <div class="d-flex justify-center mb-3">
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
    </v-parallax>

    <v-tabs
      v-model="tab"
      show-arrows
      center-active
      grow
      class="transparent"
      style="margin-top: 500px"
    >
      <v-tab>최근 포스트</v-tab>
      <v-tab>좋아요 많은 포스트</v-tab>
      <v-tab>인기있는 포스트</v-tab>

      <v-tabs-items v-model="tab" class="transparent">
        <v-tab-item>
          <BookCard :items="recent" :simple="true" />
        </v-tab-item>
        <v-tab-item>
          <LazyBookCard :items="popular" :simple="true" />
        </v-tab-item>
        <v-tab-item>
          <LazyBookCard :items="views" :simple="true" />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-card class="mx-5 my-10 transparent">
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
import { db } from 'plugins/firebase'
import { Book, User } from 'plugins/global'

const userInfo = User()
const recent = ref<any>([])
const random = ref<any>([])
const popular = ref<Book[]>([])
const views = ref<Book[]>([])
const tab = ref<number>(0)

onBeforeMount(async () => {
  db.ref('/contents')
    .limitToLast(5)
    .on('child_added', async s => recent.value.unshift(await s.val()))

  db.ref('/contents')
    .orderByChild('likes')
    .limitToLast(5)
    .on('child_added', async s => popular.value.unshift(await s.val()))

  db.ref('/contents')
    .orderByChild('views')
    .limitToLast(5)
    .on('child_added', async s => views.value.unshift(await s.val()))

  const all = await db
    .ref('/contents')
    .once('value')
    .then(s => s.val())

  random.value = Object.values(all)
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)
})
</script>

<style scoped>
.parallax {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
</style>

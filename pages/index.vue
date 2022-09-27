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
          class="d-flex justify-center align-center pa-10 rounded-xl my-5"
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

        <div class="d-flex justify-center">
          <v-btn to="/list" class="mx-3">
            글 <v-icon right> mdi-text-box-multiple-outline </v-icon>
          </v-btn>
          <v-btn v-if="userInfo.uid" to="/classes" class="mx-3">
            알림판
            <v-icon right> mdi-checkbox-blank-badge </v-icon>
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
      style="margin-top: 600px"
    >
      <v-tab>최근 포스트</v-tab>
      <v-tab>좋아요 많은 포스트</v-tab>
      <v-tab>인기있는 포스트</v-tab>

      <v-tabs-items v-model="tab" class="transparent">
        <v-tab-item>
          <BookCard :items="recent" :simple="true" />
        </v-tab-item>
        <v-tab-item>
          <BookCard :items="popular" :simple="true" />
        </v-tab-item>
        <v-tab-item>
          <BookCard :items="views" :simple="true" />
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <v-card class="mx-5 my-10 transparent">
      <v-card-text>
        <h2>명예의 전당</h2>
        <LazyLibrisUsers :limit="true" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text to="/libris" color="primary" class="mx-3">
          명예의 전당 더보기
        </v-btn>
      </v-card-actions>
    </v-card>

    <br />
  </div>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { Book, User } from '@/plugins/global'

const userInfo = User()
const recent = ref<Book[]>([])
const popular = ref<Book[]>([])
const views = ref<Book[]>([])
const tab = ref<number>(0)

onBeforeMount(() => {
  db.ref('/contents')
    .limitToLast(4)
    .on('child_added', async s => recent.value.unshift(await s.val()))

  db.ref('/contents')
    .orderByChild('likes')
    .limitToLast(4)
    .on('child_added', async s => popular.value.unshift(await s.val()))

  db.ref('/contents')
    .orderByChild('views')
    .limitToLast(4)
    .on('child_added', async s => views.value.unshift(await s.val()))
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

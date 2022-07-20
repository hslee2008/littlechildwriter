<template>
  <div>
    <v-parallax class="parallax" src="/background.avif">
      <div class="ma-auto">
        <div class="mx-3">
          <v-btn v-if="userInfo.uid" to="/post" color="primary" block>
            글 올리기 <v-icon right> mdi-arrow-right-thin </v-icon>
          </v-btn>
          <v-btn v-else to="/login" color="primary" block>
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
          <v-btn to="/classes" class="mx-3">
            클래스 <v-icon right> mdi-google-classroom </v-icon>
          </v-btn>
        </div>
      </div>
    </v-parallax>

    <v-card-title style="margin-top: 600px"> 최근 포스트 </v-card-title>
    <v-divider class="mx-5 mb-5" />
    <LazyBookCard :items="recent" :uid="userInfo.uid" :simple="true" />

    <v-card-title>인기있는 포스트</v-card-title>
    <v-divider class="mx-5 mb-5" />
    <LazyBookCard :items="popular" :uid="userInfo.uid" :simple="true" />

    <v-card class="mx-5 my-10 transparent">
      <v-card-text>
        <h2>명예의 전당</h2>
        <LazyLibris :limit="true" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn to="/libris" color="primary" class="mx-3">
          명예의 전당 더보기 <v-icon right> mdi-arrow-right-bold </v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  data() {
    return {
      recent: [],
      popular: []
    }
  },
  created() {
    this.postlist()
  },
  methods: {
    postlist() {
      db.ref('/contents')
        .limitToLast(4)
        .on('child_added', async s => this.recent.unshift(await s.val()))

      db.ref('/contents')
        .orderByChild('likes')
        .limitToLast(4)
        .on('child_added', async s => this.popular.unshift(await s.val()))
    }
  }
}
</script>

<style scoped>
.parallax {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
}
</style>

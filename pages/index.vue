<template>
  <div>
    <v-parallax class="parallax" src="/background.avif">
      <div class="ma-auto">
        <div class="mx-3">
          <v-btn v-if="userInfo.uid" to="/book/post" color="primary" block>
            글 올리기 <v-icon right> mdi-arrow-right-thin </v-icon>
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
          <v-btn to="/team/my" class="mx-3">
            팀 플레이 <v-icon right> mdi-microsoft-teams </v-icon>
          </v-btn>
          <v-btn to="/classes" class="mx-3">
            클래스 <v-icon right> mdi-google-classroom </v-icon>
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
        <LazyLibris :limit="true" />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text to="/libris" color="primary" class="mx-3">
          명예의 전당 더보기
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card-title> 팀 명예의 전당 </v-card-title>
    <v-divider class="mx-5 mb-5" />
    <Teams :noTitle="true" />

    <br />
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  data() {
    return {
      recent: [],
      popular: [],
      views: [],
      tab: 0
    }
  },
  created() {
    db.ref('/contents')
      .limitToLast(4)
      .on('child_added', async s => this.recent.unshift(await s.val()))

    db.ref('/contents')
      .orderByChild('likes')
      .limitToLast(4)
      .on('child_added', async s => this.popular.unshift(await s.val()))

    db.ref('/contents')
      .orderByChild('views')
      .limitToLast(4)
      .on('child_added', async s => this.views.unshift(await s.val()))
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

<template>
  <div>
    <v-parallax
      style="position: absolute; left: 0; top: 0; width: 100%"
      src="/background.avif"
    >
      <v-row flex justify="center" class="img-div">
        <div style="margin: auto">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 20 : 2"
              :class="`${
                hover && 'on-hover'
              } d-flex justify-center align-center pa-10 rounded-xl`"
              height="300"
              max-width="500"
            >
              <div>
                <h1>Little 작가</h1>
                <br />
                <p class="blue-grey--text">
                  글을 올리고, 새롭게 배우고, 대화하기
                </p>
              </div>
            </v-card>
          </v-hover>

          <br />

          <div class="d-flex justify-center">
            <div>
              <span v-if="userInfo.loginInfo">
                <v-btn to="/post" color="primary" class="my-3">
                  글 올리기 <v-icon right>mdi-arrow-right-thin</v-icon>
                </v-btn>
              </span>
              <span v-else>
                <v-btn to="/login" color="primary" class="my-3">
                  로그인 <v-icon right>mdi-account</v-icon>
                </v-btn>
              </span>
              <v-btn to="/list">
                모든 글<v-icon right>mdi-text-box-multiple-outline</v-icon>
              </v-btn>
              <v-btn to="/studios"><v-icon>mdi-android-studio</v-icon></v-btn>
            </div>
          </div>
        </div>
      </v-row>
    </v-parallax>

    <v-card-title style="margin-top: 500px">최근 포스트</v-card-title>
    <v-divider class="mx-5 mb-5" />
    <BookCard
      :items="recent"
      :uid="userInfo.uid"
      :displayName="userInfo.userDisplayName"
      :simple="true"
    />

    <v-card-title>인기있는 포스트</v-card-title>
    <v-divider class="mx-5 mb-5" />
    <BookCard
      :items="popular"
      :uid="userInfo.uid"
      :displayName="userInfo.userDisplayName"
      :simple="true"
    />

    <div style="margin: 5px">
      <v-card-title>나의 통계</v-card-title>

      <v-divider class="mx-5 mb-10" />

      <v-row class="mx-5" style="gap: 10px">
        <v-card max-width="344">
          <v-card-text>
            <div>Libris (리브리스)</div>
            <p class="text-h4 text--primary">Little 작가 포인트</p>

            <v-card-title class="white--text mt-8">
              <v-avatar size="45"
                ><v-img
                  src="https://styles.redditmedia.com/t5_2vif5/styles/communityIcon_3wrpkpq1fky01.png?width=256&s=23736b7a09bfce732fb56ff57973e1c4afa74a63"
                ></v-img
              ></v-avatar>
              <v-spacer></v-spacer>
              <v-progress-circular
                v-if="loading"
                indeterminate
              ></v-progress-circular>
              <span class="text-h4" v-else>{{
                Math.round(userInfo.libris)
              }}</span>
            </v-card-title>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="teal accent-4" @click="librisCard = true">
              Libris란??
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card
              v-if="librisCard"
              class="transition-fast-in-fast-out v-card--reveal"
              style="height: 100%"
            >
              <v-card-text class="pb-0">
                <p class="text-h6 text--primary">리브리스란...</p>
                <p>
                  리브리스는 Little 작가 라이브러리 포인트로 사용자들이 글을
                  을리고, 좋아요 버튼 누르고, 매일 사이트 방문하고, 다른 사람의
                  글을 읽으면 리브리스 포인트가 올라갑니다.
                </p>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn text color="teal accent-4" @click="librisCard = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>

        <v-card max-width="344">
          <v-card-text>
            <div>구독자</div>
            <p class="text-h4 text--primary">Little 작가 구독자</p>

            <v-card-title class="white--text mt-8">
              <v-avatar size="45"
                ><v-icon>mdi-youtube-subscription</v-icon>
              </v-avatar>
              <v-spacer></v-spacer>
              <v-progress-circular
                v-if="loading"
                indeterminate
              ></v-progress-circular>
              <span class="text-h4" v-else>{{ userInfo.subscriber }}</span>
            </v-card-title>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="teal accent-4" @click="subscriptionCard = true">
              구독하자!
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card
              v-if="subscriptionCard"
              class="transition-fast-in-fast-out v-card--reveal"
              style="height: 100%"
            >
              <v-card-text class="pb-0">
                <p class="text-h6 text--primary">구독하면...</p>
                <p>
                  구독하면 다른 사람이 글을 작성했을 때 알림을 받고 그 사람의
                  리브리스 포인트도 올라갑니다! 글을 잘 쓰는 사람이 있다면
                  구독해 주세요!
                </p>
              </v-card-text>
              <v-card-actions class="pt-0">
                <v-btn
                  text
                  color="teal accent-4"
                  @click="subscriptionCard = false"
                >
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>
      </v-row>
    </div>

    <br /><br />

    <LibrisCount :librisTop="librisTop.slice(0, 5)" :showActionButton="true" />

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js';

export default {
  name: 'IndexPage',
  data() {
    return {
      librisTop: [],
      recent: [],
      popular: [],

      userInfo: {},

      loading: true,

      librisCard: false,
      subscriptionCard: false,
    };
  },
  methods: {
    postlist() {
      const database = db.ref('/contents/');

      database
        .orderByKey()
        .limitToLast(this.$vuetify.breakpoint.mobile ? 4 : 10)
        .on('child_added', async (s) => this.recent.unshift(await s.val()));

      database
        .orderByChild('likes')
        .limitToLast(this.$vuetify.breakpoint.mobile ? 4 : 10)
        .on('child_added', async (s) => this.popular.unshift(await s.val()));
    },
    topLibrisUsers() {
      db.ref('/users')
        .orderByChild('/libris')
        .on('child_added', async (s) => {
          const data = await s.val();

          this.librisTop.unshift({
            name: data.username,
            libris: data.libris ?? 0,
            image: data.photoURL,
            uid: s.key,
          });
        });
    },
    getUserInfo() {
      auth.onAuthStateChanged(async (u) => {
        u &&
          (this.userInfo = {
            loginInfo: u.uid,
            name: u.displayName,
            image: u.photoURL,
            subscriber: await db
              .ref(`/users/${u.uid}/subscriber`)
              .once('value')
              .then((s) => s.numChildren()),
            libris: await db
              .ref(`/users/${u.uid}/libris`)
              .once('value')
              .then((s) => s.val()),
          });
      });
    },
  },
  async created() {
    this.loading = true;

    await this.getUserInfo();
    this.topLibrisUsers();

    await this.postlist();

    setTimeout(() => (this.loading = false), 1000);
  },
};
</script>

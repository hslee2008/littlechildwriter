<template>
  <div>
    <v-parallax
      style="
        position: absolute;
        right: 0;
        top: 0;
        width: 100%;
        height: calc(100vh - 130px);
      "
      src="https://images5.alphacoders.com/659/thumb-1920-659155.jpg"
    >
      <v-row flex justify="center" class="img-div" style="margin: 5px">
        <div style="margin: auto">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 20 : 2"
              :class="{ 'on-hover': hover }"
              class="mx-auto"
              height="300"
              max-width="500"
              style="
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 20px;
                border-radius: 20px;
              "
            >
              <div>
                <h1>Little 작가</h1>
                <br />
                <p style="color: grey">글을 올리고, 새롭게 배우고, 대화하기</p>
              </div>
            </v-card>
          </v-hover>

          <br />

          <span v-if="userInfo.loginInfo">
            <v-btn to="/post" color="rgb(2, 79, 70)" class="my-3"
              >지금 글 올리기 <v-icon right>mdi-arrow-right-thin</v-icon></v-btn
            >
          </span>
          <span v-else>
            <v-btn to="/login" color="rgb(2, 79, 70)" class="my-3"
              >로그인 하기 <v-icon right>mdi-account</v-icon></v-btn
            >
          </span>
          <v-btn to="/list"
            >모든 글 보기<v-icon right>mdi-book-alphabet</v-icon></v-btn
          >
          <v-btn to="/studios"
            >스튜디오<v-icon right>mdi-android-studio</v-icon></v-btn
          >
        </div>
      </v-row>
    </v-parallax>

    <br /><br />

    <BookList :data="recent" title="최근 포스트" style="margin-top: 600px" />

    <br /><br />

    <BookList :data="popular" title="인기있는 포스트" />

    <br /><br />

    <v-container style="margin: 5px">
      <div>
        <h2>나의 통계</h2>
        <v-divider></v-divider>
        <br />
      </div>
      <v-row style="margin: 1px; gap: 15px">
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
              <span class="text-h4" v-else>{{ userInfo.libris }}</span>
            </v-card-title>
          </v-card-text>
          <v-card-actions>
            <v-btn text color="teal accent-4" @click="reveal = true">
              Libris란??
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card
              v-if="reveal"
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
                <v-btn text color="teal accent-4" @click="reveal = false">
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
            <v-btn text color="teal accent-4" @click="reveal1 = true">
              구독하자!
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <v-card
              v-if="reveal1"
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
                <v-btn text color="teal accent-4" @click="reveal1 = false">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-expand-transition>
        </v-card>

        <v-card max-width="344">
          <v-card-text>
            <div>글</div>
            <p class="text-h4 text--primary">Little 작가 글 수</p>
            <v-card-title class="white--text mt-8">
              <v-avatar size="45"><v-icon>mdi-text-box</v-icon> </v-avatar>
              <v-spacer></v-spacer>
              <v-progress-circular
                v-if="loading"
                indeterminate
              ></v-progress-circular>
              <span class="text-h4" v-else>{{
                recent.filter((item) => item.uid == this.userInfo.loginInfo)
                  .length
              }}</span>
            </v-card-title>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              color="teal accent-4"
              :to="'/list?username=' + userInfo.name"
            >
              나의 글 보기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-row>
    </v-container>

    <br /><br />

    <v-container>
      <div style="margin: 5px">
        <h2>명예의 전당</h2>
        <v-divider></v-divider>
      </div>
      <v-card style="margin: 5px">
        <v-card-text>
          <div>리브리스 높은 사람</div>
          <v-timeline :dense="$vuetify.breakpoint.xs">
            <v-timeline-item
              v-for="(item, index) in librisTop.slice(0, 5)"
              :key="item.name + index"
              :icon="
                index == 0
                  ? 'mdi-chess-king'
                  : index == 1
                  ? 'mdi-chess-queen'
                  : index == 2
                  ? 'mdi-chess-rook'
                  : index == 3
                  ? 'mdi-chess-bishop'
                  : 'mdi-chess-knight'
              "
            >
              <v-card class="mx-auto" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline mb-4">{{ index + 1 }}등</div>
                    <v-list-item-title
                      class="mb-1"
                      :style="
                        'font-size: ' + $vuetify.breakpoint.name / 20 + 'px'
                      "
                    >
                      {{ item.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle
                      >{{ !$vuetify.breakpoint.mobile ? '리브리스: ' : ''
                      }}{{ item.libris }}</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    :size="$vuetify.breakpoint.xs ? 30 : 80"
                    color="grey"
                  >
                    <v-img :src="librisTop[index].image"></v-img
                  ></v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>

        <v-card-actions>
          <v-btn to="/libris" text color="teal accent-4"> 모두 보기 </v-btn>
        </v-card-actions>
      </v-card>
    </v-container>

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'

export default {
  name: 'IndexPage',
  data() {
    return {
      librisTop: [],
      recent: [],
      popular: [],

      userInfo: {
        loginInfo: false,
        name: '',
        image: '',
        subscriber: 0,
      },

      loading: true,
      overlay: false,
      active: false,
      model: null,

      reveal: false,
      reveal1: false,

      page: 1,
    }
  },
  methods: {
    likeThis(item) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const likesRoot = `/contents/${item.time}`,
            librisRoot = `/users/${user.uid}/libris`

          db.ref(`${likesRoot}/likes`).set(item.likes + 1)
          db.ref(`${likesRoot}/liked/${user.uid}`).set(true)

          db.ref(librisRoot)
            .once('value')
            .then((s) => db.ref(librisRoot).set(s.val() + 1))

          await db.ref(`users/${this.$route.query.uid}/notification`).push({
            title: `${user.displayName}님이 글을 좋아합니다`,
            time: timestamp,
            link: `/content/${item.uid}-${item.time}`,
          })

          item.likes++
          item.liked[user.uid] = true
        }
      })
    },
    loadPost(item) {
      const { uid, time } = item

      this.$router.push(`/content/${uid}-${time}`)
    },
    async postlist() {
      const content = db.ref('/contents/')

      await content.on('child_added', async (snapshot) => {
        const data = await snapshot.val()

        this.recent.unshift(data)
        this.popular.unshift(data)
      })

      await this.recent.sort((a, b) => b.time - a.time)
      await this.popular.sort((a, b) => b.likes - a.likes)
    },
    userlist() {
      db.ref('/users')
        .orderByChild('/libris')
        .on('child_added', async (snapshot) => {
          this.librisTop.unshift({
            name: snapshot.val().username,
            libris: snapshot.val().libris ?? 0,
            image: snapshot.val().photoURL,
          })
        })
    },
    awaitLibris(uid) {
      db.ref(`/users/${uid}/libris`)
        .once('value')
        .then((s) => (this.userInfo.libris = s.val()))
    },
  },
  async mounted() {
    this.loading = true

    this.userlist()

    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.awaitLibris(user.uid)

        this.userInfo = {
          loginInfo: user.uid,
          name: user.displayName,
          image: user.photoURL,
          subscriber: 0,
        }

        this.userInfo.subscriber = await db
          .ref(`/users/${this.userInfo.loginInfo}/subscriber`)
          .once('value')
          .then((s) => {
            return s.numChildren()
          })
      }
    })

    this.postlist()

    setTimeout(() => (this.loading = false), 500)
  },
}
</script>

<style>
h1 {
  font-size: 60px;
}

@media screen and (max-width: 451px) {
  h1 {
    font-size: 40px;
  }
}
@media screen and (max-width: 313px) {
  h1 {
    font-size: 30px;
  }
}
@media screen and (max-width: 285px) {
  p,
  div {
    font-size: 10px;
  }
}
@media screen and (max-width: 247px) {
  h1 {
    font-size: 20px;
  }
}
</style>

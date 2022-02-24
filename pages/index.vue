<template>
  <div>
    <br />
    <br />

    <v-row flex justify="center" class="img-div" style="margin: 5px">
      <div style="margin: auto">
        <h1>
          Little <br />
          <span class="titleforcodinginsight">작가</span>
        </h1>
        <h2 style="color: grey">글을 올리고, 새롭게 배우고, 대화하기</h2>
        <br />
        <span v-if="userInfo.loginInfo">
          <v-btn to="/post" color="rgb(2, 79, 70)"
            >지금 글 올리기 <v-icon right>mdi-arrow-right-thin</v-icon></v-btn
          >
        </span>
        <span v-else>
          <v-btn to="/login" color="rgb(2, 79, 70)"
            >로그인 하기 <v-icon right>mdi-account</v-icon></v-btn
          >
        </span>
        <v-btn to="/list"
          >모든 글 보기<v-icon right>mdi-book-alphabet</v-icon></v-btn
        >
      </div>
    </v-row>

    <br /><br />

    <v-container v-if="userInfo.loginInfo">
      <div style="margin: 5px">
        <h2>나의 포스트</h2>
        <v-divider></v-divider>
      </div>
      <br />
      <v-row>
        <v-skeleton-loader
          v-for="index in 4"
          :key="index"
          class="mx-auto"
          type="card"
          width="250"
          v-if="loading"
        ></v-skeleton-loader>

        <v-hover
          v-for="item in recent.filter(
            (item) => item.uid === userInfo.loginInfo
          )"
          :key="item.time"
          style="margin: 1px"
        >
          <template v-slot:default="{ hover }">
            <v-card
              class="mx-auto"
              :max-width="$vuetify.breakpoint.xs ? 100 : 250"
            >
              <v-img
                :src="
                  !item.image
                    ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_nCgVLdv9lOcIYPIpeUSSk-TscwLcjc2qlw&usqp=CAU'
                    : item.image
                "
              ></v-img>

              <v-card-text>
                <h2 class="text-h6 primary--text">
                  {{
                    item.title.includes(': ')
                      ? item.title.substring(item.title.indexOf(': ') + 2)
                      : item.title
                  }}
                </h2>
                <div>
                  <div>{{ item.content.slice(0, 100) }}...</div>
                </div>
              </v-card-text>

              <v-card-title>
                <v-rating
                  :value="item.rating"
                  dense
                  color="orange"
                  background-color="orange"
                  hover
                  readonly
                  size="20"
                  class="mr-1"
                ></v-rating>
                <span class="primary--text text-subtitle-1">{{
                  item.username.substring(0, item.username.indexOf(' '))
                }}</span>
              </v-card-title>

              <v-fade-transition>
                <v-overlay v-if="hover" absolute color="#036358">
                  <v-btn @click="loadPost(item)"
                    ><v-icon left>mdi-open-in-new</v-icon>열기</v-btn
                  >
                </v-overlay>
              </v-fade-transition>
            </v-card>
          </template>
        </v-hover>
      </v-row>
    </v-container>

    <br /><br />

    <v-container>
      <div>
        <h2>최근 포스트</h2>
        <v-divider></v-divider>
      </div>
      <br />
      <v-row style="gap: 5px">
        <v-skeleton-loader
          v-for="index in 4"
          :key="index"
          class="mx-auto"
          type="card"
          width="225"
          v-if="loading"
        ></v-skeleton-loader>

        <v-card
          v-for="item in recent.slice(-5, -1)"
          :key="item.uid + item.time"
          :width="$vuetify.breakpoint.xs ? 155 : 225"
          class="mx-auto"
        >
          <v-img
            :src="
              item.image === ''
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                : item.image
            "
            height="325"
            style="margin: auto"
          ></v-img>

          <v-card-title
            class="primary--text col-11 text-truncate"
            style="font-size: 1rem"
          >
            {{
              item.title.includes(': ')
                ? item.title.substring(item.title.indexOf(': ') + 2)
                : item.title
            }}</v-card-title
          >

          <v-card-text>
            <v-divider></v-divider>
            <br />
            <p>[{{ item.username.split(' ')[0] }}]</p>
            <p>
              {{ new Date(parseInt(item.time)).toLocaleDateString() }}
            </p>
            <br />
            <v-rating
              :value="item.rating"
              dense
              color="orange"
              background-color="orange"
              hover
              readonly
              :size="$vuetify.breakpoint.xs ? 15 : 20"
              class="mr-1"
            ></v-rating>
            <div style="margin-right: 10px">
              <v-icon>mdi-eye</v-icon> {{ item.views }}
            </div>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-btn @click="loadPost(item)" color="primary" elevation="0" icon
              ><v-icon>mdi-open-in-new</v-icon>
            </v-btn>
            <v-btn
              rounded
              text
              @click="likeThis(item)"
              :disabled="item.liked[userInfo.loginInfo]"
            >
              <v-icon>mdi-thumb-up</v-icon> {{ item.likes }}
            </v-btn></v-card-actions
          >
        </v-card>
      </v-row>
      <br /><br />
    </v-container>

    <v-container>
      <div style="margin: 5px">
        <h2>나의 포인트</h2>
        <v-divider></v-divider>
      </div>
      <v-card max-width="344" style="margin: 5px">
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
      </v-card></v-container
    >

    <br /><br />

    <v-container>
      <div style="margin: 5px">
        <h2>명예의 전당</h2>
        <v-divider></v-divider>
      </div>
      <v-card style="margin: 5px">
        <v-card-text>
          <div>리브리스 높은 사람</div>
          <v-timeline>
            <v-timeline-item
              v-for="(item, index) in librisTop"
              :key="item.name + index"
              :icon="
                index == 0
                  ? 'mdi-chess-king'
                  : index == 1
                  ? 'mdi-chess-queen'
                  : index == 2
                  ? 'mdi-chess-rook'
                  : 'mdi-chess-bishop'
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
                    size="80"
                    color="grey"
                    v-if="!$vuetify.breakpoint.mobile"
                  >
                    <v-img :src="librisTop[index].image"></v-img
                  ></v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>
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

      userInfo: {
        libris: 0,
        loginInfo: false,
      },
      loading: true,
      overlay: false,
      reveal: false,
      active: false,
    }
  },
  mounted() {
    this.loading = true

    this.getUserInfo()
    this.postlist()
    this.userlist()

    setTimeout(() => (this.loading = false), 500)
  },
  methods: {
    likeThis(item) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          db.ref(`/contents/${item.uid}/posts/${item.time}/likes`).set(
            item.likes + 1
          )

          db.ref(
            `contents/${item.uid}/posts/${item.time}/liked/${user.uid}`
          ).set(true)

          db.ref(`/users/${user.uid}`).update({
            libris: this.libris + 0.5,
          })

          await db.ref(`users/${this.$route.query.uid}/notification`).push({
            title: `${user.displayName}님이 글을 좋아합니다`,
            time: timestamp,
            link: `/loadpost?uid=${item.uid}&time=${item.time}&views=${item.views}&pageCount=${item.pageCount}`,
          })

          item.likes++
          item.liked[user.uid] = true
        }
      })
    },
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userInfo.loginInfo = user.uid
          await db
            .ref('/users/' + user.uid)
            .once('value')
            .then((snapshot) => {
              this.userInfo.libris = snapshot.val().libris
            })
        }
      })
    },
    loadPost(item) {
      const { uid, time, views, pageCount } = item

      this.$router.push({
        path: '/loadpost',
        query: {
          uid,
          time,
          views,
          pageCount,
        },
      })
    },
    postlist() {
      db.ref('/contents/')
        .orderByChild('times')
        .on('child_added', async (snapshot) => {
          Object.values(snapshot.val().posts).forEach((value) =>
            this.recent.push(value)
          )
        })
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
  },
}
</script>

<style>
.v-card--reveal {
  bottom: 0;
  opacity: 1 !important;
  position: absolute;
  width: 100%;
}

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

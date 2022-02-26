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
        </div>
      </v-row>
    </v-parallax>

    <br /><br />

    <v-container style="margin-top: 600px">
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
          v-for="item in recent.slice(1 + page, 5 + page)"
          :key="item.uid + item.time"
          :width="
            $vuetify.breakpoint.width < 330
              ? '90%'
              : $vuetify.breakpoint.width < 400
              ? 150
              : $vuetify.breakpoint.xs
              ? 185
              : $vuetify.breakpoint.sm
              ? 215
              : $vuetify.breakpoint.md
              ? 215
              : 225
          "
          class="mx-auto"
        >
          <v-img
            :src="
              item.image === ''
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                : item.image
            "
            :height="
              $vuetify.breakpoint.width < 330
                ? 300
                : $vuetify.breakpoint.width < 400
                ? 220
                : $vuetify.breakpoint.xs
                ? 265
                : $vuetify.breakpoint.sm
                ? 300
                : $vuetify.breakpoint.md
                ? 330
                : 345
            "
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
            <p>({{ new Date(item.time).toLocaleDateString() }})</p>
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
      <br />
      <div class="text-center">
        <v-pagination v-model="page" :length="10"></v-pagination>
      </div>
    </v-container>

    <br /><br />

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

      userInfo: {
        loginInfo: false,
        name: '',
        image: '',
      },
      loading: true,
      overlay: false,
      reveal: false,
      active: false,
      model: null,

      page: 1,
    }
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

          db.ref(`/users/${user.uid}/libris`)
            .once('value')
            .then((snapshot) => {
              db.ref(`/users/${user.uid}/libris`).set(snapshot.val() + 1)
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
          this.userInfo.name = user.displayName
          this.userInfo.image = user.photoURL
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
          views: views + 1,
          pageCount,
        },
      })
    },
    postlist() {
      db.ref('/contents/').on('child_added', async (snapshot) => {
        const data = await snapshot.val().posts

        for (let i = 0; i < Object.keys(data).length; i++) {
          this.recent.unshift(data[Object.keys(data)[i]])
        }
      })

      this.recent.sort((a, b) => {
        return a.time - b.time
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
    awaitLibris() {
      auth.onAuthStateChanged(async (user) => {
        await db
          .ref(`/users/${user.uid}/libris`)
          .once('value')
          .then((snapshot) => {
            this.userInfo.libris = snapshot.val()
          })
      })
    },
  },
  mounted() {
    this.loading = true

    this.getUserInfo()
    this.userlist()
    this.postlist()
    this.awaitLibris()

    setTimeout(() => (this.loading = false), 500)
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

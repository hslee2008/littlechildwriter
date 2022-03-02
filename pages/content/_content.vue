<template>
  <div>
    <LazyShareButtonFab :title="post.title" :username="post.username" />

    <v-card class="my-3">
      <v-progress-linear v-if="loading" indeterminate color="primary" />

      <v-btn
        tile
        small
        to="/list"
        elevation="0"
        :block="$vuetify.breakpoint.mobile"
        :color="!$vuetify.breakpoint.mobile ? 'rgb(0, 0, 0, 0)' : 'normal'"
      >
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기</v-btn
      >

      <div class="cardy">
        <div class="text-center">
          <div>
            <v-btn-toggle class="my-5">
              <v-btn :href="post.previewLink">
                <v-icon left>mdi-book</v-icon> 구글 정보
              </v-btn>
              <v-btn
                :href="`https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${post.isbn.replaceAll(
                  '-',
                  ''
                )}&x=2&y=12`"
              >
                <v-icon left>mdi-oil-lamp</v-icon> 알라딘
              </v-btn>
            </v-btn-toggle>

            <br />

            <ReadOnlyRating
              v-if="$vuetify.breakpoint.xs"
              :value="post.rating"
            />

            <img
              :src="post.image === undefined ? '' : post.image"
              width="200"
              class="my-4 rounded-lg"
            />
          </div>
        </div>

        <div style="margin: auto; padding: 10px">
          <v-card-title> {{ post.title }} </v-card-title>

          <v-card-subtitle>
            by
            <NuxtLink :to="`/target/${post.uid}`">
              {{ post.username }}
            </NuxtLink></v-card-subtitle
          >

          <v-card-text>
            <ReadOnlyRating
              v-if="!$vuetify.breakpoint.xs"
              :value="post.rating"
            />

            <p class="my-5">{{ post.content }}</p>

            <v-chip-group class="my-5" column>
              <v-chip v-for="tag in tags" :key="tag.icon" label>
                <v-icon style="margin-right: 5px">mdi-{{ tag.icon }}</v-icon>
                {{ tag.val }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <div class="text-center my-10" v-if="userInfo.isuser">
      <Dialog
        :functionOk="del"
        buttonTitle="삭제"
        title="진짜로 삭제하겠습니까?"
        text="삭제하면 복구할 수 없습니다"
        icon="delete"
      />
      <v-btn @click="edit" class="ml-3" color="blue lighten-2"
        ><v-icon left>mdi-pencil</v-icon>편집</v-btn
      >
    </div>

    <v-text-field
      v-model="comment"
      hide-details
      flat
      label="댓글 달기"
      solo
      @keydown.enter="commentpost"
    >
      <template v-slot:append>
        <v-btn class="mx-0" icon depressed @click="commentpost">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-timeline dense clipped>
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="(message, index) in comments"
          :key="message.time"
          class="mb-4"
          small
          :color="userInfo.username.includes(message.username) ? 'blue' : 'red'"
          :icon="message.badWord ? 'mdi-alert' : ''"
        >
          <template v-slot:icon>
            <v-avatar size="30">
              <img :src="message.photo" />
            </v-avatar>
          </template>
          <v-alert dense outlined dense type="warning" v-if="message.badWord">
            <v-row>
              <v-col
                ><h3>{{ message.content }} (필터됨)</h3></v-col
              >
              <v-col class="text-right">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      v-if="userInfo.username.includes(message.username)"
                      cols="1"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title @click="delcomment(message, index)"
                        ><v-icon color="error"
                          >mdi-delete</v-icon
                        ></v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-alert>

          <v-row justify="space-between" v-else>
            <v-col cols="4"
              ><strong>{{ message.username }}</strong>
              <p>{{ message.content }}</p>
            </v-col>
            <v-col class="text-right my-1" cols="7">{{
              new Date(message.time).toLocaleDateString() +
              ' ' +
              new Date(message.time).toLocaleTimeString()
            }}</v-col>
            <v-col class="text-right">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="userInfo.username.includes(message.username)"
                    cols="1"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title @click="delcomment(message, index)"
                      ><v-icon color="error"
                        >mdi-delete</v-icon
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-col>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>

    <br /><br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js'
import * as filter from 'leo-profanity'

export default {
  data() {
    return {
      comment: '',
      comments: [],

      userInfo: {
        uid: '',
        username: '',
        isuser: false,
        photo: '',
      },

      post: {
        title: '',
        content: '',
        image: '',
        time: '',
        username: '',
        views: 0,
        rating: 0,
        pageCount: 0,
        isbn: '',
      },
      tags: {},
      loading: true,
      dialog: false,
    }
  },
  methods: {
    async delcomment(message, index) {
      const comments = db.ref(`contents/${this.time}/comments`)

      comments.once('value', (s) =>
        s.forEach((c) => {
          if (
            c.val().uid === this.userInfo.uid &&
            c.val().time === message.time
          )
            comments.child(c.key).remove()
        })
      )

      this.comments[index].content = '삭제된 댓글입니다.'
      this.comments[index].username = '삭제된 댓글입니다.'

      await setTimeout(() => this.getComments(), 1500)
    },
    async librisUpdate(useruid) {
      await auth.onAuthStateChanged(async (user) => {
        if (user)
          db.ref(`users/${user.uid}/libris`)
            .once('value')
            .then((s) =>
              db.ref(`users/${user.uid}/libris`).set(parseInt(s.val()) + 0.5)
            )
      })
    },
    async commentpost() {
      if (this.comment.length > 0) {
        const timestamp = Date.now()

        const comments = await db.ref(`contents/${this.time}/comments`)

        filter.loadDictionary('en-us')
        filter.loadDictionary('ko-kr')

        comments.push({
          username: this.userInfo.username,
          content: filter.clean(this.comment),
          time: timestamp,
          uid: this.$fire.auth.currentUser.uid,
          badWord: filter.check(this.comment),
          photo: this.userInfo.photo,
        })

        this.notify()
        this.librisUpdate(this.uid)

        this.comment = ''

        this.getComments()
      }
    },
    async notify() {
      await db.ref(`users/${this.uid}/notification`).push({
        title: `${this.userInfo.username}님이 댓글를 작성했습니다.`,
        time: Date.now(),
        link: `/content/${this.uid}-${this.time}`,
      })
    },
    async del() {
      this.dialog = false

      await db.ref(`contents/${this.time}`).remove()

      this.$router.push('/list')
    },
    async edit() {
      this.$router.push(`/mock/${this.uid}-${this.time}`)
    },
    async getQueryChips() {
      const [thumbs, isbn, views, pageCount] = await db
        .ref(`/contents/${this.time}/`)
        .once('value')
        .then((res) => res.val())
        .then((s) => [s.likes, s.isbn, Math.round(s.views), s.pageCount])

      this.tags = {
        views: {
          icon: 'eye',
          val: views,
        },
        time: {
          icon: 'calendar-clock',
          val: new Date(parseInt(this.time)).toLocaleDateString(),
        },
        page: {
          icon: 'book-open-page-variant',
          val: pageCount,
        },
        liked: {
          icon: 'thumb-up',
          val: thumbs,
        },
        isbn: {
          icon: 'bookmark',
          val: isbn,
        },
      }
    },
    async getComments() {
      this.comments = Object.values(
        await db
          .ref(`contents/${this.time}/comments`)
          .once('value')
          .then((s) => s.val() ?? [])
      )
    },
    async getUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user)
          this.userInfo = {
            uid: user.uid,
            username: user.displayName,
            isuser: this.uid === user.uid,
            photo: user.photoURL,
          }
      })
    },
    async getPost() {
      this.post = await db
        .ref(`contents/${this.time}`)
        .once('value')
        .then((s) => s.val())
        .catch((err) => {
          alert('글이 존재하지 않습니다')
          this.$router.push('/list')
        })
    },
    async growView() {
      const viewLink = `contents/${this.time}/views`

      db.ref(viewLink)
        .once('value')
        .then((s) => {
          this.post.views = s.val()

          db.ref(viewLink).set(s.val() + 1)
        })

      this.librisUpdate(this.uid)
      this.librisUpdate(this.userInfo.uid)
    },
  },
  async mounted() {
    this.getUser()

    this.getPost()

    this.growView()
    this.getQueryChips()
    this.getComments()

    setTimeout(() => (this.loading = false), 500)
  },
  asyncData({ params }) {
    const [uid, time] = params.content.split('-')

    return {
      uid,
      time,
    }
  },
}
</script>

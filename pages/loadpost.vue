<template>
  <div>
    <shareButtonFab :title="post.title" :username="post.username" />

    <v-card class="mx-auto my-3">
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
        <div class="mx-auto text-center">
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

            <v-rating
              :value="post.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="20"
              class="my-4"
              v-if="$vuetify.breakpoint.xs"
            />

            <img
              :src="post.image === undefined ? '' : post.image"
              width="200"
              class="mx-auto my-4 rounded-lg"
            />
          </div>
        </div>

        <div style="margin: auto; padding: 10px">
          <v-card-title> {{ post.title }} </v-card-title>

          <v-card-subtitle>
            by
            <NuxtLink :to="`/loadaccount?uid=${post.uid}`">
              {{ post.username }}
            </NuxtLink></v-card-subtitle
          >

          <v-card-text>
            <v-rating
              :value="post.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="20"
              class="my-4"
              v-if="!$vuetify.breakpoint.xs"
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
      <v-dialog v-model="dialog" width="500">
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            @click="dialog = true"
            color="red lighten-2"
            v-bind="attrs"
            v-on="on"
            ><v-icon left>mdi-delete</v-icon>삭제</v-btn
          >
        </template>

        <v-card>
          <v-card-title> 진짜로 삭제하시겠습니까? </v-card-title>

          <v-card-text> 삭제하면 복구할 수 없습니다. </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="del"> 👌 OK </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-btn @click="edit" class="ml-3" color="blue lighten-2"
        ><v-icon left>mdi-pencil</v-icon>편집</v-btn
      >
    </div>

    <v-text-field
      label="댓글"
      v-model="comment"
      append-icon="mdi-send"
      @click:append="commentpost"
      @keyup.enter="commentpost"
      single-line
      hide-details
      outlined
      dense
      class="mx-auto my-6"
    ></v-text-field>

    <v-timeline align-top dense>
      <v-timeline-item
        v-for="(message, index) in comments"
        :key="message.time"
        small
        :color="userInfo.username.includes(message.username) ? 'blue' : 'red'"
        :icon="message.badWord ? 'mdi-alert' : ''"
      >
        <div class="d-flex">
          <div class="font-weight-normal">
            <strong>{{ message.username }}</strong> ({{
              new Date(message.time).toLocaleDateString() +
              ' ' +
              new Date(message.time).toLocaleTimeString()
            }})

            <v-menu offset-y>
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  v-on="on"
                  v-if="userInfo.username.includes(message.username)"
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
          </div>
        </div>
        <v-alert dense outlined dense type="warning" v-if="message.badWord">
          필터됨.
        </v-alert>

        <div>{{ message.content }}</div>
      </v-timeline-item>
    </v-timeline>

    <br /><br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'
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
      const { uid, time } = this.$route.query
      const comments = db.ref(`contents/${uid}/posts/${time}/comments`)

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
        const { uid, time } = this.$route.query

        const comments = await db.ref(`contents/${uid}/posts/${time}/comments`)

        filter.loadDictionary('en-us')
        filter.loadDictionary('ko-kr')

        comments.push({
          username: this.userInfo.username,
          content: filter.clean(this.comment),
          time: timestamp,
          uid: this.$fire.auth.currentUser.uid,
          badWord: filter.check(this.comment),
        })

        this.notify()
        this.librisUpdate(this.$route.query.uid)

        this.comment = ''

        this.getComments()
      }
    },
    async notify() {
      await db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.userInfo.username}님이 댓글를 작성했습니다습니다`,
        time: Date.now(),
        link: `/loadpost?uid=${this.$route.query.uid}&time=${this.$route.query.time}&views=${this.post.views}&pageCount=${this.post.pageCount}`,
      })
    },
    async del() {
      const { uid, time } = this.$route.query
      this.dialog = false

      await db.ref(`contents/${uid}/posts/${time}`).remove()
      await db
        .ref(`users/${this.userInfo.uid}/libris`)
        .transaction((cv) => cv - 1)

      this.$router.push('/list')
    },
    async edit() {
      const { uid, time } = this.$route.query

      this.$router.push({
        path: '/editpost',
        query: { uid, time },
      })
    },
    async getQueryChips() {
      const { uid, time, views, pageCount } = this.$route.query
      const thumbs = await db
          .ref(`/contents/${uid}/posts/${time}/likes`)
          .once('value')
          .then((s) => s.val()),
        isbn = await db
          .ref(`/contents/${uid}/posts/${time}/isbn`)
          .once('value')
          .then((s) => s.val())

      this.tags = {
        views: {
          icon: 'eye',
          val: views,
        },
        time: {
          icon: 'calendar-clock',
          val: new Date(parseInt(time)).toLocaleDateString(),
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
      const { uid, time } = this.$route.query

      this.comments = Object.values(
        await db
          .ref(`contents/${uid}/posts/${time}/comments`)
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
            isuser: this.$route.query.uid === user.uid,
          }
      })
    },
    async getPost() {
      const { uid, time } = this.$route.query

      this.post = await db
        .ref(`contents/${uid}/posts/${time}`)
        .once('value')
        .then((s) => s.val())
        .catch((err) => {
          alert('글이 존재하지 않습니다')
          this.$router.push('/list')
        })
    },
    async growView() {
      const viewLink = `contents/${this.$route.query.uid}/posts/${this.$route.query.time}/views`
      db.ref(viewLink)
        .once('value')
        .then((s) => {
          this.post.views = s.val()

          db.ref(viewLink).set(s.val() + 1)
        })

      this.librisUpdate(this.$route.query.uid)
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
}
</script>

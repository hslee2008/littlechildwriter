<template>
  <div>
    <v-fab-transition v-if="$vuetify.breakpoint.mobile">
      <v-btn
        fab
        small
        bottom
        right
        fixed
        ripple
        style="margin-bottom: 35px"
        elevation="20"
        color="primary"
        @click="sharePost"
      >
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-card class="mx-auto my-6">
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>

      <v-btn
        tile
        block
        elevation="0"
        to="/list"
        v-if="$vuetify.breakpoint.mobile"
      >
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기</v-btn
      >
      <v-btn tile small elevation="0" to="/list" v-else>
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기</v-btn
      >

      <div class="cardy">
        <div style="margin: auto; text-align: center">
          <v-btn-toggle>
            <v-btn :href="post.previewLink" class="my-5" elevation="0">
              <v-icon left>mdi-book</v-icon> 구글 정보
            </v-btn>
            <v-btn
              :href="`https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${post.isbn.replaceAll(
                '-',
                ''
              )}&x=2&y=12`"
              class="my-5"
              elevation="0"
            >
              <v-icon left>mdi-oil-lamp</v-icon> 알라딘
            </v-btn> </v-btn-toggle
          ><br />

          <v-rating
            :value="post.rating"
            color="amber"
            dense
            half-increments
            readonly
            size="20"
            class="my-4"
            v-if="$vuetify.breakpoint.xs"
          ></v-rating>

          <img
            :src="
              post.image === undefined
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                : post.image
            "
            width="200"
            style="margin: 10px; border-radius: 10px"
          />
          <h2>{{ post.title }}</h2>
          <div class="text-subtitle-1" v-if="$vuetify.breakpoint.xs">
            by
            <NuxtLink :to="`/loadaccount?uid=${post.uid}`">
              {{ post.username }}
            </NuxtLink>
          </div>
        </div>

        <div style="margin: auto">
          <v-card-text>
            <div class="text-subtitle-1" v-if="!$vuetify.breakpoint.xs">
              by
              <NuxtLink :to="`/loadaccount?uid=${post.uid}`">
                {{ post.username }}
              </NuxtLink>
            </div>

            <v-rating
              :value="post.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="20"
              class="my-4"
              v-if="!$vuetify.breakpoint.xs"
            ></v-rating>

            <p class="my-5">{{ post.content }}</p>

            <v-chip-group active-class="primary--text" class="my-6" column>
              <v-chip v-for="tag in tags" :key="tag.icon" label>
                <v-icon style="margin-right: 5px">mdi-{{ tag.icon }}</v-icon>
                {{ tag.val }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-divider class="ml-3 mr-5" v-if="this.isuser"></v-divider>

          <div class="my-5" v-if="this.isuser">
            <v-card-actions>
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

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="del"> 👌 OK </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
              <v-btn @click="edit" class="ml-3" color="blue lighten-2"
                ><v-icon left>mdi-pencil</v-icon>편집</v-btn
              >
            </v-card-actions>
          </div>
        </div>
      </div>
    </v-card>

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
        :color="username.includes(message.username) ? 'blue' : 'red'"
        :icon="message.badWord ? 'mdi-alert' : ''"
      >
        <div>
          <div style="display: flex">
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
                    v-if="username.includes(message.username)"
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
            <v-alert dense outlined type="error" v-if="message.badWord">
              나쁜 말이 있습니다. 필터 되었습니다.
            </v-alert>
          </div>

          <div>{{ message.content }}</div>
        </div>
      </v-timeline-item>
    </v-timeline>

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'
import * as filter from 'leo-profanity'

export default {
  data() {
    return {
      comment: '',
      commentUpdate: false,

      username: '',
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
      tags: {
        views: {
          icon: 'eye',
          val: '',
        },
        time: {
          icon: 'calendar-clock',
          val: '',
        },
        page: {
          icon: 'book-open-page-variant',
          val: '',
        },
        liked: {
          icon: 'thumb-up',
          val: '',
        },
        isbn: {
          icon: 'bookmark',
          val: '',
        },
      },
      comments: [],
      isuser: false,
      loading: true,
      dialog: false,
      useruid: '',
    }
  },
  methods: {
    async delcomment(message, index) {
      const comments = db.ref(
        `comments/${this.$route.query.uid + this.$route.query.time}/comments/`
      )

      comments.once('value', (s) => {
        s.forEach((child) => {
          if (
            child.val().uid === this.useruid &&
            child.val().time === message.time
          ) {
            comments.child(child.key).remove()
          }
        })
      })

      this.comments[index].content = '삭제된 댓글입니다.'
      this.comments[index].username = '삭제된 댓글입니다.'

      await setTimeout(() => this.getComments(), 1500)
    },
    async librisUpdate(useruid) {
      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          db.ref(`users/${user.uid}/libris`)
            .once('value')
            .then((s) => {
              db.ref('/users/' + user.uid + '/libris').set(
                parseInt(s.val()) + 0.5
              )
            })
        }
      })
    },
    async commentpost() {
      if (this.comment.length > 0) {
        const timestamp = Date.now()

        const comments = await db.ref(
          `comments/${this.$route.query.uid + this.$route.query.time}/comments`
        )

        filter.loadDictionary('en-us')
        filter.loadDictionary('ko-kr')

        comments.push({
          username: this.username,
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
      const timestamp = Date.now()

      await db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.username}님이 댓글를 작성했습니다습니다`,
        time: timestamp,
        link: `/loadpost?uid=${this.$route.query.uid}&time=${this.$route.query.time}&views=${this.post.views}&pageCount=${this.post.pageCount}`,
      })
    },
    async del() {
      await db
        .ref(
          `contents/${this.$route.query.uid}/posts/${this.$route.query.time}`
        )
        .remove()
      await db.ref(`comments/${this.$route.path}/comments`).remove()

      this.dialog = false

      this.$router.push('/list')
    },
    async edit() {
      this.$router.push({
        path: '/editpost',
        query: {
          uid: this.$route.query.uid,
          time: this.$route.query.time,
        },
      })
    },
    sharePost() {
      if (navigator.canShare)
        navigator.share({
          title: `Little 작가 포스트 (${this.post.title} by ${this.post.username})`,
          url: window.location.href,
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
      this.comments = Object.values(
        await db
          .ref(
            `comments/${
              this.$route.query.uid + this.$route.query.time
            }/comments`
          )
          .once('value')
          .then((s) => s.val() ?? [])
      )
    },
    async getUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.username = user.displayName
          this.isuser = this.$route.query.uid === user.uid
          this.useruid = user.uid
        }
      })
    },
    async getPost() {
      this.post = await db
        .ref(
          `contents/${this.$route.query.uid}/posts/${this.$route.query.time}`
        )
        .once('value')
        .then((s) => s.val())
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
      this.librisUpdate(this.useruid)
    },
  },
  async mounted() {
    this.getUser()

    try {
      this.getPost()
    } catch (err) {
      alert('글이 존재하지 않습니다')
      this.$router.push('/list')
    }

    this.growView()
    this.getQueryChips()
    this.getComments()

    setTimeout(() => (this.loading = false), 500)
  },
}
</script>

<style scoped>
.cardy {
  display: flex;
  padding: 10px;
}

@media screen and (max-width: 605px) {
  .cardy {
    display: block;
  }
}
</style>

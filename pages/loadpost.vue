<template>
  <div>
    <v-fab-transition v-if="$vuetify.breakpoint.mobile">
      <v-btn
        fab
        small
        dark
        bottom
        right
        fixed
        ripple
        outlined
        style="margin-bottom: 35px"
        elevation="20"
        color="primary"
        @click="sharePost"
      >
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-btn to="/list"> <v-icon left>mdi-arrow-left</v-icon>뒤로가기</v-btn>

    <v-card class="mx-auto my-6">
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-linear>

      <div class="cardy">
        <div style="margin: auto">
          <img
            :src="
              post.image == undefined
                ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                : post.image
            "
            width="300"
          />
        </div>

        <div>
          <v-card-title>{{ post.title }}</v-card-title>

          <v-card-text>
            <div class="text-subtitle-1">by {{ post.username }}</div>

            <v-rating
              :value="post.rating"
              color="amber"
              dense
              half-increments
              readonly
              size="20"
              class="my-4"
            ></v-rating>

            <div>{{ post.content }}</div>

            <v-chip-group active-class="primary--text" class="my-6" column>
              <v-chip v-for="tag in tags" :key="tag.icon" label>
                <v-icon style="margin-right: 5px">mdi-{{ tag.icon }}</v-icon>
                {{ tag.val }}
              </v-chip>
            </v-chip-group>
          </v-card-text>

          <v-spacer style="margin: 5px"></v-spacer>

          <div v-if="this.isuser">
            <v-divider></v-divider>

            <v-card-actions style="margin-top: 5px">
              <v-btn @click="del" color="red lighten-2"
                ><v-icon left>mdi-delete</v-icon>삭제하기</v-btn
              >
              <v-btn @click="edit" color="blue lighten-2"
                ><v-icon left>mdi-pencil</v-icon>편집하기</v-btn
              >
            </v-card-actions>
          </div>
        </div>
      </div>
    </v-card>

    <v-text-field
      label="코멘트"
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
      <v-timeline-item v-for="message in comments" :key="message.time" small>
        <div>
          <div class="font-weight-normal">
            <strong>{{ message.username }}</strong> @{{
              new Date(message.time).toLocaleDateString()
            }}
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

export default {
  data() {
    return {
      comment: '',
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
      },
      comments: [],
      isuser: false,
      loading: true,
      selection: 1,
      libris: 0,
    }
  },
  methods: {
    async commentpost() {
      const timestamp = Date.now()

      await auth.onAuthStateChanged(async (user) => {
        this.username = user.displayName

        db.ref('/users/' + user.uid).update({
          libris: this.libris + 0.5,
        })
      })

      const comment = {
        username: this.username,
        content: this.comment,
        time: timestamp,
        uid: this.$fire.auth.currentUser.uid,
      }

      await db
        .ref(
          `comments/${this.$route.query.uid + this.$route.query.time}/comments`
        )
        .push(comment)

      await db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.username}님이 코멘트를 작성했습니다습니다`,
        time: timestamp,
        link: `/loadpost?uid=${this.$route.query.uid}&time=${this.$route.query.time}&views=${this.post.views}&pageCount=${this.post.pageCount}`,
      })

      this.comment = ''

      this.getComments()
    },
    async del() {
      await db
        .ref(
          `contents/${this.$route.query.uid}/posts/${this.$route.query.time}`
        )
        .remove()
      await db.ref(`comments/${this.$route.path}/comments`).remove()

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
          text: this.post.content.replaceAll('<p>', '').replaceAll('</p>', ''),
          url: window.location.href,
        })
    },
    getQueryChips() {
      const { time, views, pageCount } = this.$route.query

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
          .then((s) => s.val())
      )
    },
    async getUser() {
      this.isuser = this.$route.query.uid === this.$fire.auth.currentUser.uid
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
      const views = this.post.views + 1

      db.ref(
        'contents/' + this.$route.query.uid + '/posts/' + this.$route.query.time
      ).update({
        views,
      })

      this.post.views = views
    },
  },
  async mounted() {
    this.getPost()
    this.getQueryChips()
    this.getComments()
    this.getUser()
    this.growView()

    setTimeout(() => (this.loading = false), 1000)
  },
}
</script>

<style scoped>
.cardy {
  display: flex;
}

@media screen and (max-width: 605px) {
  .cardy {
    display: block;
  }
}
</style>

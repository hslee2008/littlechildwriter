<template>
  <div>
    <v-dialog v-model="editStudioDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            bottom
            right
            fixed
            :class="$vuetify.breakpoint.mobile ? 'mb-15' : 'mb-10'"
            color="primary"
            v-bind="attrs"
            v-on="on"
            style="z-index: 100"
          >
            <v-icon left>mdi-pencil</v-icon> 글 쓰기
          </v-btn>
        </v-fab-transition>
      </template>

      <v-card>
        <img
          ref="isbn"
          src="/logo.avif"
          alt="isbn-nothing-to-be-shown"
          style="display: none"
        />

        <v-card-text>
          <v-row style="margin: 1px">
            <div style="margin: auto">
              {{ new Date().toLocaleDateString() }}
            </div>
          </v-row>
          <v-row>
            <img :src="post.image" height="100" class="mx-auto" />
            <v-form class="mx-auto">
              <v-text-field
                label="제목"
                v-model="post.title"
                :hint="post.subtitle"
              />
              <v-text-field label="이름" v-model="post.author" />
            </v-form>
          </v-row>
        </v-card-text>

        <v-card-actions style="gap: 20px">
          <v-btn color="teal accent-7" @click="postcontent" elevation="0">
            올리기<v-icon right>mdi-note-plus</v-icon>
          </v-btn>

          <v-dialog v-model="dialog" width="500">
            <template v-slot:activator="{ on, attrs }">
              <div class="text-center">
                <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                  선택
                </v-btn>
              </div>
            </template>

            <v-card>
              <v-card-title> 포스트 선택하기 </v-card-title>

              <v-card-text>
                <v-card
                  v-for="item in mine.filter((item) => item.uid == this.uid)"
                  :key="item.title"
                  class="d-flex"
                >
                  <img :src="item.image" height="100" class="my-auto" />
                  <div class="my-auto">
                    <v-card-title> {{ item.title }} </v-card-title>
                    <v-card-actions
                      ><v-btn
                        @click="
                          post.thelink = `/content/${item.uid}-${item.time}`
                          post.image = item.image
                          dialog = false
                        "
                        icon
                        ><v-icon>mdi-check</v-icon></v-btn
                      ></v-card-actions
                    >
                  </div>
                </v-card>
              </v-card-text>

              <v-divider />

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="error" text @click="dialog = false"> 취소 </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card class="ml-2 mr-2">
      <v-btn
        tile
        small
        to="/studios"
        elevation="0"
        :block="$vuetify.breakpoint.mobile"
        :color="!$vuetify.breakpoint.mobile ? 'rgb(0, 0, 0, 0)' : 'normal'"
      >
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기</v-btn
      >

      <div class="cardy">
        <div class="mx-auto">
          <p>by {{ studioInfo.creator }}</p>
          <img
            :src="studioInfo.image === undefined ? '' : studioInfo.image"
            width="200"
            class="my-4 rounded-lg"
          />
          <v-card-title> {{ studioInfo.name }} </v-card-title>
          <v-card-subtitle>{{
            new Date(studioInfo.lastUpdated).toLocaleDateString()
          }}</v-card-subtitle>
        </div>

        <div style="margin: auto; padding: 10px">
          <v-card-text>
            <p class="my-5">{{ studioInfo.description }}</p>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <br />

    <v-row class="ml-3 mr-3 mt-3" style="gap: 20px" justify="center">
      <div>
        <v-card
          v-for="(posts, index) in studioInfo.contents"
          :key="posts.time"
          :style="
            $vuetify.breakpoint.width < 350 ? 'display: block' : 'display: flex'
          "
        >
          <v-img :src="posts.image" />

          <div>
            <v-card-title>{{ posts.title }}</v-card-title>
            <v-card-subtitle>by {{ posts.username }}</v-card-subtitle>
            <v-card-text>
              {{ new Date(parseInt(posts.time)).toLocaleDateString() }}
            </v-card-text>
            <v-card-actions>
              <v-btn :to="posts.thelink">
                <v-icon left>mdi-open-in-new</v-icon>
                열기
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>

      <CommentSection
        :databaseReference="`studios/${this.id}/comments`"
        :id="`/studio/${this.id}`"
      />
    </v-row>

    <br /><br /><br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js'
import * as filter from 'leo-profanity'

export default {
  data() {
    return {
      studioInfo: {},
      mine: [],

      comment: '',
      updatedcomment: '',
      comments: [],

      post: {
        title: '',
        subtitle: '',
        content: '',
        rating: 0,
        isbn: '',
        author: [],
        contents: [],
        previewLink: '',
        image: '',
        pageCount: 0,
        likes: 0,
        thelink: '',
      },
      isbn: {
        videoBarcode: false,
        pictureBarcode: false,
        inputISBN: false,
      },

      userInfo: {
        uid: '',
        username: '',
        isuser: false,
        photo: '',
      },

      editStudioDialog: false,
      loading: false,
      dialog: false,
      error: '',
      libris: 0,
      uid: '',

      subscribers: [],
      username: '',
    }
  },
  methods: {
    fetchStudio() {
      db.ref('studios')
        .child(this.id)
        .once('value')
        .then(async (s) => {
          this.studioInfo = await s.val()
        })
    },
    async postcontent() {
      const timestamp = Date.now()

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          const database = db.ref(`/studios/${this.id}/contents`)

          database.push({
            title: this.post.title,
            uid: user.uid,
            time: timestamp,
            username: user.displayName,
            thelink: this.post.thelink,
            image: this.post.image,
          })

          this.updateLibris(user.uid)
          this.editStudioDialog = false
          this.$forceUpdate()
          this.fetchStudio()
        } else {
          alert('로그인이 필요합니다.')

          this.$route.push('/login')
        }
      })
    },
    updateLibris(uid) {
      db.ref(`/users/${uid}/libris`).once('value', (s) => {
        db.ref(`/users/${uid}/libris`).set(
          parseInt(s.val()) + this.post.pageCount / 100
        )
      })
    },
    getSubscribers(uid) {
      db.ref(`/users/${uid}/subscriber`)
        .once('value')
        .then((s) => (this.subscribers = Object.keys(s.val() ?? [])))
    },
    fetchUsers() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.uid = user.uid
          this.username = user.displayName
          this.post.author = user.displayName
          this.getSubscribers(user.uid)

          db.ref('/contents/').on('child_added', async (s) => {
            this.mine.unshift({
              title: s.val().title,
              time: s.val().time,
              uid: s.val().uid,
              username: s.val().username,
              thelink: s.val().thelink,
              image: s.val().image,
            })
          })

          this.mine.sort((a, b) => a.time - b.time)
        }
      })
    },
  },
  async mounted() {
    this.fetchStudio()
    this.fetchUsers()
  },
  asyncData({ params }) {
    const id = params.studio

    return { id }
  },
}
</script>

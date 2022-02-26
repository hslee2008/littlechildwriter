<template>
  <div>
    <v-parallax
      style="position: absolute; right: 0; top: 0; width: 100%; height: 100%"
      src="https://images5.alphacoders.com/659/thumb-1920-659155.jpg"
    >
      <v-row flex justify="center" class="img-div" style="margin: 10px">
        <div class="cardy">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 20 : 2"
              :class="{ 'on-hover': hover } + ' mb-3 vcard'"
            >
              <v-card-text>
                <v-list-item>
                  <v-list-item-avatar size="80">
                    <v-img :src="userPhotoURL"></v-img>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>{{ userDisplayName }}</v-list-item-title>
                    <v-list-item-subtitle>{{
                      userLibris
                    }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
                <br />
                <div class="text--primary" v-if="bio">{{ bio }}</div>
                <div
                  class="text--primary"
                  style="color: grey !important"
                  v-else
                >
                  아직 나의 소개를 입력하지 않았습니다.
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn :to="`/list?username=${userDisplayName}`" class="my-3"
                  >{{ userDisplayName }}의 글 보기<v-icon right
                    >mdi-arrow-right-thin</v-icon
                  ></v-btn
                ></v-card-actions
              >
            </v-card>
          </v-hover>

          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 20 : 2"
              :class="{ 'on-hover': hover } + ' vcard'"
            >
              <v-card-text>
                <v-timeline align-top dense>
                  <v-timeline-item
                    v-for="(message, index) in commentList"
                    :key="message.time"
                    small
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
                                v-if="myUsername.includes(message.username)"
                              >
                                <v-icon>mdi-dots-vertical</v-icon>
                              </v-btn>
                            </template>
                            <v-list dense>
                              <v-list-item>
                                <v-list-item-title
                                  @click="delcomment(message, index)"
                                  ><v-icon color="error"
                                    >mdi-delete</v-icon
                                  ></v-list-item-title
                                >
                              </v-list-item>
                            </v-list>
                          </v-menu>
                        </div>
                        <v-alert
                          dense
                          outlined
                          type="error"
                          v-if="message.badWord"
                        >
                          나쁜 말이 있습니다. 필터 되었습니다.
                        </v-alert>
                      </div>

                      <div>{{ message.comment }}</div>
                    </div>
                  </v-timeline-item>
                </v-timeline>
              </v-card-text>

              <v-card-actions>
                <v-text-field
                  label="댓글"
                  v-model="comment"
                  append-icon="mdi-send"
                  @click:append="commentpost"
                  @keyup:enter="commentpost"
                  single-line
                  hide-details
                  outlined
                  dense
                  class="mx-auto my-6"
                >
                </v-text-field>
              </v-card-actions>
            </v-card>
          </v-hover>
        </div>
      </v-row>
    </v-parallax>
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'
import * as filter from 'leo-profanity'

export default {
  data() {
    return {
      userLibris: '',
      userDisplayName: '',
      userPhotoURL: '',
      bio: '',
      uid: '',

      comment: '',
      commentList: [],

      myUsername: '',
    }
  },
  methods: {
    getUserInfo() {
      // 유저 정보 가져오기
      db.ref(`/users/${this.$route.query.uid}/`).once('value', (s) => {
        this.userDisplayName = s.val().username
        this.userPhotoURL = s.val().photoURL
        this.userLibris = s.val().libris
        this.bio = s.val().bio
      })

      // 나의 유저 정보 가져오기
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.uid = user.uid
          this.myUsername = user.displayName
        }
      })
    },
    commentpost() {
      if (this.comment.length > 0) {
        filter.loadDictionary('en-us')
        filter.loadDictionary('ko-kr')

        db.ref(
          `/users/${this.$route.query.uid}++and++${this.uid}/comments`
        ).push({
          comment: filter.clean(this.comment),
          badword: filter.check(this.comment),
          username: this.myUsername,
          time: Date.now(),
        })

        this.comment = ''

        this.fetchComments()
        this.notify()
      }
    },
    async notify() {
      const timestamp = Date.now()

      await db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.myUsername}님이 비공개 댓글를 작성했습니다습니다`,
        time: timestamp,
        link: `/loadaccount?uid=${this.$route.query.uid}`,
      })
    },
    async fetchComments() {
      this.commentList = await db
        .ref(`/users/`)
        .once('value')
        .then(
          (s) =>
            (
              s.val()[this.$route.query.uid + '++and++' + this.uid] ?? {
                comments: '',
              }
            ).comments
        )
    },
    async delcomment(message, index) {
      await db
        .ref(
          `/users/${this.$route.query.uid}++and++${this.uid}/comments/${index}`
        )
        .remove()

      this.commentList[index].comment = '삭제된 댓글입니다.'
      this.commentList[index].username = '삭제된 댓글입니다.'

      await setTimeout(() => this.fetchComments(), 1500)
    },
  },
  async mounted() {
    this.getUserInfo()

    await setInterval(() => this.fetchComments(), 1500)
  },
}
</script>

<style scoped>
.cardy {
  display: flex;
  padding: 10px;
  margin: auto;
  gap: 10px;
}

.vcard {
  justify-content: center;
  align-items: center;
  padding: 20px;
  border-radius: 20px;
}

@media screen and (max-width: 605px) {
  .cardy {
    display: block;
  }
}
</style>

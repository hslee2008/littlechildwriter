<template>
  <div>
    <v-btn
      bottom
      right
      fixed
      ripple
      style="
        margin-bottom: 35px;
        position: absolute;
        bottom: 0;
        right: 0;
        z-index: 999;
      "
      color="primary"
      to="/account#background"
      v-if="currentUser.isuser"
    >
      <v-icon left>mdi-pencil</v-icon> 배경화면 이미지 바꾸기
    </v-btn>

    <v-parallax
      style="position: absolute; right: 0; top: 0; width: 100%; height: 100%"
      :src="
        userInfo.userBackground
          ? userInfo.userBackground
          : 'https://images5.alphacoders.com/659/thumb-1920-659155.jpg/'
      "
    >
      <v-row flex>
        <div class="cardy">
          <v-hover v-slot="{ hover }">
            <v-card
              :elevation="hover ? 20 : 2"
              :class="{ 'on-hover': hover } + ' vcard'"
              :style="
                $vuetify.breakpoint.mobile ? 'display: block' : 'display: flex'
              "
            >
              <div>
                <v-card-text>
                  <v-list-item>
                    <v-list-item-avatar size="80">
                      <v-img :src="userInfo.userPhotoURL"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title>{{
                        userInfo.userDisplayName
                      }}</v-list-item-title>

                      <v-row justify="space-around" align="center" class="mt-3">
                        <v-chip class="ma-2" color="red" text-color="white">
                          <v-icon left> mdi-youtube-subscription </v-icon>
                          {{ subscriberNumber }}
                          {{ $vuetify.breakpoint.mobile ? '' : '구독자' }}
                        </v-chip>
                        <v-chip class="ma-2" color="blue" text-color="white">
                          <v-icon left> mdi-library </v-icon>
                          {{ userInfo.userLibris }}
                          {{ $vuetify.breakpoint.mobile ? '' : '리브리스' }}
                        </v-chip>
                      </v-row>
                    </v-list-item-content>
                  </v-list-item>
                  <br />
                  <div class="text--primary" v-if="userInfo.bio">
                    {{ userInfo.bio }}
                  </div>
                  <div
                    class="text--primary"
                    style="color: grey !important"
                    v-else
                  >
                    아직 나의 소개를 입력하지 않았습니다.
                  </div>
                </v-card-text>

                <v-card-actions>
                  <v-btn
                    :to="`/list?username=${userInfo.userDisplayName}`"
                    class="my-3"
                    >{{ userInfo.userDisplayName }}의 글 보기<v-icon right
                      >mdi-arrow-right-thin</v-icon
                    >
                  </v-btn>
                  <v-btn
                    class="my-3"
                    color="primary"
                    @click="subscribe"
                    v-if="currentUser.uid !== $route.query.uid"
                  >
                    {{ subscribed ? '구독 취소' : '구독하기'
                    }}<v-icon right>mdi-shield-account</v-icon>
                  </v-btn>
                  <v-btn
                    class="my-3"
                    color="primary"
                    to="/account"
                    v-if="currentUser.isuser"
                  >
                    편집<v-icon right>mdi-shield-account</v-icon>
                  </v-btn>
                </v-card-actions>
              </div>

              <v-divider vertical></v-divider>

              <div
                v-if="
                  (subscriberNumber || currentUser.uid !== $route.query.uid) &&
                  !currentUser.isuser
                "
              >
                <v-card-title
                  >{{ userInfo.userDisplayName }} 구독자</v-card-title
                >
                <v-card-text>
                  <p
                    v-for="(people, index) in subscription"
                    :key="Object.keys(people)[index]"
                  >
                    {{ people }}
                  </p>
                </v-card-text>
              </div>
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
      userInfo: {
        userLibris: '',
        userDisplayName: '',
        userPhotoURL: '',
        userBackground: '',
        bio: '',
      },

      currentUser: {
        uid: '',

        myUsername: '',
        isuser: false,
      },

      subscription: [],
      subscribed: false,
      subscriberNumber: 0,

      recent: [],
    }
  },
  methods: {
    getUserInfo() {
      db.ref(`/users/${this.$route.query.uid}/`).once(
        'value',
        (s) =>
          (this.userInfo = {
            userLibris: s.val().libris,
            userDisplayName: s.val().username,
            userPhotoURL: s.val().photoURL,
            userBackground: s.val().background,
            bio: s.val().bio,
          })
      )

      auth.onAuthStateChanged((user) => {
        if (user)
          this.currentUser = {
            uid: user.uid,
            myUsername: user.displayName,
            isuser: this.currentUser.uid === this.$route.query.uid,
          }
      })
    },
    getSubscribtion() {
      db.ref(`/users/${this.$route.query.uid}/subscriber`)
        .once('value')
        .then((s) => {
          this.subscription = s.val() ?? []
          this.subscriberNumber = s.numChildren()
        })
    },
    async isSubscribed() {
      this.subscription = await db
        .ref(`/users/${this.$route.query.uid}/subscriber`)
        .once('value')
        .then((s) => s.val() ?? [])

      this.subscribed = Object.keys(this.subscription).includes(
        this.currentUser.uid
      )
    },
    notify() {
      db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.myUsername}님이 구독했습니다!`,
        time: Date.now(),
        link: `/loadaccount?uid=${this.$route.query.uid}`,
      })
    },
    async notifyNO() {
      await db.ref(`users/${this.$route.query.uid}/notification`).push({
        title: `${this.myUsername}님이 구독을 취소했습니다`,
        time: Date.now(),
        link: `/loadaccount?uid=${this.$route.query.uid}`,
      })
    },
    subscribe() {
      if (this.subscribed) {
        db.ref(
          `/users/${this.$route.query.uid}/subscriber/${this.currentUser.uid}`
        ).remove()

        db.ref(
          `/users/${this.currentUser.uid}/subscribe/${this.$route.query.uid}/${this.currentUser.uid}`
        ).remove()

        delete this.subscription[this.currentUser.uid]
        this.subscribed = false

        db.ref(`/users/${this.$route.query.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.$route.query.uid}/libris`).set(
            parseInt(s.val()) - 10
          )
        })

        this.notifyNO()
      } else {
        db.ref(`/users/${this.uid}/subscribe/${this.$route.query.uid}`).set(
          this.userInfo.userDisplayName
        )
        db.ref(`/users/${this.$route.query.uid}/subscriber/${this.uid}`).set(
          this.currentUser.myUsername
        )

        this.subscription[this.currentUser.uid] = this.currentUser.myUsername
        this.subscribed = true

        db.ref(`/users/${this.$route.query.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.$route.query.uid}/libris`).set(
            parseInt(s.val()) + 10
          )
        })

        this.notify()
      }

      setTimeout(() => this.getSubscribtion(), 50)
    },
  },
  async mounted() {
    this.getUserInfo()
    await this.getSubscribtion()
    await this.isSubscribed()
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

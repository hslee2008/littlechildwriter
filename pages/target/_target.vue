<template>
  <div>
    <v-card class="mx-auto" max-width="750">
      <v-container fluid>
        <v-row dense>
          <v-col cols="12">
            <v-card>
              <v-img
                :src="userInfo.userBackground"
                class="white--text align-end"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                height="200px"
              >
                <v-card-title v-text="userInfo.userDisplayName"></v-card-title>

                <v-card-actions>
                  <v-chip class="ma-2" color="red" text-color="white" label>
                    <v-icon left> mdi-youtube-subscription </v-icon>
                    {{ subscriberNumber }}
                  </v-chip>
                  <v-chip class="ma-2" color="blue" text-color="white" label>
                    <v-icon left> mdi-library </v-icon>
                    {{ userInfo.userLibris }}
                  </v-chip>
                  <v-chip class="ma-2" color="blue" text-color="white" label>
                    <v-icon left> mdi-book-open </v-icon>
                    {{ recent }}
                  </v-chip>
                </v-card-actions>
              </v-img>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <v-card-subtitle class="text--primary" v-if="userInfo.bio">
        {{ userInfo.bio }}
      </v-card-subtitle>
      <v-card-subtitle
        class="text--primary"
        style="color: grey !important"
        v-else
      >
        아직 나의 소개를 입력하지 않았습니다.
      </v-card-subtitle>

      <v-divider />

      <div>
        <v-card-title>{{ userInfo.userDisplayName }}의 프로젝트</v-card-title>
        <v-card-text>
          <NuxtLink
            v-for="(pro, index) in project"
            :key="pro.title"
            :to="`/content/${pro.link}`"
          >
            {{ pro.title }}<br />
          </NuxtLink>
        </v-card-text>
      </div>

      <v-divider />

      <div
        v-if="
          (subscriberNumber || currentUser.uid !== uid) && !currentUser.isuser
        "
      >
        <v-card-title>{{ userInfo.userDisplayName }} 구독자</v-card-title>
        <v-card-text>
          <span
            v-for="(people, index) in subscription"
            :key="Object.keys(people)[index]"
          >
            {{ people }}<br />
          </span>
        </v-card-text>
      </div>

      <v-card-actions>
        <v-btn :to="`/list?username=${userInfo.userDisplayName}`" class="my-3"
          >{{ userInfo.userDisplayName }}의 글<v-icon right
            >mdi-arrow-right-thin</v-icon
          >
        </v-btn>
        <v-btn
          class="my-3"
          color="primary"
          @click="subscribe"
          v-if="currentUser.uid !== uid"
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
    </v-card>

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js'
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
      project: [],
    }
  },
  methods: {
    getUserInfo() {
      db.ref(`/users/${this.uid}/`).once(
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
            isuser: this.currentUser.uid === this.uid,
          }
      })
    },
    getSubscribtion() {
      db.ref(`/users/${this.uid}/subscriber`)
        .once('value')
        .then((s) => {
          this.subscription = s.val() ?? []
          this.subscriberNumber = s.numChildren()
        })
    },
    async isSubscribed() {
      this.subscription = await db
        .ref(`/users/${this.uid}/subscriber`)
        .once('value')
        .then((s) => s.val() ?? [])

      this.subscribed = Object.keys(this.subscription).includes(
        this.currentUser.uid
      )
    },
    notify() {
      db.ref(`users/${this.uid}/notification`).push({
        title: `${this.currentUser.myUsername}님이 구독했습니다!`,
        time: Date.now(),
        link: `target/${this.uid}`,
      })
    },
    async notifyNO() {
      await db.ref(`users/${this.uid}/notification`).push({
        title: `${this.currentUser.myUsername}님이 구독을 취소했습니다`,
        time: Date.now(),
        link: `target/${this.uid}`,
      })
    },
    subscribe() {
      if (this.subscribed) {
        db.ref(`/users/${this.currentUser.uid}/subscribe/${this.uid}`).set(
          this.currentUser.myUsername
        )
        db.ref(
          `/users/${this.currentUser.uid}/subscribe/${this.uid}/${this.currentUser.uid}`
        ).remove()

        delete this.subscription[this.currentUser.uid]
        this.subscribed = false

        db.ref(`/users/${this.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.uid}/libris`).set(parseInt(s.val()) - 10)
        })

        this.notifyNO()
      } else {
        db.ref(`/users/${this.currentUser.uid}/subscribe/${this.uid}`).set(
          this.currentUser.myUsername
        )
        db.ref(`/users/${this.uid}/subscriber/${this.currentUser.uid}`).set(
          this.currentUser.myUsername
        )

        this.subscription[this.currentUser.uid] = this.currentUser.myUsername
        this.subscribed = true

        db.ref(`/users/${this.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.uid}/libris`).set(parseInt(s.val()) + 10)
        })

        this.notify()
      }

      setTimeout(() => this.getSubscribtion(), 50)
    },
    async postlist() {
      const content = db.ref('/contents/')

      await content.on('child_added', async (snapshot) => {
        const data = await snapshot.val()

        if (data.uid === this.uid) this.recent++
      })
    },
    async getFePro() {
      const projectChecked = await db
        .ref(`/users/${this.uid}/projectChecked`)
        .once('value', async (s) => {
          return await s.val()
        })

      db.ref(`/users/${this.uid}/project`).once('value', async (s) => {
        s.val().forEach((a) => {
          if (projectChecked.val()[a.title]) this.project.push(a)
        })
      })
    },
  },
  async mounted() {
    this.getUserInfo()
    await this.getSubscribtion()
    await this.isSubscribed()

    this.getFePro()
    this.postlist()
  },
  asyncData({ params }) {
    const uid = params.target

    return { uid }
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

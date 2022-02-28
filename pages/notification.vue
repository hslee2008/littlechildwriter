<template>
  <v-container>
    <v-row justify="space-around">
      <v-card width="100%">
        <v-img height="200px" :src="userInfo.background">
          <v-app-bar flat color="rgba(0, 0, 0, 0)">
            <v-toolbar-title class="text-h6 white--text pl-0">
              알림
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <v-btn color="white" icon @click="clearEverything">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-app-bar>

          <v-card-title class="white--text mt-8">
            <v-avatar size="56">
              <v-img alt="user" :src="userInfo.photoURL" />
            </v-avatar>
            <p class="ml-3">{{ userInfo.username }}</p>
          </v-card-title>
        </v-img>

        <v-card-text>
          <div class="font-weight-bold ml-8 mb-2">알림 리스트</div>

          <v-timeline align-top dense clipped>
            <v-timeline-item
              v-for="message in notifiactionsList"
              :key="message.time"
              small
            >
              <v-row>
                <v-col>
                  <div class="font-weight-normal">
                    <strong>{{ message.username }}</strong> @{{
                      new Date(message.time).toLocaleDateString()
                    }}
                  </div>
                  <div>{{ message.title }}</div>
                </v-col>

                <v-col class="text-right">
                  <v-menu offset-y>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn icon v-bind="attrs" v-on="on" cols="1">
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list dense>
                      <v-list-item>
                        <v-list-item-title @click="deleteThis(index)"
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
          </v-timeline>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { db, auth } from '../plugins/firebase'

export default {
  data() {
    return {
      notifiactionsList: [],

      userInfo: {
        username: '',
        email: '',
        photoURL: '',
        background: '',
      },
    }
  },
  methods: {
    clearEverything() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          db.ref(`/users/${user.uid}/notification`).remove()
          this.notificationsList = []
        }
      })

      this.getNotification()
    },
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userInfo = {
            username: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            background: await db
              .ref(`/users/${user.uid}/background`)
              .once('value')
              .then((a) => a.val()),
          }
        }
      })
    },
    deleteThis(e) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const a = db.ref(`/users/${user.uid}/notification`)
          let data = {}

          await a.once('value', (snapshot) => {
            data = snapshot.val() ?? []
          })

          a.child(Object.keys(data)[0]).remove()
        }
      })

      this.notifiactionsList.splice(e, 1)

      if (this.notifiactionsList.length === 0) this.$router.push('/')

      this.notifiactionsList[e].title = '삭제 되었습니다.'

      this.getNotification()
    },
    getNotification() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.notifiactionsList = Object.values(
            await db
              .ref(`/users/${user.uid}/notification`)
              .once('value')
              .then((s) => s.val() ?? [])
          )
        }
      })
    },
  },
  mounted() {
    this.getNotification()
    this.getUserInfo()
  },
}
</script>

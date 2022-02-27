<template>
  <div>
    <h1>알림</h1>
    <div>
      <v-timeline align-top dense>
        <v-timeline-item
          v-for="(message, index) in notifiactionsList"
          :key="message.time"
          small
        >
          <div>
            <div class="font-weight-normal">
              <strong>{{ message.username }}</strong>
              ({{
                new Date(message.time).toLocaleDateString() +
                ' ' +
                new Date(message.time).toLocaleTimeString()
              }})

              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list dense>
                  <v-list-item>
                    <v-list-item-title @click="$router.push(message.link)">
                      <v-icon left>mdi-open-in-new</v-icon>
                    </v-list-item-title></v-list-item
                  >
                  <v-list-item>
                    <v-list-item-title @click="deleteThis(index)"
                      ><v-icon color="error"
                        >mdi-delete</v-icon
                      ></v-list-item-title
                    >
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
            <div>{{ message.title }}</div>
          </div>
        </v-timeline-item>
      </v-timeline>
    </div>
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase'

export default {
  data() {
    return {
      notifiactionsList: [],
    }
  },
  methods: {
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
      this.notifiactionsList[e].time = '삭제 되었습니다'

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
  },
}
</script>

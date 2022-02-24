<template>
  <div>
    <h1>알림</h1>
    <div>
      <v-timeline align-top dense>
        <v-timeline-item
          v-for="(message, index) in listev"
          :key="message.time"
          small
        >
          <div>
            <div class="font-weight-normal">
              <strong>{{ message.username }}</strong> @{{
                new Date(message.time).toLocaleDateString()
              }}
            </div>
            <div>{{ message.title }}</div>
            <v-btn :to="message.link" elevation="0"
              ><v-icon left>mdi-open-in-new</v-icon> 열기</v-btn
            >
            <v-btn @click="deleteThis(index)" elevation="0"
              ><v-icon left>mdi-delete</v-icon> 삭제</v-btn
            >
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
      listev: [],
    }
  },
  methods: {
    deleteThis(e) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          const a = db.ref(`/users/${user.uid}/notification`)
          let data = {}

          await a.once('value', (snapshot) => {
            data = snapshot.val()
          })

          a.child(Object.keys(data)[0]).remove()
        }
      })
    },
  },
  mounted() {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        this.listev = Object.values(
          await db
            .ref(`/users/${user.uid}/notification`)
            .once('value')
            .then((s) => s.val())
        )
      }
    })
  },
}
</script>

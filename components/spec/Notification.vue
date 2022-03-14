<template>
  <v-dialog v-model="notifOverlay" width="700">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        icon
        style="color: gold"
        aria-label="알림"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>{{
          !notificationsList.length ? 'mdi-bell' : 'mdi-bell-ring'
        }}</v-icon>
      </v-btn>
    </template>

    <v-card>
      <v-img height="200px" :src="background">
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
          <v-avatar size="40">
            <v-img alt="user" :src="photoURL" />
          </v-avatar>
          <p class="ml-3 mt-1">{{ username }}</p>
        </v-card-title>
      </v-img>

      <br />

      <v-list>
        <v-list-item
          v-for="(message, index) in notificationsList"
          :key="message.time"
          small
        >
          <v-list-item-content>
            <v-menu offset-x>
              <template v-slot:activator="{ on, attrs }">
                <div style="display: flex">
                  <v-list-item-subtitle>
                    <div class="font-weight-normal">
                      {{ new Date(message.time).toLocaleDateString() }}
                    </div>
                    <div>{{ message.title }}</div>
                  </v-list-item-subtitle>

                  <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </div>
              </template>

              <v-list dense>
                <v-list-item>
                  <v-list-item-title>
                    <v-btn @click="openItem(message.link)" small icon
                      ><v-icon>mdi-open-in-new</v-icon></v-btn
                    >
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, auth } from '../../plugins/firebase'

export default {
  props: ['uid', 'username', 'photoURL', 'background'],
  data() {
    return {
      notificationsList: [],
      notifOverlay: false,
    }
  },
  methods: {
    async clearEverything() {
      await db.ref(`/users/${this.uid}/notification`).remove()
      this.notificationsList = []

      this.getNotification()
    },
    openItem(link) {
      this.$router.push(link)
      this.notifOverlay = false
    },
    async getNotification() {
      this.notificationsList = Object.values(
        await db
          .ref(`/users/${this.uid}/notification`)
          .once('value')
          .then((s) => s.val() ?? [])
      )

      this.notification = this.notificationsList.length
    },
  },
  mounted() {
    this.getNotification()
  },
}
</script>

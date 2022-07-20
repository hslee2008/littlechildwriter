<template>
  <v-app>
    <v-navigation-drawer v-model="bookmark" fixed app temporary color="#23262E">
      <v-card-title> <v-icon left>mdi-bookmark</v-icon> 북마크 </v-card-title>
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="`/content/${item.time}`"
        >
          <v-list-item-content>
            <v-list-item-title> {{ item.title }} </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-spacer />
            <v-menu offset-y>
              <template #activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" cols="1" v-on="on" @click.prevent>
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="deleteBookmark(item.time, i)">
                  <v-list-item-content>
                    <v-list-item-title>
                      <v-icon left> mdi-delete </v-icon>
                      삭제
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar fixed app color="#22272E" class="elevation-0">
      <v-app-bar-nav-icon
        v-if="userInfo.displayName"
        @click="bookmark = !bookmark"
      />

      <NuxtLink to="/">
        <v-avatar size="30">
          <v-img src="icon.png" />
        </v-avatar>
      </NuxtLink>

      <v-spacer />

      <v-dialog
        v-if="userInfo.uid"
        v-model="notifOverlay"
        width="700"
        scrollable
      >
        <template #activator="{ on, attrs }">
          <v-btn icon class="amber--text" v-bind="attrs" v-on="on">
            <v-icon v-text="notif.length > 0 ? 'mdi-bell-ring' : 'mdi-bell'" />
          </v-btn>
        </template>

        <v-card>
          <v-list v-if="notif.length > 0">
            <v-list-item v-for="(d, i) in notif" :key="i" @click="load(d.link)">
              <v-list-item-avatar>
                <v-img :src="d.photoURL" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title v-text="d.title" />
                <v-list-item-subtitle v-text="d.time" />
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="clearEverything">
              비우기 <v-icon right> mdi-delete </v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <UserMenu />
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { auth, db } from '@/plugins/firebase'
import UserMenu from './UserMenu.vue'

export default {
  data() {
    return {
      notif: [],
      items: [],
      notifOverlay: false,
      bookmark: false
    }
  },
  mounted() {
    this.getBookMarks()
    this.getNotification()
  },
  methods: {
    clearEverything() {
      db.ref(`/users/${this.userInfo.uid}/notification`).remove()
      this.notif = []
    },
    getNotification() {
      db.ref(`/users/${this.userInfo.uid}/notification`).on(
        'child_added',
        async s => this.notif.push(await s.val())
      )
    },
    load(link) {
      this.notifOverlay = false
      this.$forceUpdate()
      this.$router.push(link)
    },
    getBookMarks() {
      auth.onAuthStateChanged(user => {
        user &&
          db
            .ref(`/users/${this.userInfo.uid}/bookmarks`)
            .on('child_added', async s => this.items.push(await s.val()))
      })
    },
    deleteBookmark(time, i) {
      db.ref(`/users/${this.userInfo.uid}/bookmarks/${time}`).remove()
      db.ref(`/contents/${time}/bookmarks/${this.userInfo.uid}`).remove()
      this.updateLibris(this.userInfo.uid, -0.1)
      this.items.splice(i, 1)
    }
  },
  components: {
    UserMenu
  }
}
</script>

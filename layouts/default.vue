<template>
  <v-app>
    <v-navigation-drawer v-model="bookmark" fixed app temporary color="#23262E">
      <template v-if="items.length > 0">
        <v-card-title> <v-icon left>mdi-bookmark</v-icon> 북마크 </v-card-title>
        <v-list>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="`/book/content/${item.time}`"
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
                        <v-icon left> mdi-trash-can </v-icon>
                        삭제
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>

    <v-app-bar fixed app color="#23262E" class="elevation-0">
      <v-app-bar-nav-icon v-if="userInfo.uid" @click="bookmark = !bookmark" />

      <NLink to="/">
        <v-avatar size="30">
          <v-img src="icon.png" />
        </v-avatar>
      </NLink>

      <v-spacer />

      <v-slide-x-transition>
        <v-btn v-if="$route.path !== '/book/post'" icon to="/book/post">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-slide-x-transition>

      <v-dialog
        v-if="userInfo.uid"
        v-model="notifOverlay"
        width="700"
        scrollable
      >
        <template #activator="{ on, attrs }">
          <v-btn icon class="amber--text" v-bind="attrs" v-on="on">
            <v-badge
              overlap
              left
              transition
              :content="notif.length"
              :value="notif.length"
            >
              <v-icon>
                {{ notif.length > 0 ? 'mdi-bell-ring' : 'mdi-bell' }}
              </v-icon>
            </v-badge>
          </v-btn>
        </template>

        <v-card>
          <v-list v-if="notif.length > 0">
            <v-list-item v-for="(d, i) in notif" :key="i" @click="load(d.link)">
              <v-list-item-avatar>
                <v-img :src="d.photoURL" />
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title>{{ d.title }}</v-list-item-title>
                <v-list-item-subtitle>{{ d.time }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-spacer />
            <v-btn text @click="clearEverything">
              비우기 <v-icon right> mdi-notification-clear-all </v-icon>
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

<script setup lang="ts">
import UserMenu from './UserMenu.vue'
import { auth, db } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const router = useRouter()
const userInfo = User()
const notif = ref<any>([])
const items = ref<any>([])
const notifOverlay = ref<boolean>(false)
const bookmark = ref<boolean>(false)

onMounted(() => {
  auth.onAuthStateChanged(u => {
    if (!u) {
      return
    }

    db.ref(`/users/${u.uid}/bookmarks`).on('child_added', async s =>
      items.value.push(await s.val())
    )

    db.ref(`/users/${u.uid}/notification`).on('child_added', async s =>
      notif.value.push(await s.val())
    )
  })
})

const clearEverything = () => {
  db.ref(`/users/${userInfo.value.uid}/notification`).remove()
  notif.value = []
}

const load = (link: string) => {
  notifOverlay.value = false
  router.push(link)
}

const deleteBookmark = (time: string, i: number) => {
  db.ref(`/users/${userInfo.value.uid}/bookmarks/${time}`).remove()
  db.ref(`/contents/${time}/bookmarks/${userInfo.value.uid}`).remove()
  items.value.splice(i, 1)
}
</script>

<style>
#pwainstall {
  display: none;
}

@media (display-mode: browser) {
  #pwainstall {
    display: block;
  }
}
</style>

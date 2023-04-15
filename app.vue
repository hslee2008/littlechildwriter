<template>
  <v-app>
    <NuxtLayout>
      <v-app-bar fixed clipped-left>
        <template #prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </template>

        <NuxtLink to="/" class="ml-2">
          <v-avatar size="30" image="/icon.png" />
        </NuxtLink>

        <v-spacer />

        <v-btn
          v-if="$route.path !== '/book/post' && userInfo.loggedIn"
          icon
          to="/book/post"
        >
          <v-icon>mdi-plus-circle-outline</v-icon>
        </v-btn>

        <v-btn v-if="userInfo.loggedIn" icon>
          <v-badge
            bordered
            color="primary"
            :content="notif.length"
            class="text-amber"
          >
            <v-icon>
              {{
                notif.length > 0
                  ? `mdi-bell-ring${notifOverlay ? '' : '-outline'}`
                  : `mdi-bell${notifOverlay ? '' : '-outline'}`
              }}
            </v-icon>
          </v-badge>

          <v-dialog
            v-if="userInfo.loggedIn"
            v-model="notifOverlay"
            width="700"
            scrollable
            activator="parent"
          >
            <v-card>
              <v-list v-if="notif.length > 0" nav>
                <v-list-item
                  v-for="(d, i) in notif"
                  :key="i"
                  @click="LoadNotification(d.link)"
                >
                  <template #prepend>
                    <UserPhoto :size="45" :src="d?.photoURL" />
                  </template>

                  <v-list-item-title>{{ d.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ d.time }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <div v-else>
                <v-card-text class="text-center text-grey">
                  알림이 없습니다.
                </v-card-text>
              </div>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  rounded="lg"
                  variant="tonal"
                  text
                  @click="clearEverything"
                >
                  비우기 <v-icon right> mdi-notification-clear-all </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>

        <v-btn v-if="userInfo.loggedIn" icon>
          <v-avatar size="35">
            <v-img alt="User Avatar" :src="userInfo.photoURL" />
          </v-avatar>
          <v-menu right activator="parent">
            <v-card>
              <v-card class="d-flex">
                <v-avatar size="60" class="ma-auto ml-6">
                  <v-img alt="User Avatar" :src="userInfo.photoURL" />
                </v-avatar>

                <v-card-text>
                  <v-card-title>{{ userInfo.displayName }}</v-card-title>
                  <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
                </v-card-text>
              </v-card>

              <v-list nav>
                <v-list-item
                  title="로그아웃"
                  prepend-icon="mdi-logout"
                  @click="userInfo.logout"
                />
              </v-list>

              <v-card class="py-3">
                <v-btn-toggle
                  block
                  variant="outlined"
                  class="d-flex justify-center"
                >
                  <v-btn to="/account/account" icon="mdi-cog-outline"></v-btn>
                  <v-btn
                    :to="`/user/${userInfo.uid}`"
                    icon="mdi-account-circle"
                  ></v-btn>
                  <v-btn to="/bookmarks" icon="mdi-bookmark-multiple"></v-btn>
                  <v-btn to="/book/post" icon="mdi-pencil"></v-btn>
                </v-btn-toggle>
              </v-card>
            </v-card>
          </v-menu>
        </v-btn>

        <v-btn v-else rounded="lg" variant="tonal" to="/account/login" icon>
          <v-icon>mdi-account-circle</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" floating mobile-breakpoint="400">
        <v-list nav expand>
          <v-list-item
            to="/"
            title="홈페이지"
            prepend-icon="mdi-home-variant"
          />
          <v-list-item
            to="/list"
            title="책 목록"
            prepend-icon="mdi-format-list-text"
          />
          <v-list-item
            to="/class/classes"
            title="알림판"
            prepend-icon="mdi-clipboard-multiple"
          />
          <v-list-item
            to="/blog/home"
            title="창작 코너"
            prepend-icon="mdi-typewriter"
          />
          <v-list-item
            to="/debate/home"
            title="토론 광장"
            prepend-icon="mdi-lectern"
          />

          <v-divider class="my-3" />

          <v-list-item
            to="/libris/libris"
            title="명예의 전당"
            prepend-icon="mdi-podium"
          />
          <v-list-item
            to="/libris/table"
            title="포인트제"
            prepend-icon="mdi-table-large"
          />
        </v-list>
      </v-navigation-drawer>

      <v-main :class="$route.path !== '/' ? 'mx-5' : ''">
        <NuxtPage class="mb-10" />

        <v-banner
          v-if="userInfo.uid && (!userInfo.displayName || !userInfo.photoURL)"
          :sticky="true"
          lines="one"
          class="rounded-lg"
        >
          <template #text>
            <div class="ma-2">설정에서 이름과 사진을 변경하세요</div>
          </template>

          <template #actions>
            <v-btn rounded="lg" to="/account/account">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
        </v-banner>
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()

const userInfo = User()
userInfo.initUserInfo()

const notif = ref<any>([])
const notifOverlay = ref<boolean>(false)
const drawer = ref<boolean>(!mobile.value)

useAuth((u: any) => {
  $db
    .ref(`/users/${u.uid}/notification`)
    .on('child_added', async (s: any) => notif.value.push(await s.val()))

  $db.ref('.info/connected').on('value', () => {
    $db.ref(`/users/${userInfo.uid}/status`).onDisconnect().set('offline')
    $db.ref(`/users/${userInfo.uid}/status`).set('online')
  })
})

const clearEverything = () => {
  $db.ref(`/users/${userInfo.uid}/notification`).remove()
  notif.value = []
}

const LoadNotification = (link: string) => {
  notifOverlay.value = false
  navigateTo(link)
}
</script>

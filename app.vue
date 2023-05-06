<template>
  <v-app>
    <NuxtLayout>
      <v-app-bar fixed clipped-left class="px-3">
        <template #prepend>
          <v-app-bar-nav-icon @click="drawer = !drawer" />
        </template>

        <NuxtLink to="/" class="ml-2">
          <v-avatar size="30" image="/icon.png" />
        </NuxtLink>

        <v-spacer />

        <v-btn
          v-if="$route.path !== '/book/post' && userInfo.loggedIn"
          icon="mdi-plus-circle-outline"
          to="/book/post"
        />

        <v-btn v-if="userInfo.loggedIn" icon>
          <v-badge
            bordered
            color="primary"
            :content="notif.length"
            class="text-amber"
            size="x-small"
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
                  append-icon="mdi-notification-clear-all"
                  @click="clearEverything"
                >
                  비우기
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>

        <v-btn v-if="userInfo.loggedIn" icon>
          <MenuUserBox />
        </v-btn>
        <v-btn
          v-else
          rounded="lg"
          variant="tonal"
          to="/account/login"
          icon="mdi-account-circle"
        />
      </v-app-bar>

      <v-navigation-drawer v-model="drawer" floating mobile-breakpoint="400">
        <MenuNavigation />
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
            <v-btn rounded="lg" to="/account/account" icon="mdi-open-in-new" />
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

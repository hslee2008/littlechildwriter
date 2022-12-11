<template>
  <v-app style="background-color: #23262e">
    <NuxtLayout>
      <NuxtLoadingIndicator />

      <NuxtErrorBoundary>
        <template #error="{ error }">
          <p>An error occurred: {{ error }}</p>
        </template>
      </NuxtErrorBoundary>

      <v-navigation-drawer
        :model-value="drawer"
        floating
        rounded
        permanent
        :temporary="mobile"
        color="#23262E"
      >
        <v-list nav expand>
          <v-list-item to="/">
            <v-list-item-title>
              <v-icon start>mdi-home-variant</v-icon> 홈페이지
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/list">
            <v-list-item-title>
              <v-icon start>mdi-format-list-text</v-icon> 책 목록
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/class/classes">
            <v-list-item-title>
              <v-icon start>mdi-clipboard-multiple</v-icon> 알림판
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/blog/home">
            <v-list-item-title>
              <v-icon start>mdi-typewriter</v-icon> 창작 코너
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/debate/home">
            <v-list-item-title>
              <v-icon start>mdi-lectern</v-icon> 토론 광장
            </v-list-item-title>
          </v-list-item>

          <template v-if="userInfo.uid">
            <v-divider class="my-1" />

            <v-list-item to="/bookmark">
              <v-list-item-title>
                <v-icon start>mdi-bookmark-multiple</v-icon> 책갈피
              </v-list-item-title>
            </v-list-item>
            <v-list-item to="/account/account">
              <v-list-item-title>
                <v-icon start>mdi-cog</v-icon> 설정
              </v-list-item-title>
            </v-list-item>
          </template>

          <v-divider class="my-1" />

          <v-list-item to="/libris/libris">
            <v-list-item-title>
              <v-icon start>mdi-podium</v-icon> 명예의 전당
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="/libris/table">
            <v-list-item-title>
              <v-icon start>mdi-table-large</v-icon> 포인트제
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar
        fixed
        clipped-left
        class="elevation-0"
        :collapse="$route.path.startsWith('/class')"
        color="#23262E"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="#23262E" />

        <NuxtLink to="/" class="ml-2">
          <v-avatar size="30" density="compact" image="/icon.png" />
        </NuxtLink>

        <v-spacer />

        <div v-if="!$route.path.startsWith('/class')">
          <v-slide-x-transition>
            <v-btn
              v-if="$route.path !== '/book/post' && userInfo.uid"
              icon
              to="/book/post"
              color="#23262E"
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-slide-x-transition>

          <v-dialog
            v-if="userInfo.uid"
            :model-value="notifOverlay"
            width="700"
            activator="#notif"
            transition="dialog-bottom-transition"
            scrollable
          >
            <template #activator="{ attrs, on }">
              <v-btn icon v-bind="attrs" v-on="on" id="notif" color="#23262E">
                <v-badge
                  overlap
                  left
                  transition
                  :content="notif.length"
                  :model-value="notif.length"
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
              </v-btn>
            </template>

            <v-card bg-color="#23262E" >
              <v-list v-if="notif.length > 0" nav>
                <v-list-item
                  v-for="(d, i) in notif"
                  :key="i"
                  @click="load(d.link)"

                >
                  <template #prepend>
                    <UserPhoto :src="d.photoURL" />
                  </template>

                  <v-list-item-content>
                    <v-list-item-title>{{ d.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ d.time }}</v-list-item-subtitle>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
              <div v-else>
                <v-card-text class="text-center text-grey">
                  알림이 없습니다.
                </v-card-text>
              </div>

              <v-card-actions>
                <v-spacer />
                <v-btn text @click="clearEverything">
                  비우기 <v-icon right> mdi-notification-clear-all </v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-menu v-if="userInfo.uid" right activator="#image">
            <template #activator="{ on }">
              <v-btn icon>
                <v-avatar size="35">
                  <v-img
                    alt="User Avatar"
                    id="image"
                    :src="userInfo.photoURL"
                  />
                </v-avatar>
              </v-btn>
            </template>

            <v-card class="d-flex pa-3 text-center rounded-0">
              <v-avatar size="45" class="ma-auto">
                <v-img alt="User Avatar" :src="userInfo.photoURL" />
              </v-avatar>

              <div>
                <v-card-title>{{ userInfo.displayName }}</v-card-title>
                <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
              </div>
            </v-card>

            <v-list nav>
              <v-list-item to="/account/account">
                <v-list-item-title>
                  <v-icon start>mdi-cog-outline</v-icon> 설정
                </v-list-item-title>
              </v-list-item>
              <v-list-item :to="`/user/${userInfo.uid}`">
                <v-list-item-title>
                  <v-icon start>mdi-account-circle</v-icon> 프로필
                </v-list-item-title>
              </v-list-item>

              <v-divider />

              <v-list-item @click="logout">
                <v-list-item-title>
                  <v-icon start>mdi-logout</v-icon> 로그아웃
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn v-else to="/account/login" icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <v-main>
        <NuxtPage />
      </v-main>
    </NuxtLayout>
  </v-app>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db, $auth } = useNuxtApp()
const router = useRouter()
const { mobile } = useDisplay()
const userInfo = User()

const notif = ref<any>([])
const notifOverlay = ref<boolean>(false)
const drawer = ref<boolean>(!mobile.value)

onMounted(() => {
  $auth.onAuthStateChanged((u: any) => {
    if (!u) return

    $db
      .ref(`/users/${u.uid}/notification`)
      .on('child_added', async (s: any) => notif.value.push(await s.val()))

    $db.ref('.info/connected').on('value', (s: any) => {
      if (s.val()) {
        $db
          .ref(`/users/${userInfo.value.uid}/status`)
          .onDisconnect()
          .set('offline')
        $db.ref(`/users/${userInfo.value.uid}/status`).set('online')
      }
    })
  })
})

const clearEverything = () => {
  $db.ref(`/users/${userInfo.value.uid}/notification`).remove()
  notif.value = []
}

const load = (link: string) => {
  notifOverlay.value = false
  router.push(link)
}

const logout = () => {
  $auth.signOut()
  router.push('/account/login')
  userInfo.value = {
    displayName: '',
    email: '',
    photoURL: '',
    uid: ''
  }
}
</script>

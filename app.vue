<template>
  <v-app style="background-color: #23262e">
    <NuxtLayout>
      <NuxtLoadingIndicator />

      <NuxtErrorBoundary>
        <template #error="{ error }">
          <p>An error occurred: {{ error }}</p>
        </template>
      </NuxtErrorBoundary>

      <v-app-bar
        fixed
        clipped-left
        class="elevation-0 pl-3 pr-3"
        :collapse="$route.path.startsWith('/class')"
        color="#23262E"
      >
        <template #prepend>
          <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        </template>

        <NuxtLink to="/" class="ml-2">
          <v-avatar size="35" image="/icon.png" />
        </NuxtLink>

        <v-spacer />

        <div v-if="!$route.path.startsWith('/class')">
          <v-slide-x-transition>
            <v-btn
              rounded="lg"
              v-if="$route.path !== '/book/post' && userInfo.uid"
              icon
              to="/book/post"
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </v-slide-x-transition>

          <v-dialog
            v-if="userInfo.uid"
            v-model="notifOverlay"
            width="700"
            activator="#notif"
            scrollable
          >
            <template #activator="{ props }">
              <v-btn rounded="lg" icon v-bind="props" color="#23262E">
                <v-badge
                  id="notif"
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
              </v-btn>
            </template>

            <v-card bg-color="#23262E">
              <v-list v-if="notif.length > 0" nav>
                <v-list-item
                  v-for="(d, i) in notif"
                  :key="i"
                  @click="load(d.link)"
                >
                  <template #prepend>
                    <UserPhoto :src="d?.photoURL" />
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

          <v-menu v-if="userInfo.uid" right activator="#image">
            <template #activator="{ on }">
              <v-btn rounded="lg" icon>
                <v-avatar size="35">
                  <v-img
                    id="image"
                    alt="User Avatar"
                    :src="userInfo.photoURL"
                  />
                </v-avatar>
              </v-btn>
            </template>

            <v-card class="d-flex pa-3 text-center rounded-0">
              <v-avatar size="35" class="ma-auto">
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
          <v-btn rounded="lg" v-else variant="tonal" to="/account/login" icon>
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </div>
      </v-app-bar>

      <v-navigation-drawer
        :model-value="drawer"
        floating
        mobile-breakpoint="400"
        color="#23262E"
      >
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

          <template v-if="userInfo.uid">
            <v-divider class="my-1" />

            <v-list-item
              to="/bookmarks"
              title="책갈피"
              prepend-icon="mdi-bookmark-multiple"
            />
            <v-list-item
              to="/account/account"
              title="설정"
              prepend-icon="mdi-cog"
            />
          </template>

          <v-divider class="my-1" />

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

      <v-main
        :style="
          $route.path !== '/' ? 'margin-right: 10px; margin-left: 10px;' : ''
        "
      >
        <NuxtPage />

        <br />

        <v-banner
          v-if="userInfo.uid && (!userInfo.displayName || !userInfo.photoURL)"
          :sticky="true"
          lines="one"
        >
          <template #text> 설정에서 이름과 사진을 변경하세요 </template>

          <template #actions>
            <v-btn rounded="lg" variant="tonal" to="/account/account">
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

const { $db, $auth } = useNuxtApp()
const router = useRouter()
const { mobile } = useDisplay()
const userInfo = User()

const notif = ref<any>([])
const notifOverlay = ref<boolean>(false)
const drawer = ref<boolean>(!mobile.value)

useAuth((u: any) => {
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

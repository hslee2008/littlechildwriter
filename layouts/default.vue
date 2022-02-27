<template>
  <v-app dark>
    <v-app-bar fixed app style="z-index: 99">
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <NuxtLink to="/" style="text-decoration: none; color: white">
            <v-avatar size="30" v-bind="attrs" v-on="on">
              <v-img src="/icon.png"></v-img>
            </v-avatar>
            <span class="ml-1" v-bind="attrs" v-on="on">Little 작가</span>
          </NuxtLink>
        </template>
        <span class="white--text">홈으로 이동하기</span>
      </v-tooltip>

      <v-spacer />

      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
            @click.stop="$vuetify.theme.dark = !$vuetify.theme.dark"
          >
            <v-icon>mdi-brightness-6</v-icon>
          </v-btn>
        </template>
        <span>밝은/어두운 모드</span>
      </v-tooltip>

      <v-btn to="/notification" icon style="color: gold">
        <v-icon>{{
          !login.notification ? 'mdi-bell' : 'mdi-bell-ring'
        }}</v-icon>
      </v-btn>

      <v-menu v-if="login.photo" bottom min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon x-large v-on="on">
            <v-avatar size="35">
              <v-img :src="login.photo" />
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-list-item-content class="justify-center">
            <div class="mx-auto text-center">
              <v-avatar class="my-1">
                <v-img :src="login.photo" />
              </v-avatar>
              <h3>{{ login.name }}</h3>
              <p class="text-caption mt-1">
                {{ login.email }}
              </p>
              <NuxtLink :to="'/loadaccount?uid=' + login.uid">
                <v-btn color="primary">나의 프로필 페이지</v-btn>
              </NuxtLink>

              <v-divider class="my-3"></v-divider>

              <p>
                <v-icon left>mdi-crown-circle</v-icon>Libris:
                {{ login.libris }}
              </p>

              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text to="/account"> 계정 편집 </v-btn>
              <v-btn depressed rounded text to="/post"> 글 올리기 </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> 로그아웃 </v-btn>
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>
      <v-btn to="/login" icon v-else><v-icon>mdi-account-circle</v-icon></v-btn>
    </v-app-bar>

    <v-main>
      <v-container>
        <Nuxt style="margin: 5px" />
      </v-container>
    </v-main>

    <v-footer :fixed="true" style="z-index: 100">
      &copy; {{ new Date().getFullYear() }} Little 작가
    </v-footer>
  </v-app>
</template>

<script>
import { db } from '../plugins/firebase'

export default {
  name: 'DefaultLayout',
  data() {
    return {
      login: {
        name: '',
        email: '',
        photo: '',
        libris: 0,
        notification: 0,
        uid: '',
      },
      drawer: false,
      sheet: false,
    }
  },
  methods: {
    logout() {
      this.$fire.auth.signOut()
      this.$forceUpdate()
    },
    gotoHome() {
      this.$router.push('/')
    },
    getUserInfo() {
      this.$fire.auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.login = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
            notification: Object.keys(
              (await db
                .ref(`/users/${user.uid}/notification`)
                .once('value')
                .then((s) => s.val())) ?? false
            ).length,
            libris: await db
              .ref('users/' + user.uid)
              .once('value')
              .then((s) => s.val().libris ?? 0),
          }
        } else {
          this.login = {}
        }
      })
    },
  },
  mounted() {
    this.getUserInfo()
  },
}
</script>

<style>
.to-show {
  display: none;
}

@media screen and (max-width: 686px) {
  .to-hide {
    display: none;
  }
  .to-show {
    display: block;
  }
}
</style>

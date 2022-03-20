<template>
  <v-app-bar
    v-if="!$vuetify.breakpoint.mobile"
    fixed
    clipped-left
    app
    elevate-on-scroll
    color="#23272F"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <NuxtLink to="/" style="text-decoration: none; color: white">
          <v-avatar size="30" v-bind="attrs" v-on="on">
            <v-img src="/logo.avif"></v-img>
          </v-avatar>
          <span class="ml-1" v-bind="attrs" v-on="on">Little 작가</span>
        </NuxtLink>
      </template>
      <span class="white--text">홈으로 이동하기</span>
    </v-tooltip>

    <v-spacer />

    <Notification
      :uid="login.uid"
      :username="login.name"
      :photoURL="login.photo"
      :background="login.background"
    />

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
          <div class="text-center">
            <v-avatar class="my-1">
              <v-img :src="login.photo" />
            </v-avatar>
            <h3>{{ login.name }}</h3>
            <p class="text-caption mt-1">
              {{ login.email }}
            </p>
            <NuxtLink :to="`/account/${login.uid}`">
              <v-btn color="primary">나의 프로필 페이지</v-btn>
            </NuxtLink>

            <v-divider class="my-3"></v-divider>

            <p>
              <v-icon left>mdi-crown-circle</v-icon>Libris:
              {{ login.libris }}
            </p>

            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text to="/account" aria-label="계정">
              계정 편집
            </v-btn>
            <v-btn depressed rounded text to="/post"> 글 올리기 </v-btn>
            <v-divider class="my-3"></v-divider>
            <v-btn depressed rounded text @click="logout"> 로그아웃 </v-btn>
          </div>
        </v-list-item-content>
      </v-card>
    </v-menu>

    <v-btn to="/login" icon v-else><v-icon>mdi-account-circle</v-icon></v-btn>
  </v-app-bar>
</template>

<script>
import { auth, db } from '../plugins/firebase';

export default {
  name: 'DefaultLayout',
  data() {
    return {
      login: {
        name: '',
        email: '',
        background: '',
        photo: '',
        uid: '',
        libris: 0,
      },

      drawer: false,
      sheet: false,
    };
  },
  methods: {
    logout() {
      auth.signOut();
      this.$forceUpdate();
    },
    gotoHome() {
      this.$router.push('/');
    },
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.login = {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            uid: user.uid,
            background: await db
              .ref(`users/${user.uid}/background`)
              .once('value')
              .then((s) => s.val() ?? ''),
            libris: await db
              .ref(`users/${user.uid}/libris`)
              .once('value')
              .then((s) => s.val() ?? 0),
          };
        } else {
          this.login = {};
        }
      });
    },
    updateUserInfo() {
      db.ref(`/users/${this.login.uid}`).update({
        username: this.login.name,
        photoURL: this.login.photo,
      });
    },
  },
  async mounted() {
    await this.getUserInfo();
    this.updateUserInfo();
  },
};
</script>

<template>
  <v-app>
    <AppBar />

    <v-main>
      <v-container>
        <Nuxt />

        <template v-if="$vuetify.breakpoint.mobile">
          <br /><br /><br />
        </template>
      </v-container>
    </v-main>

    <v-bottom-navigation fixed v-if="$vuetify.breakpoint.mobile">
      <v-btn to="/" x-small>
        홈

        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn to="/post" x-small>
        쓰기
        <v-icon>mdi-pencil</v-icon>
      </v-btn>

      <v-btn to="/list" x-small>
        리스트

        <v-icon>mdi-library</v-icon>
      </v-btn>

      <v-menu v-if="login.photo" bottom min-width="200px" rounded offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon v-on="on">
            <v-avatar size="30">
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
              <NuxtLink :to="`/user/${login.uid}`">
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
              <v-btn depressed rounded text to="/studios"> 스튜디오 </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn depressed rounded text @click="logout"> 로그아웃 </v-btn>

              <Notification
                :uid="login.uid"
                :username="login.name"
                :photoURL="login.photo"
                :background="login.background"
              />
            </div>
          </v-list-item-content>
        </v-card>
      </v-menu>

      <v-btn to="/login" icon v-else><v-icon>mdi-account-circle</v-icon></v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
import AppBar from './AppBar.vue';
import { auth, db } from '../plugins/firebase';

export default {
  name: 'DefaultLayout',
  components: {
    AppBar,
  },
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
      this.$router.push('/login');
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
          this.login = {
            name: '',
            email: '',
            background: '',
            photo: '',
            uid: '',
            libris: 0,
          };
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
  async created() {
    await this.getUserInfo();
    this.updateUserInfo();
  },
};
</script>

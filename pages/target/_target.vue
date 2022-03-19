<template>
  <div>
    <v-img
      :src="userInfo.background"
      class="white--text align-end"
      style="position: absolute; top: 0; left: 0"
      :height="$vuetify.breakpoint.mobile ? 100 : 200"
      width="100%"
    />

    <br /><br /><br /><br /><br /><br />
    <template v-if="!$vuetify.breakpoint.mobile">
      <br /><br /><br /><br />
    </template>

    <v-row class="ma-auto">
      <v-avatar size="80">
        <v-img :src="userInfo.photoURL" class="elevation-1" />
      </v-avatar>

      <h2 style="z-index: 999" class="my-auto mx-5">
        {{ userInfo.username }}
      </h2>

      <v-btn
        v-if="currentUser.uid !== uid"
        class="ml-auto my-auto"
        outlined
        color="red"
        @click="subscribe"
        style="float: right"
      >
        {{ subscribed ? '구독 취소' : '구독하기' }}
      </v-btn>
    </v-row>

    <br />

    <v-card-actions>
      <v-chip class="ma-2" color="red" text-color="white" label>
        <v-icon left> mdi-youtube-subscription </v-icon>
        {{ subscriberNumber }}
      </v-chip>
      <v-chip class="ma-2" color="primary" text-color="white" label>
        <v-icon left> mdi-library </v-icon>
        {{ userInfo.libris }}
      </v-chip>
      <v-chip class="ma-2" color="success" text-color="white" label>
        <v-icon left> mdi-book-open </v-icon>
        {{ recent }}
      </v-chip>

      <v-spacer />

      <v-btn
        class="my-3"
        color="primary"
        to="/account"
        v-if="currentUser.isuser"
      >
        편집<v-icon right>mdi-pencil</v-icon>
      </v-btn>
    </v-card-actions>

    <br /><br />

    <v-tabs v-model="tab" grow>
      <v-tab
        :style="
          'background-color: ' + ($vuetify.theme.dark ? '#23272F' : '#f5f5f5')
        "
      >
        홈
      </v-tab>
      <v-tab
        :style="
          'background-color: ' + ($vuetify.theme.dark ? '#23272F' : '#f5f5f5')
        "
      >
        모든 글
      </v-tab>
      <v-tab
        v-if="currentUser.uid !== uid"
        :style="
          'background-color: ' + ($vuetify.theme.dark ? '#23272F' : '#f5f5f5')
        "
      >
        구독자
      </v-tab>
      <v-tab
        :style="
          'background-color: ' + ($vuetify.theme.dark ? '#23272F' : '#f5f5f5')
        "
      >
        나의 소개
      </v-tab>

      <v-tabs-items
        v-model="tab"
        class="py-3"
        :style="
          'background-color: ' + ($vuetify.theme.dark ? '#23272F' : '#f5f5f5')
        "
      >
        <v-tab-item>
          <v-card
            v-for="(item, index) in project"
            :key="item.title"
            :width="
              $vuetify.breakpoint.width < 400
                ? 150
                : $vuetify.breakpoint.xs
                ? 185
                : $vuetify.breakpoint.sm
                ? 215
                : $vuetify.breakpoint.md
                ? 215
                : 225
            "
            class="mx-auto my-3"
            elevation="20"
          >
            <v-img
              :src="item.image"
              :height="
                $vuetify.breakpoint.width < 330
                  ? 300
                  : $vuetify.breakpoint.width < 400
                  ? 220
                  : $vuetify.breakpoint.xs
                  ? 265
                  : $vuetify.breakpoint.sm
                  ? 300
                  : $vuetify.breakpoint.md
                  ? 330
                  : 345
              "
              style="margin: auto"
            />

            <v-card-title
              class="primary--text col-11 text-truncate"
              style="font-size: 1rem"
            >
              {{ item.title }}</v-card-title
            >
            <v-card-subtitle style="font-size: 0.9rem"
              >by {{ item.username }}</v-card-subtitle
            >

            <v-divider />

            <v-btn
              block
              tile
              @click="loadPost(item.uid, item.time)"
              text
              color="primary"
            >
              <v-icon left>mdi-open-in-new</v-icon> 열기
            </v-btn>
          </v-card>
        </v-tab-item>
        <v-tab-item>
          <BookCard
            :items="listev"
            :uid="uid"
            :displayName="userInfo.username"
            :simple="true"
          />
        </v-tab-item>
        <v-tab-item v-if="currentUser.uid !== uid">
          <span
            v-for="(people, index) in subscription"
            :key="Object.keys(people)[index]"
          >
            {{ people }}<br />
          </span>
        </v-tab-item>
        <v-tab-item>
          <p>{{ userInfo.bio }}</p>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js';
import * as filter from 'leo-profanity';

export default {
  data() {
    return {
      userInfo: {
        libris: '',
        username: '',
        photoURL: '',
        background: '',
        bio: '',
      },

      currentUser: {
        uid: '',
        myUsername: '',
        isuser: false,
      },

      subscription: [],
      subscribed: false,
      subscriberNumber: 0,

      recent: [],
      project: [],
      listev: [],

      tab: null,
      loading: false,
    };
  },
  methods: {
    fetchContent() {
      db.ref('/contents/').on('child_added', async (s) => {
        const data = await s.val();

        data.uid === this.uid && this.listev.unshift(data);
      });
    },
    getUserInfo() {
      db.ref(`/users/${this.uid}/`)
        .once('value')
        .then((res) => res.val())
        .then(({ libris, username, photoURL, background, bio }) => {
          this.userInfo = {
            libris,
            username,
            photoURL,
            background,
            bio,
          };
        });

      auth.onAuthStateChanged((u) => {
        if (u)
          this.currentUser = {
            uid: u.uid,
            myUsername: u.displayName,
            isuser: u.uid === this.uid,
          };
      });
    },
    getSubscribtion() {
      db.ref(`/users/${this.uid}/subscriber`)
        .once('value')
        .then((s) => {
          this.subscription = s.val() ?? [];
          this.subscriberNumber = s.numChildren();
        });
    },
    async isSubscribed() {
      this.subscription = await db
        .ref(`/users/${this.uid}/subscriber`)
        .once('value')
        .then((s) => s.val() ?? []);

      this.subscribed = Object.keys(this.subscription).includes(
        this.currentUser.uid
      );
    },
    notify() {
      db.ref(`users/${this.uid}/notification`).push({
        title: `${this.currentUser.myUsername}님이 구독했습니다!`,
        time: Date.now(),
        link: `target/${this.uid}`,
      });
    },
    subscribe() {
      if (this.subscribed) {
        db.ref(`/users/${this.currentUser.uid}/subscribe/${this.uid}`).remove();
        db.ref(
          `/users/${this.uid}/subscriber/${this.currentUser.uid}`
        ).remove();

        delete this.subscription[this.currentUser.uid];
        this.subscribed = false;

        db.ref(`/users/${this.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.uid}/libris`).set(parseInt(s.val()) - 10);
        });

        this.userInfo.libris -= 10;
      } else {
        db.ref(`/users/${this.currentUser.uid}/subscribe/${this.uid}`).set(
          this.currentUser.myUsername
        );
        db.ref(`/users/${this.uid}/subscriber/${this.currentUser.uid}`).set(
          this.currentUser.myUsername
        );

        this.subscription[this.currentUser.uid] = this.currentUser.myUsername;
        this.subscribed = true;

        db.ref(`/users/${this.uid}/libris`).once('value', (s) => {
          db.ref(`/users/${this.uid}/libris`).set(parseInt(s.val()) + 10);
        });

        this.notify();
        this.userInfo.libris += 10;
      }
    },
    postlist() {
      db.ref('/contents/').on(
        'child_added',
        async (s) => (await s.val()).uid === this.uid && this.recent++
      );
    },
    async getFePro() {
      const projectChecked = await db
        .ref(`/users/${this.uid}/projectChecked`)
        .once('value', (s) => s.val());

      db.ref(`/users/${this.uid}/project`).once(
        'value',
        async (s) =>
          await s
            .val()
            .forEach(
              (a) => projectChecked.val()[a.title] && this.project.push(a)
            )
      );
    },
  },
  async created() {
    this.loading = true;

    this.getUserInfo();

    await this.getSubscribtion();
    await this.isSubscribed();

    this.getFePro();
    this.postlist();
    this.fetchContent();
  },
  async mounted() {
    this.loading = false;
  },
  asyncData({ params }) {
    const uid = params.target;

    return { uid };
  },
};
</script>

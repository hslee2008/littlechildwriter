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
        {{ subscribed ? '취소' : '구독' }}
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
      <v-tab> 홈 </v-tab>
      <v-tab> 모든 글 </v-tab>
      <v-tab> 구독자 </v-tab>
      <v-tab> 평점 선호도 </v-tab>
      <v-tab> 나의 소개 </v-tab>

      <v-tabs-items v-model="tab" class="pa-5">
        <v-tab-item>
          <v-card
            v-for="(item, index) in project"
            :key="item.title"
            width="100%"
            class="mx-auto my-3 transparent"
          >
            <div
              :style="
                $vuetify.breakpoint.mobile ? 'display: block' : 'display: flex'
              "
            >
              <v-img
                :src="item.image"
                min-width="200"
                max-width="300"
                class="rounded-lg ma-auto"
              />

              <div class="ma-auto">
                <v-card-title class="primary--text" style="font-size: 1.5rem">
                  {{ item.title }}</v-card-title
                >
                <v-card-subtitle style="font-size: 0.9rem"
                  >by {{ item.username }}</v-card-subtitle
                >

                <v-divider />

                <v-card-text style="font-size: 1rem">
                  {{ item.description }}
                </v-card-text>

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
              </div>
            </div>
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
        <v-tab-item>
          <v-virtual-scroll
            :items="Object.keys(subscription)"
            height="300"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item">
                <v-list-item-content>
                  <v-list-item-title>
                    {{ subscription[item] }}
                  </v-list-item-title>
                </v-list-item-content>

                <v-list-item-action>
                  <v-btn icon :to="`/user/${item}`">
                    <v-icon small> mdi-open-in-new </v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>

              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-tab-item>
        <v-tab-item>
          <v-select
            v-model="rating"
            :items="[5, 4, 3, 2, 1]"
            label="평점 선택"
            outlined
          ></v-select>

          <BookCard
            :items="[five, four, three, two, one][5 - rating]"
            :uid="uid"
            :displayName="userInfo.username"
            :simple="true"
          />
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
      rating: 5,

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

      five: [],
      four: [],
      three: [],
      two: [],
      one: [],

      recent: [],
      project: [],
      listev: [],

      tab: null,
      loading: false,
    };
  },
  methods: {
    loadPost(uid, time) {
      this.$router.push(`/content/${uid}-${time}`);
    },
    fetchContentByStar() {
      db.ref('/contents/')
        .orderByChild('time')
        .on('child_added', async (s) => {
          const data = await s.val();

          data.uid === this.uid &&
            (data.rating == 5 && this.five.push(data),
            data.rating == 4 && this.four.push(data),
            data.rating == 3 && this.three.push(data),
            data.rating == 2 && this.two.push(data),
            data.rating == 1 && this.one.push(data));
        });
    },
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
        link: `user/${this.uid}`,
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
          this.userInfo.username
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

      db.ref(`/users/${this.uid}/project`).once('value', async (s) => {
        const data = await s.val();
        (data ? data : []).forEach(
          (a) => projectChecked.val()[a.title] && this.project.push(a)
        );
      });
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
    this.fetchContentByStar();
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

<template>
  <div>
    <v-chip-group active-class="primary--text" column>
      <v-chip
        v-for="tag in post.categories"
        :key="tag"
        ripple
        disabled
        outlined
        label
      >
        #{{ tag }}
      </v-chip>
    </v-chip-group>

    <v-card class="my-3">
      <v-progress-linear v-if="loading" indeterminate color="primary" />

      <v-btn tile text small to="/list" color="primary" class="rounded-lg">
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기
      </v-btn>

      <div class="cardy">
        <div class="text-center" style="margin: auto">
          <div>
            <v-btn-toggle class="my-3 rounded-lg">
              <v-btn :href="post.previewLink">
                <v-icon left>mdi-book</v-icon> 구글 정보
              </v-btn>
              <v-btn
                :href="`https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${post.isbn.replaceAll(
                  '-',
                  ''
                )}&x=2&y=12`"
              >
                <v-icon left>mdi-oil-lamp</v-icon> 알라딘
              </v-btn>
            </v-btn-toggle>

            <br />

            <ReadOnlyRating
              v-if="$vuetify.breakpoint.xs"
              :value="post.rating"
            />

            <v-tooltip bottom>
              <template v-slot:activator="{ on, attrs }">
                <a
                  v-on="on"
                  v-bind="attrs"
                  :href="`https://www.aladin.co.kr/search/wsearchresult.aspx?SearchTarget=All&SearchWord=${post.isbn.replaceAll(
                    '-',
                    ''
                  )}&x=2&y=12`"
                >
                  <v-img
                    :src="post.image"
                    width="200"
                    class="my-4 mx-auto rounded-lg"
                  />
                </a>
              </template>

              <span>알라딘 - {{ post.isbn }}</span>
            </v-tooltip>
          </div>
        </div>

        <div style="margin: auto; padding: 10px">
          <v-card-title>
            {{ post.title }}
          </v-card-title>

          <v-card-subtitle>
            by
            <NuxtLink :to="`/user/${post.uid}`">
              {{ post.username }}
            </NuxtLink></v-card-subtitle
          >

          <v-card-text>
            <ReadOnlyRating
              v-if="!$vuetify.breakpoint.xs"
              :value="post.rating"
            />

            <p class="my-5">{{ post.content }}</p>

            <v-chip-group class="my-5" column>
              <v-chip v-for="tag in tags" :key="tag.icon" label>
                <v-icon style="margin-right: 5px">mdi-{{ tag.icon }}</v-icon>
                {{ tag.val }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <div class="text-center my-10">
      <Dialog
        v-if="userInfo.isuser"
        :functionOk="del"
        buttonTitle="삭제"
        title="진짜로 삭제하겠습니까?"
        text="삭제하면 복구할 수 없습니다"
        icon="delete"
      />
      <v-btn
        v-if="userInfo.isuser"
        :to="`/edit/${this.uid}-${this.time}`"
        class="ml-3"
        color="blue lighten-2"
        ><v-icon left>mdi-pencil</v-icon>편집</v-btn
      >

      <br v-if="userInfo.isuser" />

      <v-btn class="mt-5" text @click="likeThis()" disabled>
        <v-icon left> mdi-thumb-up </v-icon>{{ post.likes }}
      </v-btn>
      <v-btn text @click="sharePost" class="mt-5">
        <v-icon left>mdi-share-variant</v-icon> 공유
      </v-btn>
      <v-btn text @click="download" class="mt-5">
        <v-icon left>mdi-download</v-icon> 다운로드
      </v-btn>
    </div>

    <CommentSection
      :databaseReference="`contents/${this.time}/comments`"
      :id="`/contents/${this.uid}-${this.time}`"
    />

    <br /><br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js';
import { saveAs } from 'file-saver';

export default {
  data() {
    return {
      comment: '',
      comments: [],

      userInfo: {},
      tags: {},

      post: {
        isbn: '',
        liked: {},
      },

      loading: true,
    };
  },
  methods: {
    download() {
      const mainContent = `
        ${this.post.username}의 글 [${new Date(this.time).toLocaleString()}]

        ${this.post.title}

        ${this.post.content}



        URL: ${window.location.href}
      `.replaceAll('        ', '');

      saveAs(
        new Blob([mainContent], {
          type: 'text/plain;charset=utf-8',
        }),
        this.post.username + '의 글.txt'
      );
    },
    likeThis() {
      this.post.likes++;
      if (!this.post.liked)
        this.post.liked = {
          [this.uid]: false,
        };
      else this.post.liked[this.uid] = true;

      db.ref(`/contents/${this.time}/likes`).set(this.post.likes);
      db.ref(`contents/${this.time}/liked/${this.uid}`).set(true);

      this.notify(this.uid, this.time);

      this.updateLibris(this.userInfo.uid);
      this.updateLibris(this.uid);
    },
    sharePost() {
      if (navigator.canShare)
        navigator.share({
          title: `Little 작가 (${this.post.title} by ${this.post.username})`,
          url: window.location.href,
        });
    },
    async updateLibris(useruid) {
      db.ref(`users/${useruid}/libris`)
        .once('value')
        .then((s) =>
          db.ref(`users/${useruid}/libris`).set(parseInt(s.val()) + 0.1)
        );
    },
    async notify() {
      await db.ref(`users/${this.uid}/notification`).push({
        title: `${this.userInfo.username}님이 댓글를 작성했습니다.`,
        time: Date.now(),
        link: `/content/${this.uid}-${this.time}`,
      });
    },
    async del() {
      await db.ref(`contents/${this.time}`).remove();

      this.$router.push('/list');
    },
    async getQueryChips() {
      const [views, pageCount] = await db
        .ref(`/contents/${this.time}/`)
        .once('value')
        .then((res) => res.val())
        .then((s) => [Math.round(s.views), s.pageCount]);

      this.tags = {
        views: {
          icon: 'eye',
          val: views + 1,
        },
        time: {
          icon: 'calendar-clock',
          val: new Date(parseInt(this.time)).toLocaleDateString(),
        },
        page: {
          icon: 'book-open-page-variant',
          val: pageCount,
        },
      };
    },
    async getUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user)
          this.userInfo = {
            uid: user.uid,
            username: user.displayName,
            isuser: this.uid === user.uid,
            photo: user.photoURL,
          };
      });
    },
    async getPost() {
      this.post = await db
        .ref(`contents/${this.time}`)
        .once('value')
        .then((s) => s.val())
        .catch((err) => {
          alert('글이 존재하지 않습니다');
          this.$router.push('/list');
        });

      if (!this.post.categories)
        this.post.categories = await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
        )
          .then((res) => res.json())
          .then((res) => res.items[0].volumeInfo.categories);
    },
    async growView() {
      await db.ref(`contents/${this.time}/views`).set(this.tags.views.val);

      this.updateLibris(this.uid);
      this.updateLibris(this.userInfo.uid);
    },
  },

  async created() {
    this.getUser();

    await this.getPost();
    await this.getQueryChips();

    setTimeout(() => (this.loading = false), 1000);

    this.growView();
  },

  asyncData({ params }) {
    const [uid, time] = params.content.split('-');

    return {
      uid,
      time,
    };
  },
};
</script>

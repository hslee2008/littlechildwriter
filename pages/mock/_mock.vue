<template>
  <v-row class="ma-1">
    <v-card :width="this.$vuetify.mobile ? 300 : 500" class="ma-auto">
      <div class="d-none">
        <img
          ref="isbn"
          src="/logo.avif"
          alt="isbn-nothing-to-be-shown"
          class="d-none"
        />

        <v-file-input
          ref="file"
          type="file"
          accept="image/*"
          @change="uploadImageFile($event)"
          label="책 사진"
          color="grey"
          outlined
          dense
          prepend-icon="mdi-upload"
        />
      </div>

      <v-card-text>
        <v-row class="my-5">
          <v-rating
            v-model="post.rating"
            color="blue"
            required
            size="30"
            class="mx-auto"
          />
        </v-row>

        <v-form>
          <v-text-field
            label="제목"
            v-model="post.title"
            :hint="post.subtitle"
          />

          <v-row style="margin-left: 0.5px; margin-right: 0.5px; gap: 10px">
            <v-text-field label="작가" v-model="post.author" />
            <v-text-field label="페이지" v-model="post.pageCount" />
          </v-row>

          <div class="text--primary">
            <v-textarea
              label="책 소개"
              hint="아직 책을 읽지 않은 사람들에게 책을 요약하세요!"
              v-model="post.content"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions style="gap: 5px">
        <v-btn color="primary" @click="update" elevation="0">
          업데이트<v-icon right>mdi-note-plus</v-icon>
        </v-btn>

        <Dialog
          :functionOk="() => this.$router.push('/list')"
          buttonTitle="취소"
          title="진짜로 취소하겠습니까?"
          text="취소하면 복구할 수 없습니다"
          icon="arrow-left"
        />

        <div style="margin: auto">
          {{ new Date().toLocaleDateString() }}
        </div>
      </v-card-actions>

      <v-alert dense outlined type="error" v-if="error" style="margin: 10px">{{
        error
      }}</v-alert>
    </v-card>

    <div style="margin: auto">
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

      <v-img :src="post.image" v-if="post.image" class="rounded-lg" />
    </div>
  </v-row>
</template>

<script>
import { db, auth } from '../../plugins/firebase.js';

export default {
  data() {
    return {
      post: {
        title: '',
        content: '',
        image: '',
        time: '',
        rating: 0,
        username: '',
        previewLink: '',
        pageCount: 0,
        isbn: '',
      },

      error: '',
      username: '',
    };
  },
  methods: {
    async update() {
      try {
        db.ref(`/contents/${this.time}`).update({
          title: this.post.title,
          content: this.post.content,
          rating: this.post.rating,
          isbn: this.post.isbn,
          time: parseInt(this.time),
          image: this.post.image,
          previewLink: this.post.previewLink,
          pageCount: this.post.pageCount,
          username: this.post.username,
        });

        this.$router.push('/list');
      } catch (err) {
        this.error = err.message;
      }
    },
    async getPost() {
      this.post = (await db.ref(`/contents/${this.time}`).once('value')).val();
    },
  },

  async created() {
    auth.onAuthStateChanged((user) => {
      if (user) {
        if (user.uid === this.uid) this.getPost();
        else alert('본인의 글만 수정할 수 있습니다.');
      }
    });
  },

  asyncData({ params }) {
    const [uid, time] = params.mock.split('-');

    return {
      uid,
      time,
    };
  },
};
</script>

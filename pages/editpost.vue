<template>
  <div>
    <br /><br />

    <v-row>
      <v-card class="mx-auto" width="60%">
        <v-btn to="/list" elevation="0" text>
          <v-icon>mdi-arrow-left</v-icon>뒤로가기</v-btn
        >
        <v-card-text>
          <v-row style="margin: 2px">
            <div style="margin: auto">
              {{ new Date().toLocaleDateString() }}
            </div>
            <v-rating
              v-model="post.rating"
              background-color="blue lighten-3"
              color="blue"
              dense
              size="20"
              style="margin: auto"
            ></v-rating
          ></v-row>
          <v-text-field label="제목" v-model="post.title"></v-text-field>
          <v-text-field
            disabled
            label="글쓴이"
            v-model="post.username"
          ></v-text-field>
          <div class="text--primary">
            <v-textarea
              label="책 요약"
              hint="책에 대한 내용을 넣으세요!"
              v-model="post.content"
            ></v-textarea>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="teal accent-7" @click="okay" elevation="0">
            업데이트<v-icon right>mdi-note-plus</v-icon>
          </v-btn>
          <v-btn
            text
            color="teal accent-4"
            :href="post.previewLink"
            target="_blank"
            v-if="post.previewLink"
          >
            구글 책 링크
          </v-btn>
        </v-card-actions>

        <v-alert
          dense
          outlined
          type="error"
          v-if="error"
          style="margin: 10px"
          >{{ error }}</v-alert
        >
      </v-card>
      <div style="margin: auto" class="my-5">
        <v-img :src="post.image" />
      </div>
    </v-row>

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'

export default {
  data() {
    return {
      comment: '',
      username: '',
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
      isuser: false,
      error: '',
    }
  },
  methods: {
    async okay() {
      try {
        db.ref(`/contents/${this.$route.query.time}`).update({
          title: this.post.title,
          content: this.post.content,
          rating: this.post.rating,
          isbn: this.post.isbn,
          time: parseInt(this.$route.query.time),
          image: this.post.image,
          previewLink: this.post.previewLink,
          pageCount: this.post.pageCount,
          username: this.post.username,
        })

        this.$router.push('/list')
      } catch (err) {
        this.error = err.message
      }
    },
  },
  async mounted() {
    this.post = (
      await db.ref(`/contents/${this.$route.query.time}`).once('value')
    ).val()
  },
}
</script>

<template>
  <div>
    <v-card class="transparent">
      <v-rating
        v-model="post.rating"
        color="blue"
        required
        size="30"
        class="my-5"
      />

      <v-text-field v-model="post.title" label="제목" />
      <v-text-field v-model="post.pageCount" label="페이지" />
      <v-textarea v-model="post.content" label="책 소개" />

      <v-card-actions>
        <DialogComponent
          :cb="() => $router.push(`/content/${post.time}`)"
          btn-title="취소"
          title="진짜로 취소하겠습니까?"
          text="취소하면 복구할 수 없습니다"
          icon="arrow-left"
        />

        <v-spacer />

        <v-btn outlined color="primary" class="elevation-0" @click="update">
          업데이트
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { auth, db } from '@/plugins/firebase'

export default {
  asyncData({ params }) {
    const time = params.edit
    return {
      time
    }
  },
  data() {
    return {
      post: {
        title: '',
        content: '',
        image: '',
        time: '',
        rating: 0,
        displayName: '',
        pageCount: 0,
        isbn: '',
        uid: ''
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(u => u && this.getPost())
  },
  methods: {
    update() {
      const {
        title,
        content,
        image,
        time,
        rating,
        displayName,
        pageCount,
        isbn
      } = this.post

      db.ref(`/contents/${this.time}`).update({
        title,
        content,
        rating,
        isbn,
        image,
        pageCount,
        displayName,
        time: parseInt(time)
      })

      this.$router.push(`/content/${time}`)
    },
    async getPost() {
      this.post = (await db.ref(`/contents/${this.time}`).once('value')).val()
    }
  }
}
</script>

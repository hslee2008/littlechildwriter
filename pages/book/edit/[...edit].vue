<template>
  <v-card>
    <v-card-text>
      <v-rating
        v-model="post.rating"
        half-increments
        color="blue"
        size="30"
        class="my-10"
      />

      <v-text-field v-model="post.title" variant="outlined" label="제목" />
      <v-text-field
        v-model="post.pageCount"
        variant="outlined"
        label="페이지"
      />
      <v-textarea
        v-model="post.content"
        variant="outlined"
        label="책 소개"
        auto-grow
        counter
      />
    </v-card-text>

    <v-card-actions>
      <v-btn
        rounded="lg"
        variant="tonal"
        color="primary"
        @click="() => navigateTo(`/book/content/${post.time}`)"
      >
        취소
      </v-btn>

      <v-spacer />

      <v-btn rounded="lg" variant="tonal" color="primary" @click="Update">
        업데이트
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const route = useRoute()
const time = route.params.edit
const post = ref<any>({
  isbn: '',
  title: '',
  image: '',
  pageCount: '',
  categories: [] as string[],
  rating: 5,
  content: '',
  uid: '',
  displayName: '',
  views: 0,
  time: Date.now()
})

const Post = async () =>
  (post.value = (await $db.ref(`/contents/${time}`).once('value')).val())

useAuth(Post)

const Update = () => {
  const { title, content, image, time, rating, pageCount, isbn } = post.value

  $db.ref(`/contents/${time}`).update({
    title,
    content,
    rating,
    isbn,
    image,
    pageCount
  })

  navigateTo(`/book/content/${time}`)
}

useHead({
  title: '편집 - LCW'
})
</script>

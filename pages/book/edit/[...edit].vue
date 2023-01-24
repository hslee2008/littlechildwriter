<template>
  <v-card :color="themeColor()">
    <v-card-text>
      <v-rating
        :model-value="post.rating"
        half-increments
        color="blue"
        size="30"
        class="my-10"
      />

      <v-text-field variant="outlined" :model-value="post.title" label="제목" />
      <v-text-field
        variant="outlined"
        :model-value="post.pageCount"
        label="페이지"
      />
      <v-textarea
        :model-value="post.content"
        label="책 소개"
        auto-grow
        counter
      />
    </v-card-text>

    <v-card-actions>
      <LazyDialogComponent
        :cb="() => $navigateTo(`/book/content/${post.time}`)"
        btn-title="취소"
        title="진짜로 취소하겠습니까?"
        text="취소하면 복구할 수 없습니다"
        icon="arrow-left"
      />

      <v-spacer />

      <v-btn
        rounded="lg"
        variant="tonal"
        color="primary"
        class="elevation-0 update"
        @click="Update"
      >
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
  time: Date.now(),
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
    pageCount,
  })

  navigateTo(`/book/content/${time}`)
}

useHead({
  title: '편집 - LCW',
})
</script>

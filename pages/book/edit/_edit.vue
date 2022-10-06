<template>
  <v-card class="transparent">
    <v-card-text>
      <v-rating
        v-model="post.rating"
        half-increments
        color="blue"
        size="30"
        class="my-10"
      />

      <v-text-field v-model="post.title" label="제목" class="title" />
      <v-text-field v-model="post.pageCount" label="페이지" />
      <v-textarea v-model="post.content" label="책 소개" auto-grow counter />
    </v-card-text>

    <v-card-actions>
      <LazyDialogComponent
        :cb="() => $router.push(`/book/content/${post.time}`)"
        btn-title="취소"
        title="진짜로 취소하겠습니까?"
        text="취소하면 복구할 수 없습니다"
        icon="arrow-left"
      />

      <v-spacer />

      <v-btn
        outlined
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
import { auth, db } from '@/plugins/firebase'

const route = useRoute()
const router = useRouter()
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

onMounted(() => auth.onAuthStateChanged(u => u && Post()))

const Post = async () =>
  (post.value = (await db.ref(`/contents/${time}`).once('value')).val())

const Update = () => {
  const { title, content, image, time, rating, pageCount, isbn } = post.value

  db.ref(`/contents/${time}`).update({
    title,
    content,
    rating,
    isbn,
    image,
    pageCount
  })

  router.push(`/book/content/${time}`)
}

useHead({
  title: '편집 - LCW'
})
</script>

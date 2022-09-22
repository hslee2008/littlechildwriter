<template>
  <v-tabs v-model="tab" show-arrows center-active grow class="transparent">
    <v-tab> 홈 </v-tab>
    <v-tab> 글 쓰기 </v-tab>
    <v-tab v-if="classInfo.uid === userInfo.uid"> 설정 </v-tab>

    <v-tabs-items v-model="tab" class="py-5 transparent">
      <v-tab-item class="pt-10">
        <v-parallax height="200" class="rounded-lg" :src="classInfo.image">
          <p class="my-5" v-text="classInfo.description" />
          <h1 class="primary--text">
            {{ classInfo.name }} ({{ classInfo.creator }})
          </h1>
        </v-parallax>

        <br />

        <PostComponent />
      </v-tab-item>

      <v-tab-item class="pt-10">
        <v-select
          v-model="post.type"
          :items="['책', '공지사항', '파일', '파일 (숙제로)', '링크', '숙제']"
          label="종류 선택"
          outlined
          class="mb-10"
        />

        <v-row style="gap: 10px" class="ma-10">
          <v-text-field
            v-if="classInfo.uid === userInfo.uid"
            v-model="post.category"
            label="수업 이름"
            outlined
          />
          <v-select
            v-model="post.category"
            :items="Object.keys(classInfo.contents || {})"
            label="종류 선택"
            outlined
          />
        </v-row>

        <v-card v-if="post.type === '책'">
          <v-card-title>책 링크 업로드</v-card-title>
          <v-card-text>
            <v-text-field v-model="post.title" label="제목" />

            <div v-if="post.time">
              <h2>선택됨</h2>
              <br />
              <v-img :src="post.image" max-width="200" class="rounded-lg" />
            </div>
          </v-card-text>

          <v-card-actions class="ma-2 gap20">
            <v-dialog v-model="dialog" width="700">
              <template #activator="{ on, attrs }">
                <div class="text-center">
                  <v-btn color="primary" v-bind="attrs" v-on="on">
                    <v-icon left>mdi-bookshelf</v-icon> 책 선택
                  </v-btn>
                </div>
              </template>

              <v-card>
                <v-row no-gutters>
                  <v-card
                    v-for="i in listev.filter(i => i.uid == userInfo.uid)"
                    :key="i.title"
                    class="elevation-0"
                    @click="
                      post.time = i.time
                      post.image = i.image
                      dialog = false
                    "
                  >
                    <v-img
                      :src="i.image"
                      class="rounded-lg ma-3"
                      max-width="100"
                    />
                  </v-card>
                </v-row>
              </v-card>
            </v-dialog>

            <v-spacer />

            <v-btn
              :disabled="post.title === ''"
              color="primary"
              class="elevation-0"
              @click="Post"
            >
              게시
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="post.type === '링크'" class="transparent">
          <v-card-title>링크 업로드</v-card-title>
          <v-card-text>
            <v-text-field v-model="post.title" label="제목" />
            <v-text-field v-model="post.link" label="링크" />
          </v-card-text>
          <v-card-actions class="ma-2 gap20">
            <v-btn
              :disabled="post.title === ''"
              color="primary"
              class="elevation-0"
              @click="Post"
            >
              게시
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card
          v-else-if="post.type === '파일' || post.type === '파일 (숙제로)'"
          class="transparent"
        >
          <v-progress-linear
            v-if="progress > 0"
            color="primary"
            class="mb-5"
            :value="progress"
          />

          <v-file-input
            ref="file"
            v-model="post.file"
            color="deep-purple accent-4"
            counter
            label="File input"
            multiple
            placeholder="Select your files"
            prepend-icon="mdi-paperclip"
            outlined
            :show-size="1000"
            @change="UploadFile"
          >
            <template #selection="{ index, text }">
              <v-chip
                v-if="index < 2"
                color="deep-purple accent-4"
                dark
                label
                small
              >
                {{ text }}
              </v-chip>
            </template>
          </v-file-input>
          <v-btn color="primary" @click="Upload">
            <v-icon left>mdi-file-upload</v-icon>
            파일 게시
          </v-btn>
        </v-card>
        <v-card v-else-if="post.type === '숙제'" class="transparent">
          <v-card-title>숙제 업로드</v-card-title>
          <v-card-text>
            <v-text-field v-model="post.title" label="제목" />
            <v-text-field v-model="post.content" label="내용" />
            숙제는 선생님과 올린 사람만 확인할 수 있습니다.
          </v-card-text>
          <v-card-actions class="ma-2 gap20">
            <v-btn
              :disabled="post.title === ''"
              color="primary"
              class="elevation-0"
              @click="Post"
            >
              게시
            </v-btn>
          </v-card-actions>
        </v-card>
        <LazyCommentComponent
          v-else
          :link="`/class/${id}`"
          :dbr="`classes/${id}/contents/${post.category}`"
          :nocomments="true"
          :cb="() => (tab = 0)"
          :uid="userInfo.uid"
        />
      </v-tab-item>

      <v-tab-item v-if="classInfo.uid === userInfo.uid" class="pt-10">
        <v-card class="mt-5">
          <v-card-title>수업 세부정보</v-card-title>
          <v-card-text>
            <v-text-field v-model="classInfo.name" label="수업 이름" required />
            <v-textarea
              v-model="classInfo.description"
              label="수업 설명"
              required
            />
            <v-checkbox
              v-model="classInfo.public"
              label="수업 전체 공개 여부"
              required
            />
            <v-btn
              color="primary"
              class="mt-5"
              :disabled="!classInfo.name || !classInfo.description"
              @click="Update"
            >
              수업 정보 수정
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>삭제</v-card-title>
          <v-card-text>
            <LazyDialogComponent
              :cb="DeleteClass"
              btn-title="삭제"
              title="진짜로 삭제하겠습니까?"
              text="삭제하면 복구할 수 없습니다"
              icon="trash-can"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script setup lang="ts">
import PostComponent from './PostComponent.vue'
import { db, storage } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const route = useRoute()
const router = useRouter()
const id = route.params.class
const classInfo = ref<any>({})
const listev = ref<any[]>([])
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
  author: '',
  views: 0,
  time: Date.now(),
  isPublic: true,
  file: [] as File[],
  type: '책',
  category: '기타',
  book: true,
  link: ''
})
const dialog = ref<boolean>(false)
const tab = ref<number>(0)
const progress = ref<number>(0)

onBeforeMount(() => {
  db.ref(`/classes/${id}`).on(
    'value',
    async s => (classInfo.value = await s.val())
  )

  db.ref('/contents/').on('child_added', s => {
    const { title, time, uid, displayName, image } = s.val()

    listev.value.unshift({
      title,
      time,
      uid,
      displayName,
      image
    })
  })
})

const Upload = () => {
  let storageRef: any

  for (let i = 0; i < post.value.file.length; i++) {
    storageRef = storage
      .ref(`${post.value.file[i].name}`)
      .put(post.value.file[i])
  }

  storageRef.on(
    'state_changed',
    (s: any) => (progress.value = (s.bytesTransferred / s.totalBytes) * 100),
    (e: Error) => Error(e.message),
    () =>
      storageRef.snapshot.ref
        .getDownloadURL()
        .then((url: any) => {
          const { type, file, category } = post.value
          const { uid, displayName } = userInfo.value

          db.ref(`classes/${id}/contents/${category}`).push({
            type,
            uid,
            displayName,
            url,
            file: file[0].name
          })
        })
        .then(() => {
          tab.value = 0
          post.value.title = ''
          post.value.time = 0
          post.value.file = []
          post.value.book = true
          post.value.type = '책'
          progress.value = 0
        })
  )
}

const Update = () => {
  db.ref(`/classes/${id}`).update(classInfo)
  tab.value = 0
}

const UploadFile = (f: File[]) => {
  post.value.file = f
}

const Post = () => {
  const { title, time, category, type, link } = post.value
  const { uid, displayName } = userInfo.value

  if (type === '숙제') {
    db.ref(`classes/${id}/contents/${category}/${category}`).set({
      title,
      time,
      uid,
      displayName,
      type,
      link
    })
  } else {
    db.ref(`/classes/${id}/contents/${category}`).push({
      title,
      uid,
      time,
      displayName,
      type,
      link
    })
  }

  post.value = {
    isbn: '',
    title: '',
    image: '',
    pageCount: '',
    categories: [] as string[],
    rating: 5,
    content: '',
    uid: '',
    displayName: '',
    author: '',
    views: 0,
    time: Date.now(),
    isPublic: true,
    file: [] as File[],
    type: '포스트',
    category: '기타',
    book: true,
    link: ''
  }
  tab.value = 0
}

const DeleteClass = () => {
  db.ref('classes').child(id).remove()
  router.push('/classes')
}
</script>

<style scoped>
.gap20 {
  gap: 20px;
}
</style>

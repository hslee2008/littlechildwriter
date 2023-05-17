<template>
  <div class="pt-5">
    <v-row style="gap: 5px" class="ma-3">
      <v-select
        v-model="post.type"
        variant="outlined"
        :items="['공지사항', '파일', '링크', '글 제출 (학생)']"
        label="종류 선택"
        outlined
        class="mb-10"
      />

      <div>
        <v-combobox
          v-if="userInfo.is(classInfo.uid)"
          v-model="post.category"
            :items="Keys(classInfo.contents ?? {})"
            label="Search"
            outlined
            hide-selected
            clearable
            prepend-inner-icon="mdi-magnify"
          />
          <v-select
            v-else
            v-model="post.category"
            variant="outlined"
            :items="Keys(classInfo.contents ?? {})"
          label="종류 선택"
          outlined
        />
      </div>
    </v-row>

    <v-card v-if="post.type === '링크'">
      <v-card-title>링크 업로드</v-card-title>
      <v-card-text>
        <v-text-field v-model="post.title" variant="outlined" label="제목" />
        <v-text-field v-model="post.content" variant="outlined" label="링크" />
      </v-card-text>
      <v-card-actions class="ma-2 gap20">
        <v-btn
          rounded="lg"
          variant="tonal"
          :disabled="post.title === ''"
          color="primary"
          @click="Post"
        >
          게시
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else-if="post.type.startsWith('파일')">
      <v-radio-group v-model="post.type">
        <v-radio key="숙제" label="파일 (숙제로)" value="파일 (숙제로)" />
        <v-radio key="파일" label="파일" value="파일" />
        <v-radio key="사진" label="사진" value="파일 사진" />
        <v-radio key="비디오" label="비디오" value="파일 비디오" />
      </v-radio-group>

      <v-overlay v-model="progress">
        <v-progress-circular indeterminate size="64" />
      </v-overlay>

      <v-file-input
        ref="file"
        v-model="post.file"
        color="deep-purple accent-4"
        counter
        label="File input"
        multiple
        variant="underlined"
        placeholder="Select your files"
        prepend-icon="mdi-paperclip"
        outlined
        :show-size="1000"
        @update:model-value="UploadFile($event)"
      >
        <template #selection="{ index }">
          <v-chip
            v-if="index < 2"
            color="deep-purple accent-4"
            label
            size="small"
          >
            {{}}
          </v-chip>
        </template>
      </v-file-input>

      <v-btn rounded="lg" variant="tonal" @click="Upload"> 파일 게시 </v-btn>
    </v-card>
    <v-card v-else-if="post.type === '글 제출 (학생)'">
      <v-card-title>숙제 업로드</v-card-title>
      <v-card-text>
        <v-text-field v-model="post.title" variant="outlined" label="제목" />
        <v-textarea v-model="post.content" variant="outlined" label="내용" />
      </v-card-text>
      <v-card-actions class="ma-2 gap20">
        <v-btn
          rounded="lg"
          variant="tonal"
          :disabled="post.title === ''"
          color="primary"
          @click="Post"
        >
          게시
        </v-btn>
      </v-card-actions>
    </v-card>
    <CommentComponent
      v-else-if="post.type === '공지사항'"
      :link="`/class/${id}`"
      :dbr="`classes/${id}/contents/${post.category}`"
      :nocomments="true"
      :cb="() => updateTab(0)"
      :uid="userInfo.uid"
    />
  </div>
</template>

<script setup lang="ts">
const { $db, $storage } = useNuxtApp()

const userInfo = User()
const route = useRoute()
const id = route.params.class
const classInfo = ref<any>({})
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
  file: [] as File[],
  type: '공지사항',
  category: '기타',
  book: true,
  link: ''
})
const progress = ref<boolean>(false)

const props = defineProps({
  updateTab: {
    type: Function,
    required: true
  }
})

onBeforeMount(() => {
  $db
    .ref(`/classes/${id}`)
    .on('value', async (s: any) => (classInfo.value = await s.val()))
})

const Upload = () => {
  let storageRef: any

  for (let i = 0; i < post.value.file.length; i++) {
    storageRef = $storage
      .ref(`${post.value.file[i].name}`)
      .put(post.value.file[i])
  }

  storageRef.on(
    'state_changed',
    (s: any) => (progress.value = s.bytesTransferred >= s.totalBytes),
    (e: Error) => Error(e.message),
    () =>
      storageRef.snapshot.ref
        .getDownloadURL()
        .then((url: any) => {
          const { type, file, category } = post.value
          const { uid, displayName } = userInfo

          $db.ref(`classes/${id}/contents/${category}`).push({
            type,
            uid,
            displayName,
            url,
            file: file[0].name
          })
        })
        .then(() => {
          props.updateTab(0)
          post.value.title = ''
          post.value.time = 0
          post.value.file = []
          post.value.book = true
          post.value.type = '공지사항'
          progress.value = false
        })
  )
}

const UploadFile = (f: File[]) => (post.value.file = f)

const Post = () => {
  const { title, time, category, type, content } = post.value
  const { uid, displayName } = userInfo

  if (type === '글 제출 (학생)') {
    $db.ref(`classes/${id}/contents/${category}/${time}`).set({
      title,
      time,
      uid,
      displayName,
      type,
      content
    })
  } else {
    $db.ref(`/classes/${id}/contents/${category}`).push({
      title,
      uid,
      time,
      displayName,
      type,
      content
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
    file: [] as File[],
    type: '포스트',
    category: '기타',
    book: true,
    link: ''
  }
  props.updateTab(0)

  Notify(
    post.value.uid,
    userInfo.photoURL,
    `${userInfo.displayName}님이 새로운 자료를 올렸습니다`,
    `/class/${id}`
  )
}
</script>

<style scoped>
.gap20 {
  gap: 20px;
}
</style>

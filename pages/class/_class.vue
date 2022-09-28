<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-tabs v-model="tab" show-arrows center-active grow class="transparent">
    <v-tab> 홈 </v-tab>
    <v-tab> 글 쓰기 </v-tab>
    <v-tab v-if="classInfo.uid === userInfo.uid"> 설정 </v-tab>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item class="pt-10">
        <h1 class="primary--text">
          {{ classInfo.name }} ({{ classInfo.creator }})
        </h1>
        <p class="my-5" v-text="classInfo.description" />

        <br />

        <v-combobox
          v-model="search"
          :items="Object.keys(classInfo.contents || {})"
          label="Search"
          outlined
          hide-selected
          clearable
          prepend-inner-icon="mdi-magnify"
          class="my-2 mr-2"
        />

        <v-expansion-panels focusable>
          <v-expansion-panel
            v-for="(category, title) in classInfo.contents"
            v-if="title.toString().includes(search)"
            :key="title"
          >
            <v-expansion-panel-header>
              {{ title.toString().replaceAll('_', ' - ') }}
            </v-expansion-panel-header>

            <v-expansion-panel-content
              v-for="(item, i) in category"
              :key="item.title"
            >
              <v-card
                v-if="item.type === '책'"
                class="d-flex mt-5"
                :to="`/book/content/${item.time}`"
              >
                <v-icon color="orange" class="ml-4" size="40">
                  mdi-book
                </v-icon>
                <div>
                  <v-card-title>{{ item.displayName }}</v-card-title>
                  <v-card-subtitle>{{ item.title }}</v-card-subtitle>
                  <v-card-text>
                    {{ new Date(item.time).toLocaleDateString() }}
                  </v-card-text>
                </div>

                <v-spacer />

                <v-card-actions>
                  <v-menu v-if="userInfo.uid === item.uid" offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        cols="1"
                        v-on="on"
                        @click.stop.prevent=""
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="DeleteContent(title, i)">
                        <v-list-item-title>
                          <v-icon left> mdi-trash-can </v-icon> 삭제
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
              <v-card
                v-else-if="item.type === '파일'"
                :href="item.url"
                class="d-flex mt-5"
              >
                <v-icon class="ml-4"> mdi-link-variant </v-icon>

                <div>
                  <v-card-title>{{ item.file }}</v-card-title>
                  <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
                </div>

                <v-spacer />

                <v-card-actions>
                  <v-menu v-if="userInfo.uid === item.uid" offset-y>
                    <template #activator="{ on, attrs }">
                      <v-btn
                        icon
                        v-bind="attrs"
                        cols="1"
                        v-on="on"
                        @click.stop.prevent=""
                      >
                        <v-icon>mdi-dots-vertical</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item @click="DeleteContent(title, i)">
                        <v-list-item-title>
                          <v-icon left> mdi-trash-can </v-icon> 삭제
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-card-actions>
              </v-card>
              <div v-else-if="item.type === '파일 (숙제로)'">
                <v-card
                  v-if="
                    userInfo.uid === item.uid || userInfo.uid === classInfo.uid
                  "
                  :href="item.url"
                  class="d-flex rounded-0"
                >
                  <v-icon class="ml-4"> mdi-link-variant </v-icon>

                  <div>
                    <v-card-title>{{ item.file }}</v-card-title>
                    <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
                  </div>

                  <v-spacer />

                  <v-card-actions>
                    <v-menu v-if="userInfo.uid === item.uid" offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          cols="1"
                          v-on="on"
                          @click.stop.prevent=""
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="DeleteContent(title, i)">
                          <v-list-item-title>
                            <v-icon left> mdi-trash-can </v-icon> 삭제
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-actions>
                </v-card>
                <v-card v-else>
                  <v-card-text>{{ item.displayName }}님이 제출함</v-card-text>
                </v-card>
              </div>
              <v-card v-else-if="item.type === '링크'" class="d-flex mt-5">
                <v-icon class="ml-4"> mdi-link </v-icon>

                <div>
                  <v-card-title>{{ item.name }} 링크</v-card-title>
                  <v-card-subtitle>
                    <a :href="item.link" target="_blank" v-text="item.title" />
                  </v-card-subtitle>
                </div>
              </v-card>
              <div v-else-if="item.type === '숙제'">
                <v-card
                  class="d-flex mt-5 rounded-b-0"
                  @click="
                    () => {
                      tab = 1
                      post.type = '파일 (숙제로)'
                      post.category = item.title
                    }
                  "
                >
                  <v-icon class="ml-4"> mdi-school </v-icon>

                  <div>
                    <v-card-title>{{ item.title }} 숙제</v-card-title>
                  </div>
                </v-card>
                <v-divider />
              </div>
              <v-card v-else class="mt-5">
                <div class="d-flex">
                  <v-avatar size="40" class="ml-3 mt-6">
                    <v-img :src="item.photoURL" class="rounded-lg" />
                  </v-avatar>
                  <div>
                    <v-card-title>
                      {{ item.displayName }}의 공지사항
                    </v-card-title>
                    <v-card-subtitle>
                      {{ new Date(item.time).toLocaleDateString() }}
                    </v-card-subtitle>
                  </div>
                  <v-spacer />
                  <v-card-actions>
                    <v-menu v-if="userInfo.uid === item.uid" offset-y>
                      <template #activator="{ on, attrs }">
                        <v-btn
                          icon
                          v-bind="attrs"
                          cols="1"
                          v-on="on"
                          @click.stop.prevent=""
                        >
                          <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="DeleteContent(title, i)">
                          <v-list-item-title>
                            <v-icon left> mdi-trash-can </v-icon> 삭제
                          </v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-actions>
                </div>
                <v-card-text>{{ item.content }}</v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
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

          <v-btn text @click="Upload"> 파일 게시 </v-btn>
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
const search = ref<string>('')

onBeforeMount(() => {
  db.ref(`/classes/${id}`).on(
    'value',
    async s => (classInfo.value = await s.val())
  )

  db.ref('/contents/').on('child_added', s => {
    const { title, time, uid, displayName, image } = s.val()

    listev.value.push({
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

const UploadFile = (f: File[]) => (post.value.file = f)

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

const DeleteContent = (title: number, i: number) =>
  db.ref(`/classes/${id}/contents/${title}/${i}`).remove()
</script>

<style scoped>
.gap20 {
  gap: 20px;
}
</style>

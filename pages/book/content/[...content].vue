<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <iframe
      v-if="iframe"
      frameborder="0"
      scrolling="no"
      class="zmax frame"
      :src="`https://books.google.co.kr/books?id=${otherInfo.id}&lpg=PP1&pg=PP1&output=embed`"
      width="100%"
      height="100%"
    />
    <v-btn
      v-if="iframe"
      rounded="lg"
      color="primary"
      class="zmax fab"
      @click="iframe = false"
    >
      닫기
    </v-btn>

    <v-card class="my-3">
      <div class="cardy">
        <BookImage :post="post" :other-info="otherInfo" />
        <BookContent :post="post" :other-info="otherInfo" />
      </div>
    </v-card>

    <div class="text-center my-10">
      <div v-if="userInfo.uid === post.uid">
        <v-btn
          rounded="lg"
          variant="tonal"
          fab
          icon="mdi-pencil"
          size="small"
          color="green"
          :to="`/book/edit/${time}`"
          class="ma-2"
        />
        <v-btn
          rounded="lg"
          variant="tonal"
          fab
          icon="mdi-delete"
          size="small"
          color="red"
          class="ma-2"
          @click="Del"
        />
      </div>

      <v-chip
        v-if="userInfo.loggedIn"
        label
        :style="`background-color: ${
          (post?.liked ?? {})[userInfo.uid] ? '#159ECB' : 'grey'
        }`"
        class="mr-3"
        prepend-icon="mdi-thumb-up"
        @click="Like()"
      >
        <span class="subheading" v-text="post?.likes" />
      </v-chip>

      <v-btn
        rounded="lg"
        variant="tonal"
        class="mx-1"
        prepend-icon="mdi-town-hall"
      >
        학교 도서관

        <v-dialog width="700" activator="parent">
          <v-card>
            <v-card-title>학교 도서관 책 검색</v-card-title>

            <v-card-text>
              <div class="d-flex">
                <v-select
                  v-model="school.local"
                  variant="outlined"
                  :items="school.list"
                  label="지역 선택"
                  class="mr-2"
                />
                <v-text-field
                  v-model="school.name"
                  variant="outlined"
                  label="학교 이름"
                  class="mx-2"
                />
                <v-btn
                  ref="search"
                  rounded="lg"
                  variant="plain"
                  icon="mdi-magnify"
                  class="mt-1"
                  @click="schoolBookSearch"
                />
              </div>
              <v-text-field
                v-model="post.title"
                variant="outlined"
                label="책 제목"
              />
            </v-card-text>

            <div v-if="schoolLoading" class="text-center">
              <v-progress-circular indeterminate color="primary" class="mb-5" />
            </div>
            <v-list
              v-else-if="!school.resultString?.endsWith('찾을 수 없습니다.')"
              nav
            >
              <v-list-item
                v-for="item in school.result"
                :key="item.callNumber"
                :style="`
                border: 2px dashed #${item.canRental ? '4caf50' : 'f44336'};
              `"
              >
                <v-img
                  :src="item.previewImage"
                  alt="학교 도서관"
                  max-width="100"
                  class="rounded-lg ma-2"
                >
                  <v-overlay absolute>
                    {{ item.canRental ? '대출 가능' : '대출 불가능' }}
                  </v-overlay>
                </v-img>

                <v-card>
                  <v-card-title class="text-primary">
                    {{ item.title }}
                  </v-card-title>
                  <v-card-subtitle>
                    {{ item.writer }}
                  </v-card-subtitle>

                  <v-card-text class="mt-2 text-white">
                    청구 기호: {{ item.callNumber }}<br />
                    회사: {{ item.company }}
                  </v-card-text>
                </v-card>
              </v-list-item>
            </v-list>
            <v-card-text v-else>{{ school.resultString }}</v-card-text>
          </v-card>
        </v-dialog>
      </v-btn>

      <BookMore
        :post="post"
        :other-info="otherInfo"
        :showiframe="() => (iframe = true)"
      />
    </div>

    <CommentComponent
      :link="`/book/content/${time}`"
      :dbr="`contents/${time}/comments`"
      :uid="post.uid"
    />

    <br /><br /><br /><br /><br /><br />

    <div v-if="loading" class="text-center">
      <v-progress-circular indeterminate color="primary" size="large" />
    </div>
    <template v-else>
      <h1>이런 책 어때?</h1>

      <v-row>
        <v-card
          v-for="(item, i) in suggested"
          :key="i"
          class="mx-auto my-5"
          :href="item.infoLink"
          :width="width < 1264 ? 150 : 210"
        >
          <v-img :src="item.thumbnail" class="rounded-lg" />
          <v-card-title class="text-h6">{{ item.title }}</v-card-title>
        </v-card>
      </v-row>
    </template>

    <br /><br /><br />
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { $db } = useNuxtApp()

const { width } = useDisplay()
const userInfo = User()

const route = useRoute()
const time = route.params.content

const post = ref({
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
  likes: 0,
  liked: {} as any
})
const otherInfo = ref<any>({
  volumeInfo: {
    authors: [],
    publisher: '',
    publishedDate: '',
    averageRating: 0
  }
})
const suggested = ref<any>([])
const school = ref({
  list: [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
  ] as string[],
  result: [] as any,
  resultString: '',
  local: '',
  name: '',
  title: post.value.title
})
const iframe = ref<boolean>(false)
const loading = ref<boolean>(true)
const schoolLoading = ref<boolean>(false)

const schoolBookSearch = async () => {
  schoolLoading.value = true

  localStorage.setItem(
    'school',
    JSON.stringify({
      local: school.value.local,
      name: school.value.name
    })
  )

  await fetch(
    `https://little-child-writer-school-book-search.onrender.com/?book=${school.value.title}&school=${school.value.name}&local=${school.value.local}`
  )
    .then(res => res.json())
    .then(json => {
      school.value.result = json.result
      school.value.resultString = json.result.toString()
    })

  schoolLoading.value = false
}

const Content = async () => {
  const data = await $db
    .ref(`/contents/${time}`)
    .once('value')
    .then((r: any) => r.val())

  data !== null && Keys(data).length !== 1 && (post.value = data)

  if (data.isbn)
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`
    )
      .then(res => res.json())
      .then(res => (otherInfo.value = res.items[0]))

  school.value.title = post.value.title
}

const View = () => {
  $db.ref(`contents/${time}/views`).transaction((view: any) => view + 1)

  if (userInfo.uid === post.value.uid) {
    $db.ref(`contents/${time}/views`).transaction((view: any) => view - 1)
    post.value.views--
  }
}

const HandleBookInfo = (data: any) => {
  for (let i = 0; i < data.items.length; i++) {
    const book = data.items[i]

    if (
      book.volumeInfo.imageLinks?.thumbnail &&
      book.volumeInfo.title !== post.value.title
    ) {
      const {
        imageLinks: { thumbnail },
        infoLink,
        title
      } = book.volumeInfo

      suggested.value.push({
        thumbnail,
        infoLink,
        title
      })
    }
  }
}

const Suggestion = async () => {
  loading.value = true

  if (otherInfo.value.volumeInfo?.authors.length > 0) {
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=author:${encodeURI(
        otherInfo.value.volumeInfo?.authors[0]
      )}&maxResults=${20}`
    )
      .then(res => res.json())
      .then(HandleBookInfo)
  }

  if (post.value.categories.length > 1) {
    const cat: string[] = [...post.value.categories]
    cat.forEach((tag, i) => (cat[i] = encodeURIComponent(`'${tag}'`)))

    let done = false
    let n = 5
    let overflow = 0

    while (!done) {
      overflow++

      if (overflow > 5) {
        done = true
        break
      }

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=subject:${cat.join(
          ','
        )}&maxResults=${n}`
      )
        .then(res => res.json())
        .then(data => {
          const length = data.items.length

          if (length >= n) done = true
          else {
            cat.shift()
            n -= length
          }

          HandleBookInfo(data)
        })
        .catch(() => cat.shift())
    }
  } else {
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=title:${
        post.value.title
      }&maxResults=${15}`
    )
      .then(res => res.json())
      .then(data => HandleBookInfo(data))
  }

  suggested.value = [
    ...new Set(
      suggested.value.filter(
        (v: any, i: number, a: any) =>
          a.findIndex((t: any) => t.title === v.title) === i
      )
    )
  ]
    .sort(() => 0.5 - Math.random())
    .slice(0, 5)

  loading.value = false
}

const Del = () => {
  $db.ref(`/contents/${post.value.time}`).remove()
  Libris(userInfo.uid, -(parseInt(post.value.pageCount) / 5))
  navigateTo('/book/list')
}

const Like = () => {
  if (post.value.liked[userInfo.uid]) {
    post.value.likes--
    post.value.liked[userInfo.uid] = false

    $db.ref(`/contents/${post.value.time}/liked/${userInfo.uid}`).set(false)
    $db.ref(`/contents/${post.value.time}/likes`).set(post.value.likes)

    Libris(userInfo.uid, -1)
    Libris(post.value.uid, -1)
  } else {
    post.value.likes++

    try {
      post.value.liked[userInfo.uid] = true
    } catch (e) {
      alert(e)
    }

    $db.ref(`/contents/${post.value.time}/liked/${userInfo.uid}`).set(true)
    $db.ref(`/contents/${post.value.time}/likes`).set(post.value.likes)

    Libris(userInfo.uid, 1)
    Libris(post.value.uid, 1)
  }
}

onBeforeMount(async () => {
  await Content()
  Suggestion()
})

onMounted(() => {
  View()

  if (localStorage.getItem('school'))
    school.value = {
      ...school.value,
      ...JSON.parse(localStorage.getItem('school')!)
    }
})

useHead({
  title: '컨텐츠 - LCW'
})
</script>

<style scoped>
.frame {
  position: absolute;
  border: 0px;
  top: 0px;
  left: 0px;
}

.cardy {
  display: flex;
  padding: 10px;
}

@media screen and (max-width: 605px) {
  .cardy {
    display: block;
  }
}

.fab {
  position: fixed;
  bottom: 20px;
  right: 20px;
}
</style>

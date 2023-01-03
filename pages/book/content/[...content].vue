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
      bottom
      right
      fixed
      color="primary"
      class="zmax"
      @click="iframe = false"
    >
      닫기
    </v-btn>

    <v-card class="my-3 elevation-0" color="#23262e">
      <div class="cardy">
        <div class="ma-auto">
          <v-dialog :model-value="sheet" inset scrollable>
            <template #activator="{ props }">
              <v-img
                :src="post.image"
                width="200"
                class="ml-5 my-5 rounded-lg pointer"
                v-bind="props"
              >
                <template #placeholder>
                  <v-row
                    class="fill-height ma-0"
                    align="center"
                    justify="center"
                  >
                    <v-progress-circular indeterminate color="grey lighten-5" />
                  </v-row>
                </template>
              </v-img>
            </template>
            <v-list nav>
              <v-list-item
                target="_blank"
                :href="`https://aladin.co.kr/${
                  post.isbn
                    ? 'shop/wproduct.aspx?isbn=' + post.isbn
                    : 'search/wsearchresult.aspx?SearchTarget=All&SearchWord=' +
                      post.title
                }`"
              >
                <template #prepend>
                  <v-avatar size="40">
                    <v-img
                      src="https://play-lh.googleusercontent.com/R83BmEu0bafVZ4lNC4dNnJ8Xxt9Cn5ZbS7m96SBaCgsxuTYaWINSgexcuSq8jhAvRkU"
                      alt="aladdin"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>알라딘</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://www.yes24.com/product/search?query=${
                  post.isbn || post.title
                }&domain=all`"
              >
                <template #prepend>
                  <v-avatar size="40">
                    <v-img
                      src="https://image.yes24.com/sysimage/renew/gnb/yes24.ico"
                      alt="yes24"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>YES24</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://www.amazon.com/s?k=${
                  post.isbn || post.title
                }&i=stripbooks&linkCode=qs`"
              >
                <template #prepend>
                  <v-avatar size="40">
                    <v-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt0-ykzLKIz1DSA5dDvSfrVy21kgN08CfsUw&usqp=CAU"
                      alt="amazon"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>아마존</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://search.kyobobook.co.kr/search?keyword=${
                  post.isbn || post.title
                }&collection=kyobo_new`"
              >
                <template #prepend>
                  <v-avatar size="40">
                    <v-img
                      src="https://contents.kyobobook.co.kr/resources/fo/images/common/ink/favicon/apple-touch-icon-144x144-precomposed.png"
                      alt="kyobo"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>교보문고</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://books.google.co.kr/books?id=${otherInfo?.id}`"
              >
                <template #prepend>
                  <v-avatar size="40">
                    <v-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
                      alt="google"
                    />
                  </v-avatar>
                </template>
                <v-list-item-title>구글</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-dialog>
        </div>

        <div class="ma-auto">
          <v-card-title class="h1 text-primary title">
            {{ post.title }}
            <span
              v-if="post.isbn && otherInfo.volumeInfo?.authors"
              class="subtitle-2 ml-1"
            >
              ({{ (otherInfo.volumeInfo?.authors || []).join(', ') }})
            </span>
          </v-card-title>

          <v-card-subtitle>
            by
            <NuxtLink :to="`/user/${post.uid}`">{{
              post.displayName
            }}</NuxtLink>
          </v-card-subtitle>

          <v-card-text>
            <v-rating
              dense
              readonly
              size="20"
              color="amber"
              background-color="white"
              :model-value="post.rating"
            />
            <div class="my-5" v-html="post.content" />
            <v-chip-group class="my-5" column>
              <v-chip label>
                <v-icon start> mdi-eye </v-icon>
                {{ formatter(post.views + 1) }}
              </v-chip>
              <v-chip label>
                <v-icon start>mdi-sort-clock-descending-outline</v-icon>
                {{ new Date(post.time).toLocaleDateString() }}
              </v-chip>
              <v-chip label>
                <v-icon start>mdi-book</v-icon>
                {{ post.pageCount }}
              </v-chip>
              <v-chip
                v-if="userInfo.uid"
                label
                :style="`background-color: ${
                  (post?.liked ?? {})[userInfo.uid] ? '#159ECB' : 'grey'
                }`"
                @click="Like()"
              >
                <v-icon start> mdi-thumb-up </v-icon>
                <span class="subheading" v-text="post?.likes" />
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <div class="text-center my-10">
      <v-dialog width="700">
        <template #activator="{ props }">
          <v-btn text v-bind="props" class="mx-1">
            <v-icon start> mdi-town-hall </v-icon>
            학교 도서관
          </v-btn>
        </template>

        <v-card>
          <v-card-title>학교 도서관 책 검색</v-card-title>

          <v-card-text>
            <div class="d-flex">
              <v-select
                :model-value="school.local"
                :items="school.list"
                label="지역 선택"
                class="mr-2"
              />
              <v-text-field
                :model-value="school.name"
                label="학교 이름"
                :rules="[endWithSchool]"
                class="mx-2"
              />
              <v-btn
                ref="search"
                icon="mdi-magnify"
                class="ma-auto elevation-0"
                @click="schoolBookSearch"
              />
            </div>
            <v-text-field :model-value="school.title" label="책 제목" />
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
      <v-btn text @click="share" class="mx-1">
        <v-icon start> mdi-share-variant </v-icon>
        공유
      </v-btn>
      <v-menu v-if="post.isbn" offset-y>
        <template #activator="{ props }">
          <v-btn
            icon="mdi-dots-vertical"
            v-bind="props"
            cols="1"
            class="mx-1"
          />
        </template>

        <v-card>
          <v-btn text @click="iframe = true">
            <v-icon start> mdi-file-find </v-icon> 미리보기
          </v-btn>
          <v-dialog v-if="post.categories" width="700">
            <template #activator="{ props }">
              <v-btn text v-bind="props">
                <v-icon start> mdi-shape </v-icon> 카테고리
              </v-btn>
            </template>

            <v-card>
              <v-card-text>
                <br />
                <v-chip
                  v-for="tag in post.categories"
                  :key="tag"
                  ripple
                  outlined
                  label
                  :to="`/list?search=${tag}`"
                  class="ma-2 d-block"
                >
                  #{{ tag }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-if="post.isbn" width="700">
            <template #activator="{ props }">
              <v-btn text v-bind="props">
                <v-icon start> mdi-book-information-variant </v-icon> 정보
              </v-btn>
            </template>

            <v-card>
              <v-card-title>
                {{ post.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ (otherInfo.volumeInfo?.authors || []).join(', ') }}
              </v-card-subtitle>

              <v-card-text>
                <v-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">카테고리</th>
                        <th class="text-left">정보</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ISBN 13</td>
                        <td>{{ post.isbn }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.industryIdentifiers">
                        <td>ISBN 10</td>
                        <td>
                          {{
                            otherInfo.volumeInfo.industryIdentifiers[1]
                              .identifier
                          }}
                        </td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo?.publishedDate">
                        <td>출판된 날짜</td>
                        <td>{{ otherInfo.volumeInfo?.publishedDate }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.publisher">
                        <td>출판사</td>
                        <td>{{ otherInfo.volumeInfo.publisher }}</td>
                      </tr>
                      <tr v-if="otherInfo.GBid">
                        <td>Google Books ID</td>
                        <td>{{ otherInfo.GBid }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.averageRating">
                        <td>평균 별점 (구글)</td>
                        <td>{{ otherInfo.volumeInfo.averageRating }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-card>
      </v-menu>
    </div>

    <LazyCommentComponent
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
          class="mx-auto my-5 elevation-0"
          color="#23262e"
          :href="item.infoLink"
          :width="width < 1264 ? 150 : 210"
        >
          <v-img :src="item.thumbnail" class="rounded-lg" />
          <v-card-title class="text-h6">{{ item.title }}</v-card-title>
        </v-card>
      </v-row>
    </template>

    <br /><br /><br />

    <v-speed-dial
      v-if="userInfo.uid === post.uid"
      :model-value="fab"
      bottom
      right
      open-on-hover
      direction="top"
      style="position: fixed"
    >
      <template #activator>
        <v-btn :model-value="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab"> mdi-cog-off </v-icon>
          <v-icon v-else> mdi-cog </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark size="small" color="green" :to="`/book/edit/${time}`">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark size="small" color="red" @click="Del">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
const { $db } = useNuxtApp()

const { width } = useDisplay()
const userInfo = User()
const router = useRouter()
const route = useRoute()
const time = route.params.content

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
  title: ''
})
const iframe = ref<boolean>(false)
const loading = ref<boolean>(true)
const schoolLoading = ref<boolean>(false)
const sheet = ref<boolean>(false)
const fab = ref<boolean>(false)

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

  data !== null && Object.keys(data).length !== 1 && (post.value = data)

  if (data.isbn)
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`
    )
      .then(res => res.json())
      .then(res => (otherInfo.value = res.items[0]))

  school.value.title = post.value.title
}

const share = async () => {
  const { title, content } = post.value
  await navigator.share({
    title,
    text: content,
    url: `https://littlechildwriter.app/book/content/${time}`
  })
  Libris(userInfo.value.uid, 1)
}

const View = () => {
  $db.ref(`contents/${time}/views`).transaction((view: any) => view + 1)
  Libris(post.value.uid, 0.1)
  Libris(userInfo.value.uid, 0.1)

  if (userInfo.value.uid === post.value.uid) {
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
  $db.ref(`contents/${time}`).remove()
  Libris(userInfo.value.uid, -(parseInt(post.value.pageCount) / 100))
  router.push('/list')
}

const Like = () => {
  if (post.value.liked[userInfo.value.uid]) {
    post.value.likes--
    post.value.liked[userInfo.value.uid] = false

    $db
      .ref(`/contents/${post.value.time}/liked/${userInfo.value.uid}`)
      .set(false)
    $db.ref(`/contents/${post.value.time}/likes`).set(post.value.likes)

    Libris(userInfo.value.uid, -0.1)
    Libris(post.value.uid, -0.1)
  } else {
    post.value.likes++

    try {
      post.value.liked[userInfo.value.uid] = true
    } catch (e) {
      console.log(e)
    }

    $db
      .ref(`/contents/${post.value.time}/liked/${userInfo.value.uid}`)
      .set(true)
    $db.ref(`/contents/${post.value.time}/likes`).set(post.value.likes)

    Libris(userInfo.value.uid, 0.1)
    Libris(post.value.uid, 0.1)
  }
}

const endWithSchool = (v: string) =>
  v.endsWith('학교') || '-학교로 끝나게 입력해주세요'

onBeforeMount(async () => {
  await Content()
  View()
  Suggestion()
})

onMounted(() => {
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

.pointer {
  cursor: pointer;
}

@media screen and (max-width: 605px) {
  .cardy {
    display: block;
  }
}
</style>

<script lang="ts">
export default {
  name: 'Content',
  inheritAttrs: false,
  customOptions: {}
}
</script>

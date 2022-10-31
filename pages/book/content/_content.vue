<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <iframe
      v-if="GBid"
      frameborder="0"
      scrolling="no"
      class="zmax frame"
      :src="`https://books.google.co.kr/books?id=${GBid}&lpg=PP1&pg=PP1&output=embed`"
      width="100%"
      height="100%"
    />
    <v-btn
      v-if="GBid"
      bottom
      right
      fixed
      color="primary"
      class="zmax"
      @click="GBid = ''"
    >
      닫기
    </v-btn>

    <v-card class="my-3 transparent">
      <div class="cardy">
        <div class="ma-auto">
          <v-bottom-sheet v-model="sheet" inset>
            <template #activator="{ on, attrs }">
              <v-img
                :src="post.image"
                width="200"
                class="ml-5 my-5 rounded-lg pointer"
                v-bind="attrs"
                v-on="on"
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
              <v-subheader>외부 사이트</v-subheader>

              <v-list-item
                target="_blank"
                :href="`https://aladin.co.kr/${
                  post.isbn
                    ? 'shop/wproduct.aspx?isbn=' + post.isbn
                    : 'search/wsearchresult.aspx?SearchTarget=All&SearchWord=' +
                      post.title
                }`"
              >
                <v-list-item-avatar>
                  <v-avatar size="32px">
                    <img
                      src="https://play-lh.googleusercontent.com/R83BmEu0bafVZ4lNC4dNnJ8Xxt9Cn5ZbS7m96SBaCgsxuTYaWINSgexcuSq8jhAvRkU"
                      alt="알라딘"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>알라딘</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://www.yes24.com/product/search?query=${
                  post.isbn || post.title
                }&domain=all`"
              >
                <v-list-item-avatar>
                  <v-avatar size="32px">
                    <img
                      src="https://play-lh.googleusercontent.com/ujk5bP2q6hYKSOnPrCRgJx4gW-oLdvFB3EfXQs6jdn11LOVRcPljdBqrgNBTxkFNRxY7"
                      alt="yes24"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>yes24</v-list-item-title>
              </v-list-item>

              <v-list-item
                target="_blank"
                :href="`https://www.amazon.com/s?k=${
                  post.isbn || post.title
                }&i=stripbooks&linkCode=qs`"
              >
                <v-list-item-avatar>
                  <v-avatar size="32px">
                    <img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt0-ykzLKIz1DSA5dDvSfrVy21kgN08CfsUw&usqp=CAU"
                      alt="yes24"
                    />
                  </v-avatar>
                </v-list-item-avatar>
                <v-list-item-title>아마존</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-bottom-sheet>
        </div>

        <div class="ma-auto">
          <v-card-title class="h1 primary--text title">
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
            <NLink :to="`/user/${post.uid}`">{{ post.displayName }}</NLink>
          </v-card-subtitle>

          <v-card-text>
            <v-rating
              dense
              readonly
              size="20"
              color="amber"
              background-color="white"
              :value="post.rating"
            />
            <div class="my-5" v-html="post.content" />
            <v-chip-group class="my-5" column>
              <v-chip label>
                <v-icon left> mdi-eye </v-icon>
                {{ formatter.format(post.views + 1) }}
              </v-chip>
              <v-chip label>
                <v-icon left>mdi-sort-clock-descending-outline</v-icon>
                {{ new Date(post.time).toLocaleDateString() }}
              </v-chip>
              <v-chip label>
                <v-icon left>mdi-book</v-icon>
                {{ post.pageCount }}
              </v-chip>
            </v-chip-group>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <div class="text-center my-10">
      <v-dialog transition="dialog-bottom-transition" width="700">
        <template #activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon left> mdi-town-hall </v-icon>
            학교 도서관
          </v-btn>
        </template>

        <v-card>
          <v-card-title>학교 도서관 책 검색</v-card-title>

          <v-card-text class="d-flex">
            <v-select
              v-model="school.local"
              :items="school.list"
              label="지역 선택"
              class="mr-2"
            />
            <v-text-field
              v-model="school.name"
              label="학교 이름"
              :rules="[endWithSchool]"
              class="mx-2"
            />
            <v-btn ref="search" icon class="ma-auto" @click="schoolBookSearch">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </v-card-text>

          <div v-if="schoolLoading" class="text-center mb-4">
            <v-progress-circular indeterminate color="primary" large />
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
                <v-card-title class="primary--text">
                  {{ item.title }}
                </v-card-title>
                <v-card-subtitle>
                  {{ item.writer }}
                </v-card-subtitle>

                <v-card-text class="mt-2 white--text">
                  청구 기호: {{ item.callNumber }}<br />
                  회사: {{ item.company }}
                </v-card-text>
              </v-card>
            </v-list-item>
          </v-list>
          <v-card-text v-else>{{ school.resultString }}</v-card-text>
        </v-card>
      </v-dialog>
      <v-btn text @click="share">
        <v-icon left> mdi-share-variant </v-icon>
        공유
      </v-btn>
      <v-menu v-if="post.isbn" offset-y>
        <template #activator="{ on, attrs }">
          <v-btn icon v-bind="attrs" cols="1" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-btn text @click="Iframe">
            <v-icon left> mdi-file-find </v-icon> 미리보기
          </v-btn>
          <v-dialog
            v-if="post.categories"
            transition="dialog-bottom-transition"
            width="700"
          >
            <template #activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon left> mdi-shape </v-icon> 카테고리
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
          <v-dialog
            v-if="post.isbn"
            transition="dialog-bottom-transition"
            width="700"
          >
            <template #activator="{ on, attrs }">
              <v-btn text v-bind="attrs" v-on="on">
                <v-icon left> mdi-book-information-variant </v-icon> 정보
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
                <v-simple-table>
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
                </v-simple-table>
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

    <div class="text-center">
      <v-progress-circular v-if="loading" indeterminate color="primary" large />
    </div>

    <template v-if="post.categories && !loading">
      <h1>이런 책 어때?</h1>

      <v-row>
        <v-card
          v-for="(item, i) in suggested"
          :key="i"
          class="mx-auto my-5 transparent"
          :href="item.infoLink"
          :width="$vuetify.breakpoint.width < 1264 ? 150 : 210"
        >
          <v-img :src="item.thumbnail" class="rounded-lg" />
          <v-card-title class="text-h6">{{ item.title }}</v-card-title>
        </v-card>
      </v-row>
    </template>

    <br /><br /><br />

    <v-speed-dial
      v-if="userInfo.uid === post.uid"
      v-model="fab"
      bottom
      right
      open-on-hover
      direction="top"
      transition="slide-y-reverse-transition"
      style="position: fixed"
    >
      <template #activator>
        <v-btn v-model="fab" color="blue darken-2" dark fab>
          <v-icon v-if="fab"> mdi-cog-off </v-icon>
          <v-icon v-else> mdi-cog </v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" :to="`/book/edit/${time}`">
        <v-icon>mdi-pencil</v-icon>
      </v-btn>
      <v-btn fab dark small color="red" @click="Del">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-speed-dial>
  </div>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { formatter, User } from '@/plugins/global'

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
  },
  GBid: ''
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
  name: ''
})
const GBid = ref<string>('')
const loading = ref<boolean>(true)
const schoolLoading = ref<boolean>(false)
const sheet = ref<boolean>(false)
const fab = ref<boolean>(false)

const schoolBookSearch = async () => {
  localStorage.setItem(
    'school',
    JSON.stringify({
      local: school.value.local,
      name: school.value.name
    })
  )
  schoolLoading.value = true

  await fetch(
    `https://little-child-writer-school-book-search.onrender.com/?book=${post.value.title}&school=${school.value.name}&local=${school.value.local}`
  )
    .then(res => res.json())
    .then(json => {
      school.value.result = json.result
      school.value.resultString = json.result.toString()
    })

  schoolLoading.value = false
}

const Content = async () => {
  const data = await db
    .ref(`/contents/${time}`)
    .once('value')
    .then(r => r.val())

  data !== null && Object.keys(data).length !== 1 && (post.value = data)

  if (data.isbn) {
    await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${data.isbn}`
    )
      .then(res => res.json())
      .then(res => (otherInfo.value = res.items[0]))
  }
}

const share = async () => {
  const { title, content } = post.value
  await navigator.share({
    title,
    text: content,
    url: `https://littlechildwriter.app/book/content/${time}`
  })
}

const View = () => {
  db.ref(`contents/${time}/views`).transaction(view => view + 1)
  Libris(post.value.uid, 0.1)
  Libris(userInfo.value.uid, 0.1)

  if (userInfo.value.uid === post.value.uid) {
    db.ref(`contents/${time}/views`).transaction(view => view - 1)
    post.value.views--
  }
}

const Suggestion = async () => {
  loading.value = true

  if (!post.value.categories) {
    loading.value = false
    return
  }

  const cat: string[] = [...post.value.categories]
  cat.forEach((tag, i) => (cat[i] = encodeURIComponent(`'${tag}'`)))

  let done = false
  let n = 5
  let overflow = 0

  while (!done) {
    overflow++

    if (overflow > 10) {
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

        if (length > 4) {
          done = true
        } else {
          cat.shift()
          n -= length
        }

        for (let i = 0; i < length; i++) {
          const book = data.items[i]

          if (
            book.volumeInfo.imageLinks.thumbnail &&
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

            if (i === 4) {
              break
            }
          }
        }
      })
      .catch(() => cat.shift())
  }

  loading.value = false
}

const Iframe = async () => {
  let fetched = ''

  await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=isbn:${post.value.isbn}`
  )
    .then(res => res.json())
    .then(res => (fetched = res.items[0].id))

  GBid.value = fetched
}

const Del = () => {
  db.ref(`contents/${time}`).remove()
  Libris(userInfo.value.uid, -(parseInt(post.value.pageCount) / 100))
  router.push('/list')
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
  title: '컨텐츠 - LCW',
  meta: [
    {
      'http-equiv': 'Content-Security-Policy',
      content: 'upgrade-insecure-requests'
    }
  ]
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

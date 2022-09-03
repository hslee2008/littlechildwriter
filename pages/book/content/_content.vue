<template>
  <div>
    <iframe
      v-if="fetchedBookID"
      frameborder="0"
      scrolling="no"
      class="zmax frame"
      :src="`https://books.google.co.kr/books?id=${fetchedBookID}&lpg=PP1&pg=PP1&output=embed&key='
    AIzaSyCrBZ5fHvUIZpsT8LzpSRhesRhE6pTeQk4'`"
      width="100%"
      height="100%"
    />
    <v-btn
      v-if="fetchedBookID"
      bottom
      right
      fixed
      color="primary"
      class="zmax"
      @click="fetchedBookID = ''"
    >
      닫기
    </v-btn>

    <v-card class="my-3 transparent">
      <div class="cardy">
        <div class="text-center ma-auto">
          <v-img
            :src="post.image"
            width="200"
            class="ma-auto ml-5 my-5 rounded-lg"
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>
        </div>

        <div class="ma-auto pa-1">
          <v-card-title class="h1 primary--text" v-text="post.title" />

          <v-card-subtitle>
            by
            <NuxtLink :to="`/user/${post.uid}`" v-text="post.displayName" />
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
            <p class="my-5" v-text="post.content" />
            <v-chip-group class="my-5" column>
              <v-chip label>
                <v-icon left> mdi-eye </v-icon>
                {{ post.views + 1 }}
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
      <div v-if="post.uid === userInfo.uid" class="mb-10">
        <LazyDialogComponent
          :cb="del"
          btn-title="삭제"
          title="진짜로 삭제하겠습니까?"
          text="삭제하면 복구할 수 없습니다"
          icon="trash-can"
        />
        <v-btn :to="`/book/edit/${time}`" class="ml-3" color="blue lighten-2">
          <v-icon left> mdi-pencil </v-icon> 편집
        </v-btn>
      </div>

      <v-btn text to="/list">
        <v-icon left>mdi-chevron-left</v-icon> 뒤로
      </v-btn>
      <v-btn text @click="loadIframe">
        <v-icon left> mdi-file-find </v-icon> 미리보기
      </v-btn>
      <v-dialog width="700">
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
    </div>

    <LazyCommentComponent
      :link="`/book/content/${time}`"
      :dbr="`contents/${time}/comments`"
      :uid="this.post.uid"
    />

    <br /><br /><br /><br /><br /><br /><br /><br />

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
        </v-card>
      </v-row>
    </template>

    <br /><br /><br /><br />
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  asyncData({ params }) {
    const time = params.content
    return {
      time
    }
  },
  data() {
    return {
      parsedTime: '',

      comment: '',
      comments: [],

      post: {
        isbn: '',
        liked: {},
        categories: [],
        uid: ''
      },

      fetchedBookID: '',
      loading: false,
      suggested: []
    }
  },
  async created() {
    await this.getPost()
    this.growView()
    this.fetchContent()
  },
  methods: {
    async fetchContent() {
      this.loading = true

      var overflow = 0

      const cat = [...this.post.categories]
      cat.forEach((tag, i) => (cat[i] = encodeURIComponent(`'${tag}'`)))

      let done = false,
        n = 5

      while (!done) {
        overflow++

        if (overflow > 10) {
          done = true
          break
        }

        await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=subject:${cat.join(
            ','
          )}&maxResults=${n}&key=AIzaSyCrBZ5fHvUIZpsT8LzpSRhesRhE6pTeQk4`
        )
          .then(res => res.json())
          .then(data => {
            const length = data.items.length

            if (length > 4) done = true
            else cat.shift(), (n -= length)

            for (let i = 0; i < length; i++) {
              const book = data.items[i]

              if (
                book.volumeInfo.imageLinks.thumbnail &&
                book.volumeInfo.title !== this.post.title
              ) {
                const {
                  imageLinks: { thumbnail },
                  infoLink
                } = book.volumeInfo

                this.suggested.push({
                  thumbnail,
                  infoLink
                })

                if (i === 4) break
              }
            }
          })
          .catch(() => cat.shift())
      }

      this.loading = false
    },
    async loadIframe() {
      let fetched = ''

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}&key=AIzaSyCrBZ5fHvUIZpsT8LzpSRhesRhE6pTeQk4`
      )
        .then(res => res.json())
        .then(res => {
          fetched = res.items[0].id
        })

      this.fetchedBookID = fetched
    },
    del() {
      db.ref(`contents/${this.time}`).remove()
      this.updateLibris(this.userInfo.uid, -(this.post.pageCount / 100))
      this.$router.push('/list')
    },
    async getPost() {
      const post = await db
        .ref(`/contents/${this.time}`)
        .once('value')
        .then(r => r.val())

      post !== null && Object.keys(post).length !== 1 && (this.post = post)
    },
    growView() {
      db.ref(`contents/${this.time}/views`).transaction(view => view + 1)
      this.updateLibris(this.post.uid, 0.1)
      this.updateLibris(this.userInfo.uid, 0.1)
    }
  }
}
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
</style>

<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <v-dialog v-model="isbn.upload" width="500">
      <v-card>
        <v-card-title> 책 사진 업로드 </v-card-title>

        <br />

        <v-card-text>
          <v-img
            v-if="post.image"
            ref="isbn"
            :src="post.image"
            class="rounded-lg"
          />

          <v-tabs>
            <v-tab> 기기에서 업로드 </v-tab>
            <v-tab> URL로 업로드 </v-tab>

            <v-tab-item class="pt-3">
              <v-file-input
                accept="image/*"
                outlined
                dense
                label="책 사진을 선택하세요"
                @change="uploadImg($event)"
              />
            </v-tab-item>

            <v-tab-item class="pt-3">
              <v-text-field
                v-model="post.image"
                label="책 사진의 URL을 입력하세요"
                prepend-icon="mdi-link"
              />
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.upload = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.barcode" width="500">
      <v-card>
        <v-card-title> IBSN 사진 </v-card-title>

        <br />

        <v-card-text>
          <v-tabs>
            <v-tab> 이미지로 </v-tab>
            <v-tab> 카메라로 </v-tab>

            <v-tab-item class="pt-3">
              <v-file-input
                type="file"
                accept="image/*"
                label="ISBN 사진"
                color="grey"
                outlined
                dense
                @change="uploadFile($event)"
              />
            </v-tab-item>

            <v-tab-item class="pt-3">
              <div id="container">
                <video
                  id="videoElement"
                  ref="video"
                  autoplay="true"
                  width="100%"
                />
              </div>
              <v-card-actions>
                <v-btn @click="showCamera">시작</v-btn>
                <v-btn @click="takeISBNVideo"> ISBN 바코드 찍기 </v-btn>
              </v-card-actions>
            </v-tab-item>
          </v-tabs>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.barcode = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.audio" width="500">
      <v-card>
        <v-card-title> 보이스 타이핑 </v-card-title>

        <br />

        <v-card-text>
          <v-select
            v-model="isbn.audioType"
            :items="[...navigator.languages, 'en-US', 'ko-KR']"
            label="보이스 타이핑 언어"
          />
          <v-textarea v-model="typed" clearable counter />
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="voiceType">시작</v-btn>
          <v-spacer />
          <v-btn text color="red" @click="isbn.barcode = false"> 취소 </v-btn>
          <v-btn text color="primary" @click="saveAudio"> 확인 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.input" width="500">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          rounded
          color="white"
          class="mb-0"
        />
        <v-card-title> 입력 </v-card-title>

        <br />

        <v-card-text>
          <v-text-field
            v-if="isbn.input"
            v-model="post.isbn"
            autofocus
            label="ISBN"
            @keyup.enter="fetchi"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.input = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.find" width="700">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          rounded
          color="white"
          class="mb-0"
        />
        <v-card-title> 책 찾기 </v-card-title>

        <br />

        <v-card-text>
          <v-text-field
            v-if="isbn.find"
            v-model="title"
            autofocus
            label="책 제목"
            @keyup.enter="fetchISBN"
          />
        </v-card-text>

        <v-list>
          <div
            v-for="item in searched"
            :key="item.volumeInfo.industryIdentifiers[0].identifier"
          >
            <v-list-item
              v-if="
                item.volumeInfo.industryIdentifiers &&
                item.volumeInfo.imageLinks
              "
              @click="
                fetchBook(item.volumeInfo.industryIdentifiers[0].identifier)
              "
            >
              <v-img
                :src="item.volumeInfo.imageLinks.thumbnail"
                class="mr-4 ma-2 rounded-lg"
                max-width="100"
              />

              <v-list-item-content>
                <v-list-item-title class="primary--text h1">
                  {{ item.volumeInfo.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.volumeInfo.subtitle }}
                </v-list-item-subtitle>

                <v-spacer />

                <v-list-item-subtitle>
                  {{
                    item.volumeInfo.authors
                      ? item.volumeInfo.authors[0]
                      : 'unkown'
                  }}
                  -
                  {{
                    item.volumeInfo.pageCount
                      ? item.volumeInfo.pageCount
                      : 'unkown'
                  }}
                </v-list-item-subtitle>

                <br />

                <v-list-item-subtitle v-if="item.volumeInfo.description">
                  {{ item.volumeInfo.description.substring(0, 200) }}...
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item v-else>
              <v-list-item-content>
                <v-list-item-title class="primary--text h1">
                  {{ item.volumeInfo.title }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{ item.volumeInfo.subtitle }}
                </v-list-item-subtitle>

                <v-spacer />

                <v-list-item-subtitle class="red--text">
                  이 책에 대한 정보가 부족해 선택할 수 없습니다.
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </div>
        </v-list>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.find = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-text>
      <v-row class="my-10">
        <v-rating
          v-model="post.rating"
          color="blue"
          required
          ripple
          size="30"
          class="mx-auto"
        />
      </v-row>

      <v-text-field v-model="post.title" label="제목" class="title" />

      <v-row class="g-10" style="margin: 0.5px 0">
        <v-text-field v-model="post.author" label="작가" class="author" />
        <v-text-field v-model="post.pageCount" label="페이지" class="page" />
      </v-row>

      <v-checkbox
        v-model="post.isPublic"
        :label="`${post.isPublic ? '' : '(프로필 페이지에서만 공개됨) 비'}공개`"
        color="blue"
      />

      <v-textarea
        v-model="post.content"
        label="책 소개"
        clearable
        counter
        class="content"
      />
    </v-card-text>

    <v-card-actions class="g-10">
      <v-btn color="primary" class="upload" @click="postcontent">
        업로드
      </v-btn>

      <v-menu bottom>
        <template #activator="{ on, attrs }">
          <v-btn elevation="0" v-bind="attrs" v-on="on">
            책 정보 입력 <v-icon right>mdi-chevron-down</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="isbn.upload = true">
            <v-icon left> mdi-upload </v-icon> 책 사진 업로드
          </v-list-item>
          <v-list-item
            v-if="$vuetify.breakpoint.mobile"
            @click="isbn.barcode = true"
          >
            <v-icon left> mdi-barcode-scan </v-icon> ISBN 촬영
          </v-list-item>
          <v-list-item @click="isbn.input = true">
            <v-icon left> mdi-form-textbox </v-icon> ISBN 입력
          </v-list-item>
          <v-list-item @click="isbn.find = true">
            <v-icon left> mdi-book-search </v-icon> 책 찾기
          </v-list-item>
          <v-list-item @click="isbn.audio = true">
            <v-icon left> mdi-microphone </v-icon> 보이스 타이핑
          </v-list-item>
        </v-list>
      </v-menu>
    </v-card-actions>

    <div class="ma-auto mt-10">
      <v-img
        v-if="post.image"
        :src="post.image"
        class="rounded-lg"
        max-width="200"
      />
    </div>
  </div>
</template>

<script>
// todo to typescript
import Vue from 'vue'
import { db } from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      post: {
        isbn: '',
        title: '',
        image: '',
        pageCount: '',
        categories: [],
        rating: 5,
        content: '',
        uid: '',
        displayName: '',
        views: 0,
        author: '',
        time: Date.now(),
        isPublic: true
      },

      isbn: {
        barcode: false,
        input: false,
        find: false,
        audio: false,
        upload: false,
        audioType: ''
      },

      loading: false,
      title: '',
      searched: {},
      bc_f: ['code_39', 'codabar', 'ean_13', 'ean_8', 'upc_a'],
      typed: '',
      shouldUploadImage: false
    }
  },
  methods: {
    fetchBook(isbn) {
      this.post.isbn = isbn
      this.fetchi()
      this.isbn.find = false
    },
    async fetchISBN() {
      this.loading = true

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${this.title}`
      )
        .then(res => res.json())
        .then(books => (this.searched = books.items))
        .catch(err => this.handleError(err.message))

      this.loading = false
    },
    showCamera() {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 4096 },
            height: { ideal: 2160 }
          }
        })
        .then(s => (this.$refs.video.srcObject = s))
        .catch(err => this.handleError(err.message))
    },
    takeISBNVideo() {
      if ('BarcodeDetector' in window) {
        new BarcodeDetector({
          bc_f: this.bc_f
        })
          .detect(this.$refs.video)
          .then(res => res[0].rawValue)
          .then(a => {
            this.post.isbn = JSON.stringify(a, null, 2).replace(/"/g, '')
            this.isbn.barcode = false
            this.fetchi()
          })
          .catch(err => this.handleError(err.message))
      } else {
        this.handleError('BarcodeDetector is not supported')
      }
    },
    uploadFile(file) {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          this.$refs.isbn.src = reader.result
          const tempImage = new Image()
          tempImage.src = reader.result || ''
          tempImage.onload = () => {
            if ('BarcodeDetector' in window) {
              new BarcodeDetector({
                bc_f: this.bc_f
              })
                .detect(this.$refs.isbn)
                .then(res => res[0].rawValue)
                .then(a => {
                  this.post.isbn = JSON.stringify(a, null, 2).replace(/"/g, '')
                  this.isbn.barcode = false
                  this.fetchi()
                })
                .catch(err => this.handleError(err.message))
            } else {
              this.handleError('BarcodeDetector is not supported')
            }
          }
        },
        false
      )

      reader.readAsDataURL(file)
    },
    uploadImg(f) {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => (this.post.image = reader.result ?? ''),
        false
      )

      f && reader.readAsDataURL(f)
    },
    postcontent() {
      const {
        title,
        content,
        rating,
        isbn,
        time,
        image,
        pageCount,
        categories,
        isPublic
      } = this.post

      const { uid, displayName } = this.userInfo

      db.ref(`/contents/${time}`).set({
        title,
        rating,
        isbn,
        time,
        image,
        pageCount,
        categories,
        isPublic,
        likes: 1,
        liked: {
          [this.userInfo.uid]: true
        },
        views: 0,
        uid,
        displayName,
        content: content.replaceAll('\n', '<br>')
      })

      this.updateLibris(this.userInfo.uid, parseInt(this.post.pageCount) / 100)
      this.$router.push(`/book/content/${time}`)
    },
    fetchi() {
      this.loading = true

      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
      )
        .then(res => res.json())
        .then(async res => {
          if (res.items[0].volumeInfo.imageLinks) {
            const {
              title,
              imageLinks: { thumbnail: image },
              authors: author,
              pageCount
            } = res.items[0].volumeInfo

            this.post = {
              ...this.post,
              title,
              image,
              pageCount,
              author,
              categories: await fetch(res.items[0].selfLink)
                .then(cg => cg.json())
                .then(cg => cg.volumeInfo.categories)
                .catch(err => this.handleError(err.message))
            }
          } else {
            const {
              title,
              authors: author,
              pageCount
            } = res.items[0].volumeInfo

            this.post = {
              ...this.post,
              title,
              pageCount,
              author,
              image:
                'https://books.google.co.kr/googlebooks/images/no_cover_thumb.gif',
              categories: ['Juvenile Fiction / General']
            }
          }

          this.isbn.input = false
        })
        .catch(err => this.handleError(err.message))

      this.loading = false
    },
    voiceType() {
      // eslint-disable-next-line new-cap
      const recognition = new webkitSpeechRecognition()
      recognition.lang = this.isbn.audioType
      recognition.start()

      recognition.onresult = e => {
        this.typed += e.results[0][0].transcript + '. '
      }

      recognition.onspeechend = () => {
        recognition.stop()
      }

      recognition.onerror = e => this.handleError(e.message)
    },
    saveAudio() {
      this.isbn.audio = false
      this.post.content = this.typed
      this.typed = ''
    }
  }
})
</script>

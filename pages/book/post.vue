<template>
  <div>
    <div class="d-none">
      <img ref="isbn" src="" />
      <v-file-input ref="file" accept="image/*" @change="uploadImg($event)" />
    </div>

    <v-menu bottom>
      <template #activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          책 정보 입력
        </v-btn>
      </template>

      <v-list>
        <v-list-item @click="$refs.file.$refs.input.click()">
          <v-icon left> mdi-upload </v-icon> 책 사진 업로드
        </v-list-item>
        <v-list-item v-if="$vuetify.breakpoint.mobile" @click="showCamera">
          <v-icon left> mdi-barcode-scan </v-icon> 카메라로 ISBN 촬영
        </v-list-item>
        <v-list-item
          v-if="$vuetify.breakpoint.mobile"
          @click="isbn.pictureBarcode = true"
        >
          <v-icon left> mdi-barcode </v-icon> 사진으로 ISBN 촬영
        </v-list-item>
        <v-list-item @click="isbn.inputISBN = true">
          <v-icon left> mdi-form-textbox </v-icon> ISBN 입력
        </v-list-item>
        <v-list-item @click="isbn.findISBN = true">
          <v-icon left> mdi-book-search </v-icon> 책 찾기
        </v-list-item>
      </v-list>
    </v-menu>

    <v-dialog v-model="isbn.videoBarcode" width="90%" height="90%">
      <v-card v-if="isbn.videoBarcode" height="100%" width="100%">
        <div id="container">
          <video id="videoElement" ref="video" autoplay="true" width="100%" />
        </div>
        <v-card-actions>
          <v-btn @click="takeISBNVideo"> ISBN 바코드 찍기 </v-btn>
          <v-btn color="error" @click="isbn.videoBarcode = false">
            <v-icon left> mdi-close-outline </v-icon>취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.pictureBarcode" width="500">
      <v-card>
        <v-card-title> IBSN 사진 </v-card-title>

        <br />

        <v-card-text>
          <v-file-input
            type="file"
            accept="image/*"
            label="ISBN 사진"
            color="grey"
            outlined
            dense
            @change="uploadFile($event)"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.pictureBarcode = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.inputISBN" width="500">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="white"
          class="mb-0"
        />
        <v-card-title> 입력 </v-card-title>

        <br />

        <v-card-text>
          <v-text-field
            v-if="isbn.inputISBN"
            v-model="post.isbn"
            autofocus
            label="ISBN"
            @keyup.enter="fetchi"
          />
        </v-card-text>

        <v-alert v-if="error" v-text="error" class="ml-2"></v-alert>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.inputISBN = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.findISBN" width="700">
      <v-card>
        <v-progress-linear
          v-if="loading"
          indeterminate
          color="white"
          class="mb-0"
        />
        <v-card-title> 책 찾기 </v-card-title>

        <br />

        <v-card-text>
          <v-text-field
            v-if="isbn.findISBN"
            v-model="searching_title"
            autofocus
            label="책 제목"
            @keyup.enter="fetchISBN"
          />
        </v-card-text>

        <v-list>
          <v-list-item
            v-for="item in searched_books"
            v-if="item.volumeInfo.industryIdentifiers"
            :key="item.volumeInfo.industryIdentifiers[0].identifier"
            @click="
              fetchFromSearch(item.volumeInfo.industryIdentifiers[0].identifier)
            "
          >
            <v-img
              v-if="item.volumeInfo.imageLinks"
              :src="item.volumeInfo.imageLinks.thumbnail"
              class="mr-4 ma-2 rounded-lg"
              max-width="100"
            />

            <v-list-item-content>
              <v-list-item-title
                class="primary--text h1"
                v-text="item.volumeInfo.title"
              />
              <v-list-item-subtitle v-text="item.volumeInfo.subtitle" />

              <v-spacer />

              <v-list-item-subtitle
                v-text="
                  `${
                    item.volumeInfo.authors
                      ? item.volumeInfo.authors[0]
                      : 'unkown'
                  } - ${
                    item.volumeInfo.pageCount
                      ? item.volumeInfo.pageCount
                      : 'unkown'
                  }`
                "
              />

              <br />

              <v-list-item-subtitle v-if="item.volumeInfo.description">
                {{ item.volumeInfo.description.substring(0, 200) }}...
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer />
          <v-btn text @click="isbn.findISBN = false"> 취소 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row class="my-10">
      <v-rating
        v-model="post.rating"
        color="blue"
        required
        size="30"
        class="mx-auto"
      />
    </v-row>

    <v-text-field v-model="post.title" label="제목" />

    <v-row class="gap10" style="margin: 0.5px 0">
      <v-text-field v-model="post.author" label="작가" />
      <v-text-field v-model="post.pageCount" label="페이지" />
    </v-row>

    <v-checkbox
      v-model="post.isPublic"
      :label="`${post.isPublic ? '' : '(프로필 페이지에서만 공개됨) 비'}공개`"
      color="blue"
    />

    <v-textarea v-model="post.content" label="책 소개" />

    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" text @click="postcontent">
        업로드 <v-icon right> mdi-note-plus </v-icon>
      </v-btn>
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
import { db } from '@/plugins/firebase'

export default {
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
        time: Date.now(),
        isPublic: true
      },

      isbn: {
        videoBarcode: false,
        pictureBarcode: false,
        inputISBN: false,
        findISBN: false
      },

      error: '',
      loading: false,
      searching_title: '',
      searched_books: [],
      formats: ['code_39', 'codabar', 'ean_13', 'ean_8', 'upc_a']
    }
  },
  methods: {
    fetchFromSearch(isbn) {
      this.post.isbn = isbn
      this.isbn.findISBN = false
      this.fetchi()
    },
    async fetchISBN() {
      this.loading = true

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=intitle:${this.searching_title}&maxResults=40`
      )
        .then(res => res.json())
        .then(
          books =>
            (this.searched_books = books.items?.sort(
              (a, b) =>
                (a.volumeInfo.imageLinks == undefined) -
                (b.volumeInfo.imageLinks == undefined)
            ))
        )

      this.loading = false
    },
    showCamera() {
      this.isbn.videoBarcode = true

      navigator.mediaDevices.getUserMedia &&
        navigator.mediaDevices
          .getUserMedia({
            video: {
              facingMode: 'environment',
              width: { ideal: 4096 },
              height: { ideal: 2160 }
            }
          })
          .then(s => (this.$refs.video.srcObject = s))
          .catch(() => (this.isbn.pictureBarcode = false))
    },
    takeISBNVideo() {
      if ('BarcodeDetector' in window)
        new BarcodeDetector({
          formats: this.formats
        })
          .detect(this.$refs.video)
          .then(res => res[0].rawValue)
          .then(a => {
            this.post.isbn = JSON.stringify(a, null, 2).replace(/"/g, '')
            this.isbn.videoBarcode = false
            this.fetchi()
          })
          .catch(() => alert('다시 찍어주세요'))
    },
    uploadFile(file) {
      const reader = new FileReader()

      reader.addEventListener(
        'load',
        () => {
          this.$refs.isbn.src = reader.result
          const tempImage = new Image()
          tempImage.src = reader.result
          tempImage.onload = () => {
            if ('BarcodeDetector' in window)
              new BarcodeDetector({
                formats: this.formats
              })
                .detect(this.$refs.isbn)
                .then(res => res[0].rawValue)
                .then(a => {
                  this.post.isbn = JSON.stringify(a, null, 2).replace(/"/g, '')
                  this.isbn.pictureBarcode = false
                  this.fetchi()
                })
                .catch(() => alert('다시 찍어주세요'))
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
        () => (this.post.image = reader.result),
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
        content,
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
        displayName
      })

      this.updateLibris(this.userInfo.uid, this.post.pageCount / 100)
      this.$router.push(`/book/content/${time}`)
    },
    fetchi() {
      this.loading = true

      fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
      )
        .then(res => res.json())
        .then(async res => {
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
              .then(res => res.json())
              .then(res => res.volumeInfo.categories)
          }

          this.isbn.inputISBN = false
        })

      this.loading = false
    }
  }
}
</script>

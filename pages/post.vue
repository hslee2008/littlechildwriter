<template>
  <div>
    <v-row style="margin: 5px; gap: 10px">
      <v-card
        :width="this.$vuetify.mobile ? 300 : 500"
        v-if="!isbn.isGoingToTakeVideoISBNPicture"
      >
        <img
          id="isbn"
          src="/logo.png"
          alt="isbn-nothing-to-be-shown"
          style="display: none"
        />

        <v-card-text>
          <v-text-field
            label="ISBN"
            v-model="post.isbn"
            append-icon="mdi-database-import"
            @click:append="fetchi"
            dense
            v-if="isbn.showIsbn"
          ></v-text-field>

          <v-file-input
            v-if="isbn.isGoingToTakeISBNPicture"
            type="file"
            accept="image/*"
            @change="uploadFile($event)"
            label="ISBN 사진"
            color="grey"
            outlined
            dense
          />

          <v-row
            style="margin: 5px; gap: 10px; margin-bottom: 10px"
            justify="center"
          >
            <v-btn
              @click="isbn.isGoingToTakeVideoISBNPicture = true"
              color="primary"
              dark
            >
              <v-icon left>mdi-camera</v-icon>
              비디오
            </v-btn>

            <v-divider vertical></v-divider>

            <v-btn
              @click="
                isbn.isGoingToTakeISBNPicture = !isbn.isGoingToTakeISBNPicture
              "
              color="primary"
              dark
            >
              <v-icon left>mdi-camera</v-icon>
              사진
            </v-btn>

            <v-divider vertical></v-divider>

            <v-btn
              @click="isbn.showIsbn = !isbn.showIsbn"
              elevation="0"
              color="primary"
              ><v-icon left>mdi-book-alphabet</v-icon> ISBN 직접 입력</v-btn
            >
          </v-row>

          <v-divider></v-divider>

          <br />
          <v-row style="margin: 1px">
            <div style="margin: auto">
              {{ new Date().toLocaleDateString() }}
            </div>
            <v-rating
              v-model="post.rating"
              background-color="blue lighten-3"
              color="blue"
              dense
              size="30"
              style="margin: auto"
            ></v-rating
          ></v-row>
          <v-form v-model="valid" lazy-validation>
            <v-text-field
              label="제목"
              v-model="post.title"
              :hint="post.subtitle"
            ></v-text-field>
            <v-text-field label="작가" v-model="post.author"></v-text-field>

            <div class="text--primary">
              <v-textarea
                label="책 요약"
                hint="책에 대한 내용을 넣으세요!"
                v-model="post.content"
                :rules="contentRule"
                validate-on-blur
              ></v-textarea>
            </div>

            <br />

            <v-file-input
              type="file"
              accept="image/*"
              @change="uploadImageFile($event)"
              label="책 사진"
              color="grey"
              outlined
              dense
              prepend-icon="mdi-image"
          /></v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn
            color="teal accent-7"
            @click="postcontent"
            elevation="0"
            :disabled="!valid"
          >
            올리기<v-icon right>mdi-note-plus</v-icon>
          </v-btn>
          <v-btn to="/list" elevation="0" text>
            <v-icon>mdi-arrow-left</v-icon>취소</v-btn
          >
        </v-card-actions>

        <v-alert
          dense
          outlined
          type="error"
          v-if="error"
          style="margin: 10px"
          >{{ error }}</v-alert
        >
      </v-card>

      <v-card
        :height="300"
        :width="630"
        v-if="isbn.isGoingToTakeVideoISBNPicture"
      >
        <div id="container">
          <video
            autoplay="true"
            id="videoElement"
            width="100%"
            height="300"
          ></video>
        </div>
        <v-card-actions>
          <v-btn @click="asCamera">카메라</v-btn>
          <v-btn @click="takeCamera">ISBN 바코드 찍기</v-btn>
          <v-btn @click="isbn.isGoingToTakeVideoISBNPicture = false"
            ><v-icon left>mdi-close-outline</v-icon>취소</v-btn
          ></v-card-actions
        >
      </v-card>

      <div style="margin: auto">
        <v-img :src="post.image" v-if="post.image" />
      </div>
    </v-row>

    <br /><br />
  </div>
</template>

<script>
import { db, storage, auth } from '../plugins/firebase.js'
import 'firebase/compat/database'

export default {
  name: 'PostPage',
  data() {
    return {
      post: {
        title: '',
        subtitle: '',
        content: '',
        rating: 0,
        isbn: '',
        author: [],
        previewLink: '',
        image: '',
        pageCount: 0,
        likes: 0,
      },
      contentRule: [
        (v) => !!v || '내용을 적어주세요!',
        (v) => v.length > 10 || '10자 이상이어야 합니다.',
      ],
      loading: false,
      valid: false,
      error: '',
      libris: 0,
      isbn: {
        isGoingToTakeVideoISBNPicture: false,
        isGoingToTakeISBNPicture: false,
        showIsbn: false,
      },
    }
  },
  methods: {
    changeISBN(e) {
      this.post.isbn = e
    },
    onfilechange(e) {
      const file = e
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = (e) => {
        this.post.image = e.target.result
      }
    },
    asCamera() {
      try {
        let video = document.querySelector('#videoElement')

        if (navigator.mediaDevices.getUserMedia) {
          navigator.mediaDevices
            .getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 4096 },
                height: { ideal: 2160 },
              },
            })
            .then(function (stream) {
              video.srcObject = stream
            })
            .catch(function (error) {
              console.log('Something went wrong!')
            })
        }
      } catch (err) {
        alert(err.message)
      }
    },
    takeCamera() {
      try {
        if ('BarcodeDetector' in window) {
          let barcodeDetector = new BarcodeDetector({
            formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
          })

          barcodeDetector
            .detect(document.querySelector('#videoElement'))
            .then(async (a) => {
              this.post.isbn = JSON.stringify(
                await a[0].rawValue,
                null,
                2
              ).replace(/\"/g, '')
              this.fetchi()
            })
            .catch((err) => {
              alert(
                'ISBN을 인식하지 못했습니다. 바코드가 흐어게 보이지 않게 멀리 다시 찍어 주세요.'
              )
            })
        }
      } catch (err) {
        alert('카메라 사용 불가: ' + err.message)
      }
    },
    uploadFile(e) {
      let reader = new FileReader()

      reader.onload = () => {
        document.querySelector('#isbn').src = reader.result

        let tempImage = new Image()
        tempImage.src = reader.result

        tempImage.onload = () => {
          if ('BarcodeDetector' in window) {
            let barcodeDetector = new BarcodeDetector({
              formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
            })

            barcodeDetector
              .detect(document.querySelector('#isbn'))
              .then(async (a) => {
                this.post.isbn = JSON.stringify(
                  await a[0].rawValue,
                  null,
                  2
                ).replace(/\"/g, '')
                this.isbn.isGoingToTakeVideoISBNPicture = false
                this.fetchi()
              })
              .catch((err) =>
                alert(
                  'ISBN을 인식하지 못했습니다. 바코드가 흐어게 보이지 않게 멀리 다시 찍어 주세요.'
                )
              )
          } else {
            this.isbn.isGoingToTakeVideoISBNPicture = false
            alert('카메라 사용 불가능합니다. 핸드폰에서만 가능합니다.')
          }
        }
      }

      reader.readAsDataURL(e)
    },
    uploadImageFile(e) {
      let reader = new FileReader()
      reader.onload = () => (this.post.image = reader.result)
      reader.readAsDataURL(e)
    },
    async postcontent() {
      const timestamp = Date.now()

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          db.ref('/contents/' + user.uid + '/posts/' + timestamp).set({
            title: this.post.title,
            content: this.post.content,
            rating: this.post.rating,
            isbn: this.post.isbn,
            uid: user.uid,
            time: timestamp,
            username: user.displayName,
            image: this.post.image,
            previewLink: this.post.previewLink,
            pageCount: this.post.pageCount,
            likes: 0,
            liked: false,
            views: 0,
          })

          db.ref('/users/' + user.uid).update({
            username: user.displayName,
            photoURL: user.photoURL,
            libris: parseInt(this.libris) + 1,
          })
        }
      })

      this.$router.push('/list')
    },
    async fetchi() {
      this.error = ''

      try {
        await fetch(
          `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
        )
          .then((res) => res.json())
          .then((json) => {
            if (json.totalItems > 0) {
              this.post.title = json.items[0].volumeInfo.title
              this.post.subtitle = json.items[0].volumeInfo.subtitle
              this.post.previewLink = json.items[0].volumeInfo.previewLink
              this.post.image = json.items[0].volumeInfo.imageLinks.thumbnail

              if (!this.post.image) this.error = '이미지를 찾을 수 없습니다. '

              this.post.pageCount = json.items[0].volumeInfo.pageCount
              this.post.author = json.items[0].volumeInfo.authors
            } else {
              this.error = '책을 찾을 수 없습니다.'
            }
          })
      } catch (err) {
        this.error = 'ISBN이 존재하지 않습니다...'
      }
    },
    fetchLibris() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await db
            .ref('/users/' + user.uid)
            .once('value')
            .then((snapshot) => {
              this.libris = snapshot.val().libris
            })
        }
      })
    },
  },
  mounted() {
    this.fetchLibris()
  },
}
</script>

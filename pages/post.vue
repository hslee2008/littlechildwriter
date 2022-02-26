<template>
  <div>
    <v-row class="my-1">
      <v-card :width="this.$vuetify.mobile ? 300 : 500">
        <img
          id="isbn"
          src="/logo.png"
          alt="isbn-nothing-to-be-shown"
          style="display: none"
        />

        <v-card-text>
          <v-row style="margin: 0.5px; gap: 10px" class="mb-3" justify="center">
            <v-dialog
              v-model="isbn.isGoingToTakeVideoISBN"
              :width="$vuetify.breakpoint.xs ? '90%' : '70%'"
              height="90%"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                  ><v-icon left>mdi-camera</v-icon> 비디오
                </v-btn>
              </template>

              <v-card
                height="100%"
                width="100%"
                v-if="isbn.isGoingToTakeVideoISBN"
              >
                <div id="container">
                  <video autoplay="true" id="videoElement" width="100%"></video>
                </div>
                <v-card-actions>
                  <v-btn @click="asCamera">카메라</v-btn>
                  <v-btn @click="takeCamera">ISBN 바코드 찍기</v-btn>
                  <v-btn
                    @click="isbn.isGoingToTakeVideoISBN = false"
                    color="red"
                    ><v-icon left>mdi-close-outline</v-icon>취소</v-btn
                  ></v-card-actions
                >
              </v-card>
            </v-dialog>

            <v-divider vertical></v-divider>

            <v-dialog v-model="isbn.isGoingToTakeISBNPicture" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                  ><v-icon left>mdi-camera</v-icon> 사진 찍기
                </v-btn>
              </template>

              <v-card>
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  color="white"
                  class="mb-0"
                ></v-progress-linear>
                <v-card-title> IBSN 사진 찍기 </v-card-title>

                <br />

                <v-card-text>
                  <v-file-input
                    type="file"
                    accept="image/*"
                    @change="uploadFile($event)"
                    label="ISBN 사진"
                    color="grey"
                    outlined
                    dense
                  />
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    text
                    @click="isbn.isGoingToTakeISBNPicture = false"
                  >
                    취소
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-divider vertical></v-divider>

            <v-dialog v-model="isbn.showIsbn" width="500">
              <template v-slot:activator="{ on, attrs }">
                <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                  ><v-icon left>mdi-book-alphabet</v-icon> ISBN 직접 입력</v-btn
                >
              </template>

              <v-card>
                <v-progress-linear
                  v-if="loading"
                  indeterminate
                  color="white"
                  class="mb-0"
                ></v-progress-linear>
                <v-card-title> IBSN 직접 입력 </v-card-title>

                <br />

                <v-card-text>
                  <v-text-field
                    dense
                    label="ISBN"
                    v-model="post.isbn"
                    v-if="isbn.showIsbn"
                    @click:append="fetchi"
                    append-icon="mdi-database-import"
                  ></v-text-field>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" text @click="isbn.showIsbn = false">
                    취소
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-row>

          <v-divider></v-divider>

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
            class=""
          />

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
            ></v-rating>
          </v-row>
          <v-form>
            <v-text-field
              label="제목"
              v-model="post.title"
              :hint="post.subtitle"
            ></v-text-field>
            <v-text-field label="작가" v-model="post.author"></v-text-field>

            <div class="text--primary">
              <v-textarea
                label="책 소개"
                hint="아직 책을 읽지 않은 사람들에게 책을 요약하세요!"
                v-model="post.content"
              ></v-textarea>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="teal accent-7" @click="postcontent" elevation="0">
            올리기<v-icon right>mdi-note-plus</v-icon>
          </v-btn>

          <v-btn to="/list" elevation="0" text color="error">
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

      <div style="margin: auto">
        <v-img
          :src="post.image"
          v-if="post.image"
          laxy-src="https://i.pinimg.com/originals/6b/67/cb/6b67cb8a166c0571c1290f205c513321.gif"
        />
      </div>
    </v-row>
  </div>
</template>

<script>
import { db, storage, auth } from '../plugins/firebase.js'
import 'firebase/compat/database'
import minify from 'url-minify'

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
      isbn: {
        isGoingToTakeVideoISBN: false,
        isGoingToTakeISBNPicture: false,
        showIsbn: false,
      },
      loading: false,
      error: '',
      libris: 0,
    }
  },
  methods: {
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
              alert('알 수 없는 에러!')
              this.isbn.isGoingToTakeISBNPicture = false
            })
        }
      } catch (err) {
        alert(err.message)
        this.isbn.isGoingToTakeISBNPicture = false
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
              this.isbn.isGoingToTakeISBNPicture = false
            })
            .catch((err) => {
              alert(
                'ISBN을 인식하지 못했습니다. 바코드가 흐리게 보이지 않게 멀리 다시 찍어 주세요.'
              )
            })
        }
      } catch (err) {
        alert('카메라 사용 불가: ' + err.message)
        this.isbn.isGoingToTakeISBNPicture = false
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
                this.isbn.isGoingToTakeVideoISBN = false
                this.fetchi()
                this.isbn.isGoingToTakeISBNPicture = false
              })
              .catch((err) =>
                alert(
                  'ISBN을 인식하지 못했습니다. 바코드가 흐어게 보이지 않게 멀리 다시 찍어 주세요.'
                )
              )
          } else {
            alert('카메라 사용 불가능합니다. 핸드폰에서만 가능합니다.')
            this.isbn.isGoingToTakeISBNPicture = false
          }
        }
      }

      reader.readAsDataURL(e)
    },
    uploadImageFile(e) {
      let reader = new FileReader()
      reader.onload = async () => (this.post.image = reader.result)

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

          this.updateLibris()
        }
      })

      this.$router.push('/list')
    },
    async updateLibris() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await db
            .ref(`/users/${user.uid}/libris`)
            .once('value')
            .then(
              async (snapshot) =>
                await db
                  .ref(`/users/${user.uid}/libris`)
                  .set(parseInt(snapshot.val()) + 1)
            )
        }
      })
    },
    async fetchi() {
      this.loading = true
      this.error = ''

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
      )
        .then((res) => res.json())
        .then((json) => {
          if (json.totalItems === 0) {
            this.error = '이미지를 찾을 수 없습니다. '
          } else {
            this.post.title = json.items[0].volumeInfo.title
            this.post.author = json.items[0].volumeInfo.authors[0]
            this.post.image = json.items[0].volumeInfo.imageLinks.thumbnail
            this.post.previewLink = json.items[0].volumeInfo.previewLink
            this.post.pageCount = json.items[0].volumeInfo.pageCount

            if (this.post.pageCount === undefined) {
              this.post.pageCount = 0
            }
          }
        })
        .catch((err) => {
          this.error = '이미지를 찾을 수 없습니다. '
        })

      this.isbn.showIsbn = false
      this.loading = false
    },
  },
}
</script>

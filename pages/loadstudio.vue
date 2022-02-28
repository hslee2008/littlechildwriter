<template>
  <div>
    <v-card class="my-3">
      <v-btn
        tile
        small
        to="/studios"
        elevation="0"
        :block="$vuetify.breakpoint.mobile"
        :color="!$vuetify.breakpoint.mobile ? 'rgb(0, 0, 0, 0)' : 'normal'"
      >
        <v-icon left>mdi-arrow-left</v-icon> 뒤로가기</v-btn
      >

      <div class="cardy">
        <div class="mx-auto">
          <p>by {{ studioInfo.creator }}</p>
          <img
            :src="studioInfo.image === undefined ? '' : studioInfo.image"
            width="200"
            class="my-4 rounded-lg"
          />
          <v-card-title> {{ studioInfo.name }} </v-card-title>
          <v-card-subtitle>{{
            new Date(studioInfo.lastUpdated).toLocaleDateString()
          }}</v-card-subtitle>
        </div>

        <div style="margin: auto; padding: 10px">
          <v-card-text>
            <p class="my-5">{{ studioInfo.description }}</p>
          </v-card-text>
        </div>
      </div>
    </v-card>

    <v-row style="margin-left: 0.5px; margin-top: 1px; gap: 20px">
      <div>
        <v-card :width="this.$vuetify.mobile ? '100%' : 350">
          <img
            ref="isbn"
            src="/logo.png"
            alt="isbn-nothing-to-be-shown"
            style="display: none"
          />

          <v-card-text>
            <v-row style="margin: 1px">
              <div style="margin: auto">
                {{ new Date().toLocaleDateString() }}
              </div>
            </v-row>
            <v-form>
              <v-text-field
                label="제목"
                v-model="post.title"
                :hint="post.subtitle"
              ></v-text-field>
              <v-text-field label="이름" v-model="post.author"></v-text-field>
            </v-form>
          </v-card-text>

          <v-card-actions style="gap: 5px">
            <v-btn color="teal accent-7" @click="postcontent" elevation="0">
              올리기<v-icon right>mdi-note-plus</v-icon>
            </v-btn>
            <v-dialog v-model="dialog" width="500">
              <template v-slot:activator="{ on, attrs }">
                <div class="text-center">
                  <v-btn color="red lighten-2" dark v-bind="attrs" v-on="on">
                    나의 포스트 선택
                  </v-btn>
                </div>
              </template>

              <v-card>
                <v-card-title> 포스트 선택하기 </v-card-title>

                <v-card-text>
                  <v-card
                    v-for="item in mine.filter((item) => item.uid == this.uid)"
                    :key="item.title"
                    class="d-flex"
                  >
                    <v-card-title> {{ item.title }} </v-card-title>
                    <v-card-actions
                      ><v-btn
                        @click="
                          post.thelink = `/content/${item.uid}-${item.time}`
                          dialog = false
                        "
                        >업로드</v-btn
                      ></v-card-actions
                    >
                  </v-card>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="error" text @click="dialog = false">
                    취소
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
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
      </div>

      <div>
        <v-card
          v-for="(posts, index) in studioInfo.contents"
          :key="posts.time"
          class="d-flex"
        >
          <v-img :src="posts.image" />

          <div>
            <v-card-title>{{ posts.title }}</v-card-title>
            <v-card-subtitle>by {{ posts.username }}</v-card-subtitle>
            <v-card-text>
              {{
                new Date(parseInt(posts.time)).getMonth() +
                '월 ' +
                new Date(parseInt(posts.time)).getDate() +
                '일'
              }}
            </v-card-text>
            <v-card-actions>
              <v-btn :to="posts.thelink">
                <v-icon left>mdi-open-in-new</v-icon>
                열기
              </v-btn>
            </v-card-actions>
          </div>
        </v-card>
      </div>
    </v-row>

    <br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'

export default {
  data() {
    return {
      studioInfo: {},
      mine: [],

      post: {
        title: '',
        subtitle: '',
        content: '',
        rating: 0,
        isbn: '',
        author: [],
        contents: [],
        previewLink: '',
        image: '',
        pageCount: 0,
        likes: 0,
        thelink: '',
      },
      isbn: {
        videoBarcode: false,
        pictureBarcode: false,
        inputISBN: false,
      },

      loading: false,
      dialog: false,
      error: '',
      libris: 0,
      uid: '',

      subscribers: [],
      username: '',
    }
  },
  methods: {
    fetchStudio() {
      db.ref('studios')
        .child(this.$route.query.id)
        .once('value')
        .then((s) => {
          this.studioInfo = s.val()
        })
    },
    showCamera() {
      try {
        if (navigator.mediaDevices.getUserMedia)
          navigator.mediaDevices
            .getUserMedia({
              video: {
                facingMode: 'environment',
                width: { ideal: 4096 },
                height: { ideal: 2160 },
              },
            })
            .then((s) => (this.$refs.video.srcObject = s))
            .catch((e) => {
              this.isbn.pictureBarcode = false
              this.error = '알 수 없는 에러!'
            })
      } catch (err) {
        this.isbn.pictureBarcode = false
        this.error = err.message
      }
    },
    takeISBNBarcodePictureFromVideo() {
      try {
        if ('BarcodeDetector' in window)
          new BarcodeDetector({
            formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
          })
            .detect(this.$refs.video)
            .then((res) => res[0].value)
            .then(async (a) => {
              this.post.isbn = JSON.stringify(a, null, 2).replace(/\"/g, '')
              this.fetchi()
              this.isbn.pictureBarcode = false
            })
            .catch(() =>
              alert('바코드가 흐리게 보이지 않게 멀리 다시 찍어 주세요.')
            )
      } catch (err) {
        alert('카메라 사용 불가: ' + err.message)
        this.isbn.pictureBarcode = false
      }
    },
    uploadFile(e) {
      let reader = new FileReader()

      reader.onload = () => {
        this.$refs.isbn.src = reader.result

        let tempImage = new Image()
        tempImage.src = reader.result

        tempImage.onload = () => {
          if ('BarcodeDetector' in window) {
            new BarcodeDetector({
              formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
            })
              .detect(this.$refs.isbn)
              .then((res) => res[0].rawValue)
              .then((a) => {
                this.post.isbn = JSON.stringify(a, null, 2).replace(/\"/g, '')
                this.isbn.videoBarcode = false
                this.fetchi()
                this.isbn.pictureBarcode = false
              })
              .catch((err) =>
                alert(
                  'ISBN을 인식하지 못했습니다. 바코드가 흐어게 보이지 않게 멀리 다시 찍어 주세요.'
                )
              )
          } else {
            alert('카메라 사용 불가능합니다. 핸드폰에서만 가능합니다.')
            this.isbn.pictureBarcode = false
          }
        }
      }

      reader.readAsDataURL(e)
    },
    async postcontent() {
      const timestamp = Date.now()

      await auth.onAuthStateChanged(async (user) => {
        if (user) {
          const database = db.ref(`/studios/${this.$route.query.id}/contents`)

          database.push({
            title: this.post.title,
            uid: user.uid,
            time: timestamp,
            username: user.displayName,
            thelink: this.post.thelink,
          })

          this.updateLibris()
          location.reload()
        } else {
          alert('로그인이 필요합니다.')

          this.$route.push('/login')
        }
      })
    },
    async updateLibris() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          await db
            .ref(`users/${user.uid}/libris`)
            .transaction((currentValue) => {
              if (this.post.pageCount < 100) currentValue + 1
              else if (this.post.pageCount < 300) currentValue + 2
              else if (this.post.pageCount < 500) currentValue + 4
              else currentValue + 5
            })
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
          if (json.totalItems === 0) this.error = '이미지를 찾을 수 없습니다. '
          else
            this.post = {
              ...this.post,
              title: json.items[0].volumeInfo.title,
              image: json.items[0].volumeInfo.imageLinks.thumbnail,
              previewLink: json.items[0].volumeInfo.previewLink,
              pageCount: json.items[0].volumeInfo.pageCount,
            }
        })
        .catch((err) => (this.error = '이미지를 찾을 수 없습니다. '))

      this.isbn.inputISBN = false
      this.loading = false
    },
    getSubscribers(uid) {
      db.ref(`/users/${uid}/subscriber`)
        .once('value')
        .then((s) => (this.subscribers = Object.keys(s.val() ?? [])))
    },
    fetchUsers() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.uid = user.uid
          this.username = user.displayName
          this.post.author = user.displayName
          this.getSubscribers(user.uid)

          db.ref('/contents/')
            .orderByKey()
            .on('child_added', async (s) => {
              const data = await s.val().posts
              const keys = Object.keys(data)

              for (let i = 0; i < keys.length; i++) {
                this.mine.unshift(data[keys[i]])
              }
            })

          this.mine.sort((a, b) => a.time - b.time)
        }
      })
    },
  },
  async mounted() {
    this.fetchStudio()
    this.fetchUsers()
  },
}
</script>

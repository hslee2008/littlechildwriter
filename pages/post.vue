<template>
  <v-row class="ma-1">
    <v-card :width="this.$vuetify.mobile ? 300 : 500" class="ma-auto">
      <div class="d-none">
        <img
          ref="isbn"
          src="/logo.avif"
          alt="isbn-nothing-to-be-shown"
          class="d-none"
        />

        <v-file-input
          ref="file"
          type="file"
          accept="image/*"
          @change="uploadImageFile($event)"
          label="책 사진"
          color="grey"
          outlined
          dense
          prepend-icon="mdi-upload"
        />
      </div>

      <v-card-text>
        <v-row style="margin: 0.5px; gap: 10px" class="mb-3" justify="center">
          <v-btn @click="$refs.file.$refs.input.click()" text class="mr-auto">
            <v-icon left>mdi-upload</v-icon> 사진
          </v-btn>

          <v-dialog
            v-model="isbn.videoBarcode"
            :width="$vuetify.breakpoint.xs ? '90%' : '70%'"
            height="90%"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                ><v-icon>mdi-barcode-scan</v-icon>
              </v-btn>
            </template>

            <v-card height="100%" width="100%" v-if="isbn.videoBarcode">
              <div id="container">
                <video
                  autoplay="true"
                  id="videoElement"
                  ref="video"
                  width="100%"
                ></video>
              </div>
              <v-card-actions>
                <v-btn @click="showCamera">카메라</v-btn>
                <v-btn @click="takeISBNBarcodePictureFromVideo"
                  >ISBN 바코드 찍기</v-btn
                >
                <v-btn @click="isbn.videoBarcode = false" color="red"
                  ><v-icon left>mdi-close-outline</v-icon>취소</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-divider vertical></v-divider>

          <v-dialog v-model="isbn.pictureBarcode" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                ><v-icon>mdi-barcode</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-progress-linear
                v-if="loading"
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
              <v-card-title> IBSN 사진 </v-card-title>

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

              <v-divider />

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  text
                  @click="isbn.pictureBarcode = false"
                >
                  취소
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-divider vertical></v-divider>

          <v-dialog v-model="isbn.inputISBN" width="500">
            <template v-slot:activator="{ on, attrs }">
              <v-btn elevation="0" color="primary" v-bind="attrs" v-on="on"
                ><v-icon>mdi-form-textbox</v-icon></v-btn
              >
            </template>

            <v-card>
              <v-progress-linear
                v-if="loading"
                indeterminate
                color="white"
                class="mb-0"
              ></v-progress-linear>
              <v-card-title> 입력 </v-card-title>

              <br />

              <v-card-text>
                <v-text-field
                  dense
                  autofocus
                  label="ISBN"
                  v-model="post.isbn"
                  v-if="isbn.inputISBN"
                  @click:append="fetchi"
                  v-on:keyup.enter="fetchi"
                  append-icon="mdi-database-import"
                />
              </v-card-text>

              <v-divider />

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="isbn.inputISBN = false">
                  취소
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>

        <v-divider />

        <v-row class="my-10">
          <v-rating
            v-model="post.rating"
            color="blue"
            required
            size="30"
            class="mx-auto"
          />
        </v-row>

        <v-form>
          <v-text-field
            label="제목"
            v-model="post.title"
            :hint="post.subtitle"
          />

          <v-row style="margin-left: 0.5px; margin-right: 0.5px; gap: 10px">
            <v-text-field label="작가" v-model="post.author" />
            <v-text-field label="페이지" v-model="post.pageCount" />
          </v-row>

          <div class="text--primary">
            <v-textarea
              label="책 소개"
              hint="아직 책을 읽지 않은 사람들에게 책을 요약하세요!"
              v-model="post.content"
            />
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions style="gap: 5px">
        <v-btn color="teal accent-7" @click="postcontent" elevation="0">
          올리기<v-icon right>mdi-note-plus</v-icon>
        </v-btn>

        <Dialog
          :functionOk="() => this.$router.push('/list')"
          buttonTitle="취소"
          title="진짜로 취소하겠습니까?"
          text="취소하면 복구할 수 없습니다"
          icon="arrow-left"
        />

        <div style="margin: auto">
          {{ new Date().toLocaleDateString() }}
        </div>
      </v-card-actions>

      <v-alert dense outlined type="error" v-if="error" style="margin: 10px">{{
        error
      }}</v-alert>
    </v-card>

    <div style="margin: auto">
      <v-chip-group active-class="primary--text" column>
        <v-chip
          v-for="tag in post.categories"
          :key="tag"
          ripple
          disabled
          outlined
          label
        >
          #{{ tag }}
        </v-chip>
      </v-chip-group>

      <v-img :src="post.image" v-if="post.image" class="rounded-lg" />
    </div>
  </v-row>
</template>

<script>
import { db, auth } from '../plugins/firebase.js';

export default {
  name: 'PostPage',
  data() {
    return {
      post: {},

      isbn: {
        videoBarcode: false,
        pictureBarcode: false,
        inputISBN: false,
      },

      loading: false,
      error: '',
      libris: 0,
      uid: '',

      subscribers: [],
      username: '',
    };
  },
  methods: {
    showCamera() {
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
            this.isbn.pictureBarcode = false;
            makeError('알 수 없는 에러!');
          });
    },
    takeISBNBarcodePictureFromVideo() {
      if ('BarcodeDetector' in window)
        new BarcodeDetector({
          formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
        })
          .detect(this.$refs.video)
          .then((res) => res[0].value)
          .then(async (a) => {
            this.post.isbn = JSON.stringify(a, null, 2).replace(/\"/g, '');
            this.fetchi();
            this.isbn.videoBarcode = false;
          })
          .catch((e) =>
            alert(
              '바코드가 흐리게 보이지 않게 멀리 다시 찍어 주세요. ' + e.message
            )
          );
      else {
        alert('카메라 사용 불가: ' + err.message);
        this.isbn.pictureBarcode = false;
      }
    },
    uploadFile(e) {
      let reader = new FileReader();

      reader.onload = () => {
        this.$refs.isbn.src = reader.result;

        let tempImage = new Image();
        tempImage.src = reader.result;

        tempImage.onload = () => {
          if ('BarcodeDetector' in window) {
            new BarcodeDetector({
              formats: ['code_39', 'codabar', 'ean_13', 'ean_8'],
            })
              .detect(this.$refs.isbn)
              .then((res) => res[0].rawValue)
              .then((a) => {
                this.post.isbn = JSON.stringify(a, null, 2).replace(/\"/g, '');
                this.isbn.videoBarcode = false;
                this.fetchi();
                this.isbn.pictureBarcode = false;
              })
              .catch((err) =>
                alert(
                  'ISBN을 인식하지 못했습니다. 바코드가 흐어게 보이지 않게 멀리 다시 찍어 주세요.'
                )
              );
          } else {
            alert('카메라 사용 불가능합니다. 핸드폰에서만 가능합니다.');
            this.isbn.pictureBarcode = false;
          }
        };
      };

      reader.readAsDataURL(e);
    },
    uploadImageFile(e) {
      let reader = new FileReader();
      reader.onload = async () => (this.post.image = reader.result);
      reader.readAsDataURL(e);
    },
    makeError(e) {
      this.error = e;

      setTimeout(() => {
        this.error = '';
      }, 3000);
    },
    async postcontent() {
      if (!this.post.rating) {
        makeError('평점을 입력해주세요');
        return;
      }

      this.post.time = Date.now();

      await this.updateLibris(this.uid);

      db.ref('/contents/' + this.post.time).set({
        title: this.post.title,
        content: this.post.content,
        rating: this.post.rating,
        isbn: this.post.isbn,
        uid: this.uid,
        time: this.post.time,
        username: this.username,
        image: this.post.image,
        previewLink: this.post.previewLink,
        pageCount: this.post.pageCount,
        categories: this.post.categories,
        likes: 1,
        liked: {
          [this.uid]: true,
        },
        views: 1,
      });

      this.notifySubscribers();

      this.$router.push('/list');
    },
    async notifySubscribers() {
      for (let i = 0; i < this.subscribers.length; i++) {
        await db.ref(`users/${this.subscribers[i]}/notification`).push({
          title: `${this.username}님이 새로운 글을 올렸습니다!`,
          time: timestamp,
          type: 'subscription',
          link: `/content/${this.uid}-${this.post.time}`,
        });
      }
    },
    updateLibris(uid) {
      const LibrisDatabase = `/users/${uid}/libris`;

      db.ref(LibrisDatabase).once('value', (s) =>
        db
          .ref(LibrisDatabase)
          .set(parseInt(s.val()) + this.post.pageCount / 100)
      );
    },
    async fetchi() {
      this.loading = true;
      this.error = '';

      await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${this.post.isbn}`
      )
        .then((res) => res.json())
        .then((json) => {
          const volume = json.items[0].volumeInfo;

          if (json.totalItems === 0) makeError('이미지를 찾을 수 없습니다');
          else
            this.post = {
              ...this.post,
              title: volume.title,
              image: volume.imageLinks.thumbnail,
              previewLink: volume.previewLink,
              pageCount: volume.pageCount,
              author: volume.authors,
              categories: volume.categories,
            };
        })
        .catch((err) => makeError('알 수 없는 에러'));

      this.isbn.inputISBN = false;
      this.loading = false;
    },
    getSubscribtion(uid) {
      db.ref(`/users/${uid}/subscriber`)
        .once('value')
        .then((s) => {
          this.subscription = Object.keys(s.val()) ?? [];
        });
    },
  },
  created() {
    auth.onAuthStateChanged(async (u) => {
      if (u) {
        this.uid = u.uid;
        this.username = u.displayName;
        this.getSubscribtion(u.uid);
      }
    });
  },
};
</script>

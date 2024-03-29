<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <div class="d-flex justify-center">
      <v-img :src="post.image" class="rounded-lg mt-2" max-width="150" />
    </div>
    <v-card-item>
      <v-row class="my-5">
        <v-rating
          v-model="post.rating"
          color="blue"
          required
          ripple
          hover
          half-increments
          class="mx-auto"
        />
      </v-row>

      <v-text-field v-model="post.title" variant="outlined" label="제목" />

      <v-row class="g-10" style="margin: 0.5px 0">
        <v-text-field
          v-model="post.pageCount"
          variant="outlined"
          label="페이지"
          type="number"
          :rules="[isPageCountValid]"
        />
        <v-text-field v-model="post.author" variant="outlined" label="작가" />
      </v-row>

      <v-combobox
        v-model="post.categories"
        :items="post.categories"
        chips
        clearable
        label="카테고리"
        multiple
        variant="outlined"
      >
        <template #selection="{ item }">
          <v-chip close @click:close="remove(item)">
            <strong>{{ item }}</strong>
          </v-chip>
        </template>
      </v-combobox>

      <v-textarea
        v-model="post.content"
        label="책 소개"
        clearable
        counter
        variant="underlined"
      />
    </v-card-item>

    <v-dialog v-model="isbn.upload" width="500">
      <v-card color="#212121">
        <v-card-title class="text-center"> 책 사진 업로드 </v-card-title>

        <v-tabs v-model="tab" grow>
          <v-tab> 기기에서 업로드 </v-tab>
          <v-tab> URL로 업로드 </v-tab>
        </v-tabs>

        <v-card-item>
          <div class="d-flex justify-center">
            <v-img :src="post.image" class="rounded-lg mb-2" max-width="150" />
          </div>

          <v-window v-model="tab">
            <v-window-item class="pt-3">
              <v-file-input
                accept="image/*"
                outlined
                dense
                variant="underlined"
                label="책 사진을 선택하세요"
                @update:model-value="uploadImg($event)"
              />
            </v-window-item>

            <v-window-item class="py-5">
              <v-textarea
                v-model="post.image"
                variant="outlined"
                label="책 사진의 URL을 입력하세요"
              />
            </v-window-item>
          </v-window>
        </v-card-item>

        <v-card-actions>
          <v-btn rounded="lg" variant="tonal" @click="isbn.upload = false">
            닫기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.barcode" width="500">
      <v-card color="#212121">
        <v-card-title> IBSN 사진 </v-card-title>

        <v-tabs v-model="tab" grow>
          <v-tab> 이미지로 </v-tab>
          <v-tab> 카메라로 </v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="tab">
            <v-window-item class="pt-3">
              <v-file-input
                type="file"
                accept="image/*"
                label="ISBN 사진"
                color="grey"
                variant="outlined"
                dense
                @update:model-value="uploadFile($event)"
              />
            </v-window-item>

            <v-window-item class="pt-3 text-center">
              <video id="video" width="320" height="240" />

              <v-card-actions class="flex justify-center">
                <v-btn rounded="lg" variant="tonal" @click="showCamera">
                  시작
                </v-btn>
                <v-btn rounded="lg" variant="tonal" @click="takeISBNVideo">
                  ISBN 바코드 찍기
                </v-btn>
              </v-card-actions>
            </v-window-item>
          </v-window>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" @click="isbn.barcode = false">
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.audio" width="500">
      <v-card color="#212121">
        <v-card-title> 보이스 타이핑 </v-card-title>

        <br />

        <v-card-text>
          <v-select
            v-model="isbn.audioType"
            variant="outlined"
            :items="['en-US', 'ko-KR']"
            label="보이스 타이핑 언어"
          />
          <v-textarea v-model="typed" variant="outlined" clearable counter />
        </v-card-text>

        <v-card-actions>
          <v-btn rounded="lg" variant="tonal" @click="voiceType"> 시작 </v-btn>
          <v-spacer />
          <v-btn
            rounded="lg"
            variant="tonal"
            color="red"
            @click="isbn.barcode = false"
          >
            취소
          </v-btn>
          <v-btn
            rounded="lg"
            variant="tonal"
            color="primary"
            @click="saveAudio"
          >
            확인
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.input" width="500">
      <v-card color="#212121">
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
            variant="outlined"
            autofocus
            label="ISBN"
            class="isbn"
            @keyup.enter="fetchi"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" @click="isbn.input = false">
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="isbn.find" width="700">
      <v-card color="#212121">
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
            variant="outlined"
            autofocus
            label="책 제목"
            @keyup.enter="FetchWithTitle"
          />
        </v-card-text>

        <v-list v-if="searched" nav bg-color="#212121">
          <div
            v-for="item in searched"
            :key="item.volumeInfo.industryIdentifiers[0].identifier"
          >
            <v-list-item
              @click="
                FetchBook(item.volumeInfo.industryIdentifiers[0].identifier)
              "
            >
              <template #prepend>
                <v-avatar size="100" rounded="0">
                  <v-img
                    :src="item.volumeInfo.imageLinks?.thumbnail"
                    class="mr-4 ma-2 rounded-lg"
                    max-width="100"
                  />
                </v-avatar>
              </template>

              <v-list-item-title class="text-primary h1">
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
            </v-list-item>
          </div>
        </v-list>
        <v-card v-else class="text-center" flat>
          <v-card-text>
            책을 찾을 수 없습니다. ISBN을 직접 입력하거나 바코드를 찍으세요.
          </v-card-text>
        </v-card>

        <v-card-actions>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" @click="isbn.find = false">
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-card-actions class="g-10">
      <v-btn rounded="lg" variant="tonal" color="primary" @click="Post">
        업로드
      </v-btn>

      <v-btn rounded="lg" variant="tonal" append-icon="mdi-chevron-down">
        책 정보 입력

        <v-menu bottom activator="parent">
          <v-list>
            <v-list-item @click="isbn.upload = true">
              <v-icon start> mdi-upload </v-icon> 책 사진 업로드
            </v-list-item>
            <v-list-item v-if="mobile" @click="isbn.barcode = true">
              <v-icon start> mdi-barcode-scan </v-icon> ISBN 촬영
            </v-list-item>
            <v-list-item @click="isbn.input = true">
              <v-icon start> mdi-form-textbox </v-icon> ISBN 입력
            </v-list-item>
            <v-list-item @click="isbn.find = true">
              <v-icon start> mdi-book-search </v-icon> 책 찾기
            </v-list-item>
            <v-list-item @click="isbn.audio = true">
              <v-icon start> mdi-microphone </v-icon> 보이스 타이핑
            </v-list-item>
          </v-list>
        </v-menu>
      </v-btn>
    </v-card-actions>

    <v-snackbar v-model="snackbar" color="white">
      제목, 작가, 페이지, 책 소개, 카테고리를 모두 입력해 주세요.

      <template #actions>
        <v-btn
          rounded="lg"
          variant="tonal"
          color="pink"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
    <v-snackbar v-model="notfound" color="white">
      찾을 수 없었습니다.

      <template #actions>
        <v-btn
          rounded="lg"
          variant="tonal"
          color="pink"
          @click="notfound = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import { BrowserBarcodeScanner } from 'browser-barcodescanner'
import { createToaster } from '@meforma/vue-toaster'

import { useDisplay } from 'vuetify'
const { $db, $storage } = useNuxtApp()
const toaster = createToaster({ position: 'top-right', dismissible: true })

const userInfo = User()
const { mobile } = useDisplay()
const post = ref<any>({
  isbn: '',
  title: '',
  image: '',
  pageCount: '',
  categories: ['Juvenile Fiction / General'] as string[],
  rating: 5,
  content: '',
  uid: '',
  displayName: '',
  author: '',
  views: 0,
  time: Date.now()
})
const isbn = ref<any>({
  barcode: false,
  input: false,
  find: false,
  audio: false,
  upload: false,
  audioType: ''
})

const loading = ref<boolean>(false)
const title = ref<string>('')
const searched = ref<any>({})
const typed = ref<string>('')
const snackbar = ref<boolean>(false)
const notfound = ref<boolean>(false)
const tab = ref<any>(0)

const remove = (item: any) => {
  post.value.categories.splice(post.value.categories.indexOf(item), 1)
}

const FetchBook = (bookISBN: string) => {
  post.value.isbn = bookISBN
  fetchi()
  isbn.value.find = false
}

const FetchWithTitle = async () => {
  loading.value = true

  await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=intitle:${title.value}`
  )
    .then(res => res.json())
    .then(books => (searched.value = books.items))
    .catch((e: Error) =>
      toaster.error(`Error while fetching with title info: ${e}`)
    )

  loading.value = false
}

const showCamera = () => {
  navigator.mediaDevices
    .getUserMedia({
      video: {
        facingMode: 'environment',
        width: { ideal: 4096 },
        height: { ideal: 2160 }
      }
    })
    .then(s => {
      const videoElement = document.querySelector('#video') as HTMLVideoElement
      videoElement.srcObject = s
      videoElement.onloadedmetadata = () => videoElement.play()
    })
    .catch((e: Error) => toaster.error(`Error while showing camera: ${e}`))
}

const takeISBNVideo = () => {
  BrowserBarcodeScanner(
    ['ean_13'],
    document.querySelector('#video') as HTMLVideoElement,
    (result: { res: string }) => {
      post.value.isbn = result.res
      isbn.value.barcode = false
      fetchi()
    }
  )
}

const uploadFile = (file: File[]) => {
  BrowserBarcodeScanner(['ean_13'], file[0], (result: { res: string }) => {
    post.value.isbn = result.res
    isbn.value.barcode = false
    fetchi()
  })
}
const fetchi = () => {
  loading.value = true

  fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${post.value.isbn}`)
    .then(res => res.json())
    .then(async res => {
      if (res.items[0].volumeInfo.imageLinks) {
        const {
          title,
          imageLinks: { thumbnail: image },
          authors: author,
          pageCount
        } = res.items[0].volumeInfo

        const categories = await fetch(res.items[0].selfLink)
          .then(cg => cg.json())
          .then(cg => cg.volumeInfo.categories)
          .catch((e: Error) =>
            toaster.error(`Error while fetching categories: ${e}`)
          )

        post.value = {
          ...post.value,
          title,
          image,
          pageCount,
          author,
          categories
        }
        post.value.categories = categories
      } else {
        const { title, authors: author, pageCount } = res.items[0].volumeInfo

        post.value = {
          ...post.value,
          title,
          pageCount,
          author,
          image:
            'https://books.google.co.kr/googlebooks/images/no_cover_thumb.gif',
          categories: ['Juvenile Fiction / General']
        }
      }

      isbn.value.input = false
    })
    .catch((e: Error) => toaster.error(`Error while fetching books: ${e}`))

  loading.value = false
}

const uploadImg = (f: File[]) => {
  const storageRef = $storage.ref('bookimages')
  const fileRef = storageRef.child(f[0].name)
  fileRef
    .put(f[0])
    .then(() => {
      fileRef
        .getDownloadURL()
        .then((url: any) => {
          post.value.image = url
        })
        .catch((e: Error) =>
          toaster.error(`Error while getting url of image: ${e}`)
        )
    })
    .catch((e: Error) =>
      toaster.error(`Error while saving uploaded image: ${e}`)
    )
}

const Post = () => {
  const { uid, displayName } = userInfo
  const {
    title,
    content,
    rating,
    isbn,
    time,
    image,
    pageCount,
    categories,
    author
  } = post.value

  if (!title || !content || !pageCount || !author || categories?.length === 0) {
    snackbar.value = true
    return
  }

  if (pageCount > 1000) {
    alert('최대 페이지 수는 1000페이지입니다.')
    return
  }

  try {
    $db.ref(`/contents/${time}`).set({
      title,
      rating,
      isbn,
      time,
      image,
      pageCount,
      categories,
      likes: 1,
      liked: {
        [userInfo.uid]: true
      },
      views: 0,
      uid,
      displayName,
      content: ToHTML(content)
    })

    Libris(userInfo.uid, parseInt(post.value.pageCount) / 5)
    navigateTo(`/book/content/${time}`)
  } catch (e) {
    toaster.error(`Error while uploading: ${e}`)
    Libris(userInfo.uid, -parseInt(post.value.pageCount) / 5)
  }
}

const voiceType = () => {
  const webkitSpeechRecognition = window.webkitSpeechRecognition
  // eslint-disable-next-line new-cap
  const recognition = new webkitSpeechRecognition()
  recognition.lang = isbn.value.audioType
  recognition.start()

  recognition.onresult = (e: any) => {
    typed.value += e.results[0][0].transcript + '. '
  }

  recognition.onspeechend = () => {
    recognition.stop()
  }

  recognition.onerror = (e: Error) =>
    toaster.error(`Error during recognition: ${e}`)
}

const saveAudio = () => {
  isbn.value.audio = false
  post.value.content += typed.value
  typed.value = ''
}

const isPageCountValid = (v: any) =>
  (!isNaN(parseFloat(v)) && isFinite(v) && v > 0 && v < 10000 && v % 1 === 0) ||
  '옳바른 숫자를 넣어 주세요'

useHead({
  title: '업로드 - LCW'
})
</script>

<template>
  <v-form class="my-10">
    <v-card id="profile" class="mb-10" variant="outlined">
      <v-card-title class="text-center">프로필 설정</v-card-title>

      <div class="d-flex ml-5">
        <v-avatar size="100">
          <UserPhoto :size="45" :src="userInfo?.photoURL" />
        </v-avatar>
        <div>
          <v-card-title>{{ userInfo.displayName }}</v-card-title>
          <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
          <v-card-actions>
            <v-btn
              rounded="lg"
              variant="tonal"
              color="primary"
              class="ml-3 mt-3"
              @click="imageEdit = true"
            >
              이미지 편집
            </v-btn>
          </v-card-actions>
        </div>
      </div>

      <v-card-text>
        <v-textarea
          v-model="userDB.bio"
          auto-grow
          required
          flat
          dense
          variant="outlined"
          label="Bio"
          placeholder="나의 소개"
          class="ma-1"
        />
      </v-card-text>
    </v-card>

    <v-card id="book" class="mb-10" variant="outlined">
      <v-card-title class="text-center">책 추천</v-card-title>
      <v-radio-group v-model="featured" class="ma-3">
        <v-list class="rounded-lg">
          <v-list-item v-for="book in books" :key="book.time">
            <template #prepend>
              <v-radio :key="book.time + '-radio'" :value="book.time" />
            </template>

            <v-list-item-title>{{ book.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-radio-group>
    </v-card>

    <v-card id="advanced" class="mb-10" variant="outlined">
      <v-card-title class="text-center">핀</v-card-title>
      <v-card-text>
        Libris를 사용해서 홈페이지에 원하는 책을 1주일 동안 고정할 수 있습니다.
        <br />
        250 point를 사용하면 1주일 동안 책을 고정할 수 있습니다.
        <br />
        핀을 하나 구매하면 250 point가 줄어듭니다.
      </v-card-text>

      <v-radio-group v-model="pin" class="ma-3">
        <v-list class="rounded-lg">
          <v-list-item v-for="(book, i) in books" :key="book.time">
            <template #prepend>
              <v-radio :key="book.time + '-radio'" :value="i" />
            </template>

            <v-list-item-title>{{ book.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-radio-group>

      <v-card-actions>
        <v-btn
          rounded="lg"
          variant="tonal"
          color="primary"
          class="ml-3 my-3"
          @click="BuyPin"
        >
          핀 구매
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-card id="advanced" class="mb-10" variant="outlined">
      <v-card-title class="text-center">고급 설정</v-card-title>

      <v-card-item>
        <v-text-field
          v-model="userInfo.uid"
          variant="outlined"
          label="UID"
          placeholder="UID"
          flat
          dense
          disabled
          prepend-inner-icon="mdi-account"
        />
        <v-text-field
          v-model="tempName"
          variant="outlined"
          label="이름"
          placeholder="이름 바꾸기"
          required
          flat
          dense
          prepend-inner-icon="mdi-account"
        />
      </v-card-item>
    </v-card>

    <v-dialog v-model="imageEdit" width="500">
      <v-card>
        <v-card-title> 이미지 편집 </v-card-title>

        <v-card-text>
          <div class="text-center mb-3">
            <v-avatar size="100">
              <v-img :src="tempImage" />
            </v-avatar>
          </div>

          <v-text-field
            v-model="tempImage"
            variant="outlined"
            label="URL"
            placeholder="URL"
            required
            flat
            dense
            prepend-inner-icon="mdi-camera"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn
            rounded="lg"
            variant="tonal"
            color="red"
            @click="imageEdit = false"
          >
            취소
          </v-btn>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" color="primary" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center" class="g-10">
      <v-btn
        rounded="lg"
        variant="tonal"
        color="primary"
        prepend-icon="mdi-account"
        @click="Update"
      >
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
const { $db, $auth } = useNuxtApp()

const userInfo = User()
const userDB = ref<any>({ bio: '' })
const books = ref<any[]>([])
const imageEdit = ref<boolean>(false)
const featured = ref<number>(0)
const pin = ref<number>(0)

const tempImage = ref<string>(userInfo.photoURL)
const tempName = ref<string>(userInfo.displayName)

useAuth(() => {
  $db
    .ref(`/users/${userInfo.uid}`)
    .once('value')
    .then(async (s: any) => (userDB.value = await s.val()))

  $db
    .ref(`/users/${userInfo.uid}`)
    .once('value')
    .then(async (s: any) => (featured.value = await s.val().featured))

  $db.ref('/contents/').on('value', async (s: any) => {
    const data = await s.val()

    for (const key in data)
      if (userInfo.is(data[key].uid)) books.value.push(data[key])
  })
})

const Update = () => {
  const { uid } = userInfo
  const { bio } = userDB.value

  $db.ref(`/users/${uid}`).update({
    displayName: tempName.value,
    bio,
    featured: featured.value
  })

  $auth.currentUser?.updateProfile({
    displayName: tempName.value
  })

  navigateTo(`/user/${uid}`)
}
const BuyPin = () => {
  const time = new Date().getTime()

  $db.ref(`/pin/${time}`).set({
    uid: userInfo.uid,
    time,
    book: books.value[pin.value]
  })

  Libris(userInfo.uid, -250)

  navigateTo('/')
}

const save = () => {
  $auth.currentUser?.updateProfile({ photoURL: tempImage.value })
  $db.ref(`/users/${userInfo.uid}`).update({ photoURL: tempImage.value })

  imageEdit.value = false

  navigateTo(`/user/${userInfo.uid}`)
}

useHead({
  title: '계정 - LCW'
})
</script>

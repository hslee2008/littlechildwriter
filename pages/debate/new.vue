<template>
  <div>
    <h1>새로운 주제</h1>

    <v-text-field
      v-model="debate.topic"
      label="주제"
      placeholder="주제 / 질문 입력하기"
      outlined
      clearable
      class="mt-3"
    />

    <v-col class="d-flex" cols="12" sm="6">
      <v-select v-model="debate.lang" :items="lang" width="300" />
    </v-col>

    <v-btn text primary @click="upload">
      <v-icon>mdi-plus</v-icon>
      게시
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { db } from 'plugins/firebase'
import { User } from 'plugins/global'

const userInfo = User()
const router = useRouter()
const lang = ref(['한국어', 'English'])
const debate = ref({
  topic: '',
  created_at: '',
  uid: '',
  photoURL: '',
  lang: '한국어'
})

const upload = () => {
  const { uid, photoURL, displayName } = userInfo.value
  const { topic } = debate.value
  const time = Date.now()

  db.ref(`/debate/${time}`).set({
    topic,
    time,
    uid,
    photoURL,
    displayName
  })

  router.push(`/debate/topic/${time}`)
}
</script>

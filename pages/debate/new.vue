<template>
  <div>
    <h1>새로운 주제</h1>

    <v-text-field
      :model-value="debate.topic"
      label="주제"
      placeholder="주제 / 질문 입력하기"
      variant="solo"
      clearable
      class="mt-3"
    />

    <v-col class="d-flex" cols="12" sm="6">
      <v-select :model-value="debate.lang" :items="lang" width="300" />
    </v-col>

    <v-btn text primary @click="upload">
      <v-icon>mdi-plus</v-icon>
      게시
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp();

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

  $db.ref(`/debate/${time}`).set({
    topic,
    time,
    uid,
    photoURL,
    displayName
  })

  Libris(uid, 10)

  router.push(`/debate/topic/${time}`)
}
</script>

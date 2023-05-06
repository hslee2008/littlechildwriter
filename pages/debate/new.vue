<template>
  <div>
    <h1>새로운 주제</h1>

    <v-text-field
      v-model="debate.topic"
      variant="outlined"
      label="주제"
      placeholder="주제 / 질문 입력하기"
      clearable
      class="mt-3"
    />

    <v-btn
      rounded="lg"
      variant="tonal"
      primary
      prepend-icon="mdi-plus"
      @click="upload"
    >
      게시
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const debate = ref({
  topic: '',
  created_at: '',
  uid: '',
  photoURL: '',
  lang: '한국어'
})

const AddNewUser = () => {
  $db.ref(`/debate/posted/${userInfo.uid}`).transaction((count: any) => {
    if (count === null) {
      return 1
    } else {
      return count + 1
    }
  })
}

const upload = () => {
  const { uid, photoURL, displayName } = userInfo
  const { topic } = debate.value
  const time = Date.now()

  $db.ref(`/debate/${time}`).set({
    topic,
    time,
    uid,
    photoURL,
    displayName
  })

  AddNewUser()
  Libris(uid, 3)

  navigateTo(`/debate/topic/${time}`)
}
</script>

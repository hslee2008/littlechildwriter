<template>
  <div class="create">
    <h1>Little 작가 계정 만들기</h1>
    <p>계정이 있으면 <NuxtLink to="/account/login"> 로그인 </NuxtLink>하기</p>

    <v-divider />

    <br />

    <v-form>
      <v-text-field v-model="displayName" variant="outlined" label="이름" />
      <v-text-field
        v-model="email"
        variant="outlined"
        label="Email"
        placeholder="Email"
        outlined
        clearable
        prepend-inner-icon="mdi-email"
      />
      <v-text-field
        v-model="password"
        variant="outlined"
        :type="eye ? 'text' : 'password'"
        label="Password"
        placeholder="Password"
        outlined
        clearable
        prepend-inner-icon="mdi-key"
        :append-icon="eye ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="eye = !eye"
      />

      <v-btn
        rounded="lg"
        variant="tonal"
        color="primary"
        min-width="500"
        append-icon="mdi-account-plus"
        @click="Make"
      >
        계정 만들기
      </v-btn>
    </v-form>
  </div>
</template>

<script setup lang="ts">
const { $db, $auth } = useNuxtApp()

const email = ref<string>('')
const password = ref<string>('')
const eye = ref(false)
const displayName = ref<string>('')

const Make = () =>
  $auth.createUserWithEmailAndPassword(email.value, password.value).then(() => {
    $db.ref(`/users/${$auth.currentUser?.uid}`).set({
      displayName: displayName.value,
      photoURL:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWM85l8_8g0csORwtfpgd5Dyv-f9twzcVuQ0v2FzawHw&s',
      libris: 0,
      bio: `새롭게 계정 만든 ${displayName.value}입니다. (바꾸고 싶다면 편집 버튼을 누르세요.)`,
      subscribe: [],
      subscriber: []
    })

    navigateTo('/')
  })

useHead({
  title: '만들기 - LCW'
})
</script>

<style scoped>
.create {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 88px);
}
</style>

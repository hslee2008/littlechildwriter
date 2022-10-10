<template>
  <div>

    <div
      class="d-flex justify-center align-center text-center login"
      style="height: calc(100vh - 100px)"
    >
      <div>
        <h1>로그인</h1>
        <p>계정이 없으면 <NLink to="/account/create"> 계정 만들기 </NLink></p>

        <v-divider class="my-5" />

        <v-text-field
          v-model="email"
          type="email"
          class="email"
          label="이메일"
          outlined
          required
          clearable
          prepend-inner-icon="mdi-email"
          @keyup.enter="onSubmit"
        />

        <v-text-field
          v-model="password"
          type="password"
          class="password"
          label="암호"
          outlined
          required
          clearable
          prepend-inner-icon="mdi-key"
          @keyup.enter="onSubmit"
        />

        <v-divider class="my-5" />

        <div>
          <v-btn class="login-button" color="primary" @click="onSubmit">
            <v-icon left> mdi-account </v-icon>로그인
          </v-btn>
          <section id="firebaseui-auth-container"></section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup script="ts">
import { auth as authF } from 'firebaseui'
import firebase from 'firebase/compat/app'
import 'firebaseui/dist/firebaseui.css'

const email = ref<string>('')
const password = ref<string>('')
const router = useRouter()

const onSubmit = () =>
  authF
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => router.push)

onMounted(() => {
  const uiConfig = {
    signInSuccessUrl: '/account/account',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID
    ]
  }
  const ui = new authF.AuthUI(firebase.auth())
  ui.start('#firebaseui-auth-container', uiConfig)
})

useHead({
  title: '로그인 - LCW'
})
</script>

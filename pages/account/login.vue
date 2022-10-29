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

        <div :class="`d-${$vuetify.breakpoint.xs ? '' : 'flex'}`">
          <section id="firebaseui-auth-container" />

          <v-form class="mt-4">
            <v-text-field
              v-model="email"
              type="email"
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
              label="암호"
              outlined
              required
              clearable
              prepend-inner-icon="mdi-key"
              @keyup.enter="onSubmit"
            />

            <v-btn color="primary" @click="onSubmit">
              <v-icon left> mdi-account </v-icon>로그인
            </v-btn>
          </v-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup script="ts">
import { auth as authF } from 'firebaseui'
import firebase from 'firebase/compat/app'
import 'firebaseui/dist/firebaseui.css'

const email = ref('')
const password = ref('')
const router = useRouter()

const uiConfig = {
  signInSuccessUrl: '/account/account',
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
    firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
  ]
}
const ui = new authF.AuthUI(firebase.auth())

const onSubmit = () =>
  authF
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => router.push)

onMounted(() => {
  ui.start('#firebaseui-auth-container', uiConfig)
})

onUnmounted(() => {
  ui.delete()
})

useHead({
  title: '로그인 - LCW'
})
</script>

<style>
.v-application ul,
.v-application ol {
  padding-left: 0 !important;
}

.mdl-button {
  border-radius: 5px !important;
}
</style>

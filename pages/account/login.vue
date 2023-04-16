<template>
  <div>
    <div
      class="d-flex justify-center align-center text-center login"
      style="height: calc(100vh - 100px)"
    >
      <section id="firebaseui-auth-container" />

      <div>
        <h1>로그인</h1>
        <p>
          계정이 없으면 <NuxtLink to="/account/create"> 계정 만들기 </NuxtLink>
        </p>

        <v-divider class="my-5" />

        <v-form class="mt-4">
          <v-text-field
            v-model="email"
            variant="outlined"
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
            variant="outlined"
            :type="eye ? 'text' : 'password'"
            label="암호"
            outlined
            required
            clearable
            prepend-inner-icon="mdi-key"
            :append-icon="eye ? 'mdi-eye' : 'mdi-eye-off'"
            @keyup.enter="onSubmit"
            @click:append="eye = !eye"
          />

          <v-btn
            rounded="lg"
            variant="tonal"
            color="primary"
            width="300"
            @click="onSubmit"
          >
            <v-icon start> mdi-account </v-icon>로그인
          </v-btn>
        </v-form>
      </div>
    </div>
  </div>
</template>

<script setup script="ts">
import firebase from 'firebase/compat/app'
import { auth } from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

const email = ref('')
const password = ref('')
const eye = ref(false)
const ui = new auth.AuthUI(firebase.auth())

const onSubmit = () =>
  firebase
    .auth()
    .signInWithEmailAndPassword(email.value, password.value)
    .then(() => navigateTo)

onMounted(() => {
  if (User().loggedIn) navigateTo('/account/account')

  ui.start('#firebaseui-auth-container', {
    signInSuccessUrl: '/account/account',
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID,
      firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ]
  })
})

onUnmounted(() => ui.delete())

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

@media (max-width: 700px) {
  .login {
    flex-direction: column;
  }
}
</style>

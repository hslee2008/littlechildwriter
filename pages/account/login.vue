<template>
  <section id="firebaseui-auth-container"></section>
</template>

<script setup script="ts">
import { auth as authF } from 'firebaseui'
import firebase from 'firebase/compat/app'
import 'firebaseui/dist/firebaseui.css'

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

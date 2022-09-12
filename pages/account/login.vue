<template>
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
        label="이메일"
        outlined
        required
        clearable
        prepend-inner-icon="mdi-email"
        @keyup.enter="onSubmit"
      />

      <v-text-field
        v-model="password"
        label="암호"
        outlined
        required
        clearable
        prepend-inner-icon="mdi-key"
        @keyup.enter="onSubmit"
      />

      <v-divider class="my-5" />

      <div class="d-flex justify-center g-10">
        <v-btn color="primary" @click="onSubmit">
          <v-icon left> mdi-account </v-icon>로그인
        </v-btn>
        <v-btn color="success" outlined ripple @click="google">
          <v-icon left> mdi-google </v-icon> Google
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
// todo to typescript
import { auth, db, login } from '@/plugins/firebase'

export default {
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    onSubmit() {
      auth
        .signInWithEmailAndPassword(this.email, this.password)
        .then(() => this.$router.push('/account/account'))
        .catch(e => this.handleError(e.message))
    },
    google() {
      const { email, displayName, photoURL, uid } = this.userInfo

      auth
        .signInWithPopup(new login.GoogleAuthProvider())
        .then(() => this.$router.push('/account/account'))
        .catch(e => this.handleError(e.message))

      db.ref(`users/${uid}`).update({
        email,
        displayName,
        photoURL
      })
    }
  }
}
</script>

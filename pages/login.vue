<template>
  <div class="login">
    <NuxtLink to="/create" class="mb-5">계정 만들기</NuxtLink>

    <h1>로그인</h1>

    <v-divider class="my-5"></v-divider>

    <v-form v-model="valid">
      <v-text-field
        label="이메일"
        placeholder="이메일"
        filled
        required
        clearable
        dense
        solo
        validate-on-blur
        v-model="email"
        :rules="emailRules"
        prepend-inner-icon="mdi-email"
        v-on:keyup.enter="onSubmit"
      />

      <v-text-field
        label="암호"
        placeholder="암호"
        filled
        required
        clearable
        dense
        solo
        validate-on-blur
        v-model="password"
        :rules="passwordRules"
        prepend-inner-icon="mdi-key"
        v-on:keyup.enter="onSubmit"
      />
      <v-btn @click="onSubmit" color="primary">
        <v-icon left>mdi-account</v-icon>로그인
      </v-btn>

      <div class="error" v-if="error">{{ error.message }}</div>

      <v-divider class="my-5"></v-divider>

      <div class="d-flex justify-center" style="gap: 10px">
        <v-btn color="success" @click="google" outlined ripple>
          <v-icon left>mdi-google</v-icon>
          Google
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<script>
import firebase, { auth } from '../plugins/firebase.js';
import 'firebase/compat/app';

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      valid: false,
      emailRules: [
        (v) => !!v || 'E-mail is required',
        (v) => /.+@.+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        (v) => !!v || 'Password is required',
        (v) => v.length > 6 || 'Password must be more than 6 characters',
      ],
    };
  },
  methods: {
    onSubmit() {
      if (this.valid)
        auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => this.$router.push('/account'))
          .catch((e) => (this.error = e));
    },
    google() {
      auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then(() => this.$router.push('/account'))
        .catch((e) => (this.error = e));
    },
  },
};
</script>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);
}
</style>

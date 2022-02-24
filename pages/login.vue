<template>
  <div class="login">
    <NuxtLink to="/create">Make an Account</NuxtLink>
    <h1>Login</h1>
    <v-divider></v-divider>
    <br />
    <v-form v-model="valid">
      <v-text-field
        label="Email"
        placeholder="Email"
        filled
        required
        clearable
        dense
        solo
        validate-on-blur
        v-model="email"
        :rules="emailRules"
        prepend-inner-icon="mdi-email"
        v-on:keyup.enter="pressed"
      ></v-text-field>
      <v-text-field
        label="Password"
        placeholder="Password"
        filled
        required
        clearable
        dense
        solo
        validate-on-blur
        v-model="password"
        :rules="passwordRules"
        prepend-inner-icon="mdi-key"
        v-on:keyup.enter="pressed"
      ></v-text-field>
      <v-btn @click="pressed" color="primary"
        ><v-icon left>mdi-account</v-icon>Login</v-btn
      >
      <div class="error" v-if="error">{{ error.message }}</div>

      <br /><br />

      <v-divider></v-divider>

      <br />

      <div style="display: flex; gap: 10px; justify-content: center">
        <v-btn
          style="color: rgb(219, 69, 54)"
          @click="google"
          outlined
          dense
          ripple
          small
        >
          <v-icon left>mdi-google</v-icon>
          Google
        </v-btn>
      </div>
    </v-form>
  </div>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 88px);
}
</style>

<script>
import firebase, { auth } from '../plugins/firebase.js'
import 'firebase/compat/app'

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
    }
  },
  methods: {
    async pressed() {
      if (this.valid)
        await auth
          .signInWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$router.push('/')
          })
          .catch((error) => {
            this.error = error
          })
    },
    google() {
      auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(() => {
        this.$router.push('/')
      })
    },
  },
}
</script>

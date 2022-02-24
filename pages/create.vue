<template>
  <div class="create">
    <NuxtLink to="/login">Login</NuxtLink>
    <h1>Create Account</h1>
    <v-divider></v-divider>
    <br />
    <v-form v-model="valid">
      <v-text-field
        v-model="userDisplayName"
        label="이름"
        required
      ></v-text-field>
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
      ></v-text-field>
      <v-btn @click="pressed" color="primary"
        ><v-icon left>mdi-account</v-icon>Create and Login</v-btn
      >
      <div class="error" v-if="error">{{ error.message }}</div>
    </v-form>
  </div>
</template>

<style scoped>
.create {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 88px);
}
</style>

<script>
import { db, auth } from '../plugins/firebase.js'

export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      userDisplayName: '',
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
      if (this.valid) {
        await auth
          .createUserWithEmailAndPassword(this.email, this.password)
          .then(() => {
            this.$fire.auth
              .signInWithEmailAndPassword(this.email, this.password)
              .then(() => {
                db.ref(`/users/${auth.currentUser.uid}`).update({
                  username: this.userDisplayName,
                  photoURL: 'https://littlechildwriter.web.app/icon.png',
                  libris: 0,
                })

                this.$router.push('/')
              })
              .catch((error) => {
                this.error = error
              })
          })
          .catch((error) => {
            this.error = error
          })
      }
    },
  },
}
</script>

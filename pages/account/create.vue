<template>
  <div class="create">
    <h1>계정 만들기</h1>
    <p>계정이 있으면 <NLink to="/account/login"> 로그인 </NLink>하기</p>

    <v-divider />

    <br />

    <v-form>
      <v-text-field v-model="displayName" label="이름" required />
      <v-text-field
        v-model="email"
        label="Email"
        placeholder="Email"
        required
        outlined
        clearable
        prepend-inner-icon="mdi-email"
      />
      <v-text-field
        v-model="password"
        label="Password"
        placeholder="Password"
        required
        outlined
        clearable
        prepend-inner-icon="mdi-key"
      />

      <v-btn color="primary" @click="makeAccount">
        <v-icon left> mdi-account </v-icon> 게정 만들기
      </v-btn>
    </v-form>
  </div>
</template>

<script lang="ts">
import { auth, db } from '@/plugins/firebase'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      email: '',
      password: '',
      displayName: ''
    }
  },
  methods: {
    makeAccount() {
      auth
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(() => {
          db.ref(`/users/${auth.currentUser?.uid}`).set({
            displayName: this.displayName,
            photoURL: '',
            libris: 0,
            bio: `새롭게 계정 만든 ${this.displayName}입니다. (바꾸고 깊다면 편집 버튼을 누르세요.)`,
            subscribe: [],
            subscriber: []
          })

          this.$router.push('/account/account')

          this.userInfo.uid = auth.currentUser?.uid ?? ''
          this.userInfo.displayName = this.displayName
          this.userInfo.photoURL = ''
          this.userInfo.libris = 0
        })
        .catch(e => this.handleError(e.message))
    }
  }
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

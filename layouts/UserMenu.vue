<template>
  <v-menu v-if="userInfo.uid" right rounded>
    <template #activator="{ on }">
      <v-btn icon v-on="on">
        <v-avatar size="35">
          <v-img alt="User photoURL" :src="userInfo.photoURL" />
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="pa-3">
      <v-card-title>{{ userInfo.displayName }}</v-card-title>
      <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>

      <v-btn :to="`/user/${userInfo.uid}`" text> 프로필 </v-btn>

      <v-btn to="/account/account" text> 편집 </v-btn>
      <v-btn text @click="logout"> 로그아웃 </v-btn>
    </v-card>
  </v-menu>
  <v-btn v-else to="/account/login" icon>
    <v-icon>mdi-account-circle</v-icon>
  </v-btn>
</template>

<script setup lang="ts">
import { auth } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const router = useRouter()

const logout = () => {
  auth.signOut()
  router.push('/account/login')
  userInfo.value = {
    displayName: '',
    email: '',
    photoURL: '',
    uid: ''
  }
}
</script>

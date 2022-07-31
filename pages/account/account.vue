<template>
  <v-form v-model="valid" class="my-10">
    <h1>기본 설정</h1>

    <v-divider />
    <br />

    <v-row class="mx-1 gap5">
      <v-text-field
        v-model="userInfo.displayName"
        label="Name"
        placeholder="Name"
        filled
        required
        dense
        solo
        validate-on-blur
        value="name"
        prepend-inner-icon="mdi-account"
      />
      <v-text-field
        v-model="userInfo.email"
        label="Email"
        placeholder="Email"
        filled
        required
        dense
        disabled
        solo
        validate-on-blur
        value="userInfo.email"
        prepend-inner-icon="mdi-email"
      />
    </v-row>

    <v-row class="mx-1 gap5">
      <v-text-field
        v-model="userInfo.uid"
        label="UID"
        placeholder="UID"
        filled
        required
        dense
        solo
        validate-on-blur
        disabled
        value="uid"
        prepend-inner-icon="mdi-account"
      />
    </v-row>

    <v-card tile justify-center class="rounded-lg">
      <v-card-title>프로필 아바타</v-card-title>
      <v-divider />
      <br />
      <v-text-field
        v-model="userInfo.photoURL"
        label="URL"
        placeholder="URL"
        filled
        required
        flat
        dense
        solo
        validate-on-blur
        value="photo"
        prepend-inner-icon="mdi-camera"
      />
      <v-card-text class="d-flex justify-center">
        <v-avatar size="100">
          <v-img :src="userInfo.photoURL" />
        </v-avatar>
      </v-card-text>
    </v-card>

    <br /><br />

    <v-card tile justify-center class="rounded-lg">
      <v-card-title>자신을 소개하세요!</v-card-title>
      <v-card-text class="d-flex justify-center">
        <v-textarea
          v-model="userDB.bio"
          required
          flat
          outlined
          dense
          solo
          validate-on-blur
          label="Bio"
          placeholder="나의 소개"
          no-resize
        />
      </v-card-text>
    </v-card>

    <br /><br />

    <v-card-title>비공개 프로젝트</v-card-title>
    <v-divider />
    <br />
    <LazyBookCard :items="project" :simple="true" :sp="true" />

    <v-row justify="center" class="gap5">
      <v-btn color="primary" @click="update">
        <v-icon left> mdi-account </v-icon>
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script>
import { auth, db } from '@/plugins/firebase'
import { userInfo } from 'os'

export default {
  data() {
    return {
      valid: true,
      project: [],
      userDB: {
        bio: ''
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(u => {
      if (u)
        db.ref(`/users/${this.userInfo.uid}`)
          .once('value')
          .then(snapshot => {
            this.userDB = snapshot.val()
          })
    })
  },
  created() {
    this.fetchContent()
  },
  methods: {
    fetchContent() {
      auth.onAuthStateChanged(u => {
        if (u)
          db.ref('/contents/').on('child_added', async s => {
            const data = await s.val()
            data.uid === this.userInfo.uid && this.project.unshift(data)
          })
      })
    },
    update() {
      const { displayName, photoURL, uid } = this.userInfo
      const { bio, background } = this.userDB

      auth.currentUser
        .updateProfile({
          displayName,
          photoURL
        })
        .then(() => {
          db.ref(`/users/${uid}`).update({
            displayName,
            photoURL,
            bio,
            background
          })

          this.$router.push(`/user/${uid}`)
        })
    }
  }
}
</script>

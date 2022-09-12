<template>
  <v-form v-model="valid" class="my-10">
    <v-card class="mb-10 transparent">
      <v-card-title>기본 설정</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="userInfo.displayName"
          label="Name"
          placeholder="Name"
          validate-on-blur
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
          prepend-inner-icon="mdi-email"
        />
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
          prepend-inner-icon="mdi-account"
        />
      </v-card-text>
    </v-card>

    <v-card class="mb-10 transparent">
      <v-card-title>프로필 설정</v-card-title>

      <v-card-text>
        <v-avatar size="100">
          <v-img :src="userInfo.photoURL" />
        </v-avatar>
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
          prepend-inner-icon="mdi-camera"
        />

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

    <div v-if="project.length > 0">
      <v-card-title>비공개 글</v-card-title>
      <v-divider />
      <br />
      <LazyBookCard :items="project" :simple="true" :showprivate="true" />
    </div>

    <v-card class="mb-10 transparent">
      <v-card-title>계정 삭제</v-card-title>
      <v-card-text>
        <LazyDialogComponent
          :cb="deleteAccount"
          btn-title="삭제"
          title="진짜로 삭제하겠습니까?"
          text="삭제를 하면 계정 정보는 삭제되지만 올렸던 글은 아직 남아 있습니다. 글들도 삭제하고 싶다면 글을 먼저 삭제하고 계정을 삭제해주세요."
          icon="trash-can"
        />
      </v-card-text>
    </v-card>

    <v-row justify="center" class="g-10">
      <v-btn color="primary" @click="update">
        <v-icon left> mdi-account </v-icon>
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import Vue from 'vue'
import { auth, db } from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      valid: true,
      project: [] as any,
      userDB: {
        bio: ''
      }
    }
  },
  mounted() {
    auth.onAuthStateChanged(() => {
      db.ref(`/users/${this.userInfo.uid}`)
        .once('value')
        .then(s => (this.userDB = s.val()))
    })
  },
  created() {
    auth.onAuthStateChanged(() =>
      db
        .ref('/contents/')
        .on(
          'child_added',
          async (s: any) =>
            s.uid === this.userInfo.uid && this.project.unshift(await s.val())
        )
    )
  },
  methods: {
    update() {
      const { displayName, photoURL, uid } = this.userInfo
      const { bio } = this.userDB

      this.$router.push(`/user/${uid}`)

      auth.currentUser
        ?.updateProfile({
          displayName,
          photoURL
        })
        .then(() =>
          db.ref(`/users/${uid}`).update({
            displayName,
            photoURL,
            bio
          })
        )
        .catch(e => this.handleError(e.message))
    },
    deleteAccount() {
      auth.currentUser?.delete().then(() => {
        db.ref(`/users/${this.userInfo.uid}`).remove()
        this.$router.push('/')
      })
    }
  }
})
</script>

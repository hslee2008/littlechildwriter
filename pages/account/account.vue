<template>
  <v-form v-model="valid" class="my-10">
    <v-card class="mb-10 transparent">
      <v-card-title>기본 설정</v-card-title>

      <v-card-text>
        <div class="d-flex">
          <v-text-field
            v-model="userInfo.displayName"
            placeholder="Name"
            validate-on-blur
            prepend-inner-icon="mdi-account"
            class="mr-2"
          />
          <v-text-field
            v-model="userInfo.email"
            placeholder="Email"
            validate-on-blur
            prepend-inner-icon="mdi-email"
            class="ml-2"
          />
        </div>

        UID: {{ userInfo.uid }}
      </v-card-text>

      <v-card-actions class="ml-2">
        <v-btn outlined color="primary" class="mr-2" @click="resetPassword">
          <v-icon left>mdi-key</v-icon> 암호 재설정
        </v-btn>
      </v-card-actions>
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
          auto-grow
          required
          flat
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

    <v-row justify="center" class="g-10">
      <v-btn color="primary" @click="Update">
        <v-icon left> mdi-account </v-icon>
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { auth, db } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const router = useRouter()
const valid = ref<boolean>(true)
const project = ref<any>([])
const userDB = ref<any>({ bio: '' })

onBeforeMount(() =>
  auth.onAuthStateChanged(() =>
    db
      .ref('/contents/')
      .on(
        'child_added',
        async (s: any) =>
          s.uid === userInfo.value.uid && project.value.unshift(await s.val())
      )
  )
)

onMounted(() =>
  auth.onAuthStateChanged(() => {
    db.ref(`/users/${userInfo.value.uid}`)
      .once('value')
      .then(s => (userDB.value = s.val()))
  })
)

const Update = async () => {
  const { displayName, photoURL, uid, email } = userInfo.value
  const { bio } = userDB.value

  await auth.currentUser?.updateEmail(email)
  await auth.currentUser?.updateProfile({
    displayName,
    photoURL
  })

  db.ref(`/users/${uid}`).update({
    displayName,
    photoURL,
    bio
  })

  router.push(`/user/${uid}`)
}

const resetPassword = async () => {
  const { email } = userInfo.value
  await auth.sendPasswordResetEmail(email)
}

useHead({
  title: '계정 - LCW'
})
</script>

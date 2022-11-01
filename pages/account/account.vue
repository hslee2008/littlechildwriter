<template>
  <v-form class="my-10">
    <v-card id="profile" class="mb-10 transparent">
      <v-card-title>프로필 설정</v-card-title>

      <div class="d-flex ml-5">
        <v-avatar size="100">
          <UserPhoto :src="userInfo.photoURL" />
        </v-avatar>
        <div>
          <v-card-title>{{ userInfo.displayName }}</v-card-title>
          <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
          <v-btn text color="primary" @click="imageEdit = true">
            이미지 편집
          </v-btn>
        </div>
      </div>

      <v-card-text>
        <v-textarea
          v-model="userDB.bio"
          auto-grow
          required
          flat
          dense
          solo
          label="Bio"
          placeholder="나의 소개"
          class="ma-1"
        />
      </v-card-text>
    </v-card>

    <div v-if="project.length > 0">
      <v-card-title>비공개 글</v-card-title>
      <v-divider />
      <br />
      <LazyBookCard :items="project" :simple="true" />
    </div>

    <v-card id="advanced" class="mb-10 transparent">
      <v-card-title>고급 설정</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="userInfo.uid"
          label="UID"
          placeholder="UID"
          filled
          required
          flat
          dense
          solo
          disabled
          prepend-inner-icon="mdi-account"
        />
      </v-card-text>
    </v-card>

    <v-dialog v-model="imageEdit" width="500">
      <v-card>
        <v-card-title> 이미지 편집 </v-card-title>

        <v-card-text>
          <div class="text-center mb-3">
            <v-avatar size="100">
              <v-img :src="userInfo.photoURL" />
            </v-avatar>
          </div>

          <v-text-field
            v-model="userInfo.photoURL"
            label="URL"
            placeholder="URL"
            filled
            required
            flat
            dense
            solo
            prepend-inner-icon="mdi-camera"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn color="red" text @click="imageEdit = false"> 취소 </v-btn>
          <v-spacer />
          <v-btn color="primary" text @click="save"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center" class="g-10">
      <v-btn color="primary" @click="Update">
        <v-icon left> mdi-account </v-icon>
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
import { auth, db } from 'plugins/firebase'
import { User } from 'plugins/global'

const userInfo = User()
const router = useRouter()
const project = ref<any>([])
const userDB = ref<any>({ bio: '' })
const imageEdit = ref<boolean>(false)

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
  const { displayName, uid, email } = userInfo.value
  const { bio } = userDB.value

  await auth.currentUser?.updateEmail(email)

  db.ref(`/users/${uid}`).update({
    displayName,
    bio
  })

  router.push(`/user/${uid}`)
}

const save = () => {
  const { photoURL } = userInfo.value

  auth.currentUser?.updateProfile({ photoURL })
  db.ref(`/users/${userInfo.value.uid}`).update({ photoURL })

  imageEdit.value = false
}

useHead({
  title: '계정 - LCW'
})
</script>

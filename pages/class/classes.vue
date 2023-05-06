<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <v-btn
      v-if="userInfo.loggedIn"
      rounded="lg"
      variant="tonal"
      bottom
      right
      fixed
      fab
      prepend-icon="mdi-plus"
      color="primary"
    >
      새로운 알림판 만들기

      <v-dialog v-model="dialog" width="500" activator="parent">
        <v-card>
          <v-card-title> 알림판 기본 정보 </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="classInfo.name"
              variant="outlined"
              label="알림판 이름"
              required
            />

            <v-text-field
              v-model="classInfo.description"
              variant="outlined"
              label="알림판 설명"
              required
            />

            <v-checkbox v-model="classInfo.public" label="공개" />
          </v-card-text>

          <v-card-title> 알림판 고급 정보 </v-card-title>

          <v-card-text>
            <v-text-field
              v-model="classInfo.image"
              variant="outlined"
              label="알림판 사진 URL"
            />
          </v-card-text>

          <v-card-actions>
            <v-spacer />

            <v-btn
              rounded="lg"
              variant="tonal"
              prepend-icon="mdi-check"
              @click="Make"
            >
              만들기
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-btn>

    <v-row class="mt-5 ma-1 g-10">
      <v-card v-for="item in classes" :key="item.name" class="my-3">
        <v-card
          v-if="item.public ||
          userInfo.is(item.uid) ||
          Object.values(item.users).filter((e: any) => userInfo.is(e.uid)).length > 0
          "
          :to="`/class/${item.id}`"
        >
          <v-img :src="item.image" width="50vh" class="ma-auto rounded-lg">
            <v-avatar size="45" class="ma-3">
              <UserPhoto :size="45" :src="item?.photoURL" />
            </v-avatar>
          </v-img>

          <v-card-title class="text-primary">
            {{ item.name }} ({{ item.public ? '공개' : '비공개' }})
          </v-card-title>
          <v-card-subtitle>{{ item.creator }}</v-card-subtitle>
          <v-card-text>{{ item.description }}</v-card-text>
        </v-card>
      </v-card>
    </v-row>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const classes = ref<any>([])
const classInfo = ref<any>({
  name: '',
  description: '',
  image: '',
  creator: '',
  id: '',
  uid: '',
  photoURL: '',
  public: true,
  users: []
})
const dialog = ref<boolean>(false)
const steps = ref<number>(1)

onBeforeMount(() =>
  $db.ref('classes').once('value', (snapshot: any) => {
    classes.value = Object.values(snapshot.val())
  })
)

const Make = () => {
  dialog.value = false

  const { displayName, uid, photoURL } = userInfo
  const { name } = classInfo.value

  classInfo.value = {
    ...classInfo.value,
    creator: displayName,
    id: uid + name,
    uid,
    photoURL
  }

  $db
    .ref('classes')
    .child(uid + name)
    .set(classInfo.value)

  classInfo.value = {
    name: '',
    description: '',
    image: '',
    creator: '',
    id: '',
    uid: '',
    photoURL: '',
    public: true,
    users: []
  }
  dialog.value = false
  steps.value = 1
}

useHead({
  title: '알림판 - LCW'
})
</script>

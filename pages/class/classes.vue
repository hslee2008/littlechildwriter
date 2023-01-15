<!-- eslint-disable vue/html-indent -->
<template>
  <div>
    <v-dialog :model-value="dialog" width="500">
      <template #activator="{ props }">
        <v-btn
variant="tonal"
          bottom
          right
          fixed
          fab
          color="primary"
          class="zmax"
          v-bind="props"
>
          <v-icon> mdi-plus </v-icon>
        </v-btn>
      </template>

      <v-stepper :model-value="steps" flat rounded>
        <v-stepper-header>
          <v-stepper-step :complete="steps > 0" step="1">
            기본 정보
          </v-stepper-step>

          <v-stepper-step step="2"> 이미지 업로드 </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card-title> 알림판 기본 정보 </v-card-title>

            <v-card-text>
              <v-text-field
                :model-value="classInfo.name"
                label="알림판 이름"
                required
              />

              <v-text-field
                :model-value="classInfo.description"
                label="알림판 설명"
                required
              />

              <v-checkbox :model-value="classInfo.public" label="공개" />
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
variant="tonal"
                :disabled="!classInfo.name"
                color="primary"
                text
                @click="steps = 2"
              >
                👌 OK
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card-title> 알림판 고급 정보 </v-card-title>

            <v-card-text>
              <v-text-field :model-value="classInfo.image" label="알림판 사진 URL" />
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn variant="tonal" text @click="Make">
                <v-icon start> mdi-check </v-icon> 만들기
              </v-btn>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <v-row class="mt-5 ma-1 g-10">
      <v-card
        v-for="item in classes"
        :key="item.name"
        class="my-3 elevation-0"
        color="#23262e"
      >
        <v-card
          v-if="
            item.public ||
            item.uid === userInfo.uid ||
            Object.values(item.users).filter(filterUsers).length > 0
          "
          color="#23262e"
          :to="`/class/${item.id}`"
        >
          <v-img :src="item.image" width="50vh" class="ma-auto rounded-lg">
            <v-avatar class="ma-3">
              <UserPhoto :src="item.photoURL" />
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
  $db
    .ref('classes')
    .on('child_added', async (s: any) => classes.value.push(await s.val()))
)

const filterUsers = (e: any) => e.uid === userInfo.value.uid

const Make = () => {
  dialog.value = false

  const { displayName, uid, photoURL } = userInfo.value
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

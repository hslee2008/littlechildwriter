<!-- eslint-disable vue/html-indent -->
<template>
  <v-data-iterator :items="classes" hide-default-footer>
    <template #header>
      <v-dialog
        v-model="dialog"
        transition="dialog-bottom-transition"
        width="500"
      >
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            <v-icon left> mdi-checkbox-blank-badge </v-icon> 만들기
          </v-btn>
        </template>

        <v-stepper v-model="steps" flat rounded>
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
                <v-text-field v-model="classInfo.name" label="알림판 이름" />

                <v-text-field
                  v-model="classInfo.description"
                  label="알림판 설명"
                />

                <v-checkbox v-model="classInfo.public" label="공개" />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
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
                <v-text-field
                  v-model="classInfo.image"
                  label="알림판 사진 URL"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn text @click="Make">
                  <v-icon left> mdi-check </v-icon> 만들기
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>
    </template>

    <template #default="props">
      <v-row class="mt-5 ma-1 g-10">
        <v-card
          v-for="item in props.items"
          :key="item.creator + item.name"
          class="my-3 transparent"
        >
          <v-card
            v-if="
              item.public ||
              item.uid === userInfo.uid ||
              Object.values(item.users).filter(filterUsers).length > 0
            "
            class="transparent"
            :to="`/class/${item.id}`"
          >
            <v-img :src="item.image" width="50vh" class="ma-auto rounded">
              <v-avatar class="ma-3">
                <v-img :src="item.photoURL" />
              </v-avatar>
            </v-img>

            <v-card-title class="primary--text">
              {{ item.name }} ({{ item.public ? '공개' : '비공개' }})
            </v-card-title>
            <v-card-subtitle>{{ item.creator }}</v-card-subtitle>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-card>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase';
import { User } from '@/plugins/global';

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
  db
    .ref('classes')
    .on('child_added', async s => classes.value.push(await s.val()))
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

  db.ref('classes')
    .child(uid + name)
    .set(classInfo)

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

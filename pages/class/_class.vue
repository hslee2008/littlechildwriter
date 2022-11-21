<template>
  <v-tabs
    v-model="tab"
    grow
    centered
    show-arrows
    center-active
    align-with-title
    class="transparent"
  >
    <v-tab> 홈 </v-tab>
    <v-tab> 글 쓰기 </v-tab>
    <v-tab v-if="classInfo.uid === userInfo.uid"> 설정 </v-tab>

    <v-tabs-items v-model="tab" class="transparent">
      <DisplayCards :class-info="classInfo" />
      <UploadCards :update-tab="updateTab" />

      <v-tab-item v-if="classInfo.uid === userInfo.uid" class="pt-5">
        <v-card class="mt-5">
          <v-card-title>수업 세부정보</v-card-title>
          <v-card-text>
            <v-text-field v-model="classInfo.name" label="수업 이름" required />
            <v-textarea
              v-model="classInfo.description"
              label="수업 설명"
              required
            />
            <v-checkbox
              v-model="classInfo.public"
              label="수업 전체 공개 여부"
              required
            />
            <v-btn
              color="primary"
              class="mt-5"
              :disabled="!classInfo.name || !classInfo.description"
              @click="Update"
            >
              수업 정보 수정
            </v-btn>
          </v-card-text>
        </v-card>
        <v-card class="mt-5">
          <v-card-title>삭제</v-card-title>
          <v-card-text>
            <LazyDialogComponent
              :cb="DeleteClass"
              btn-title="삭제"
              title="진짜로 삭제하겠습니까?"
              text="삭제하면 복구할 수 없습니다"
              icon="trash-can"
            />
          </v-card-text>
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script setup lang="ts">
import DisplayCards from './components/DisplayCards.vue'
import UploadCards from './components/UploadCards.vue'
import { db } from 'plugins/firebase'
import { User } from 'plugins/global'

const userInfo = User()
const route = useRoute()
const router = useRouter()
const id = route.params.class
const classInfo = ref<any>({})
const listev = ref<any[]>([])
const tab = ref<number>(0)

onBeforeMount(() => {
  db.ref(`/classes/${id}`).on(
    'value',
    async s => (classInfo.value = await s.val())
  )

  db.ref('/contents/').on('child_added', s => {
    const { title, time, uid, displayName, image } = s.val()

    listev.value.push({
      title,
      time,
      uid,
      displayName,
      image
    })
  })
})

const updateTab = (num: number) => (tab.value = num)

const Update = () => {
  db.ref(`/classes/${id}`).update(classInfo)
  tab.value = 0
}

const DeleteClass = () => {
  db.ref('classes').child(id).remove()
  router.push('/class/classes')
}

useHead({
  title: '알림판 (자세히) - LCW'
})
</script>

<script lang="ts">
export default {
  name: 'Class',
  inheritAttrs: false,
  customOptions: {}
}
</script>

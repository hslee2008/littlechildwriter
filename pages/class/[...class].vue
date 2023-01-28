<template>
  <div>
    <v-tabs
      v-model="tab"
      show-arrows
      center-active
      grow
      :bg-color="themeColor()"
    >
      <v-tab :value="0"> 홈 </v-tab>
      <v-tab v-if="userInfo.loggedIn" :value="1"> 글 쓰기 </v-tab>
      <v-tab v-if="classInfo.uid === userInfo.uid" :value="2"> 설정 </v-tab>
    </v-tabs>

    <v-window v-model="tab" class="py-5" :color="themeColor()">
      <v-window-item :value="0">
        <DisplayCards :class-info="classInfo" />
      </v-window-item>

      <v-window-item :value="1">
        <UploadCards :update-tab="updateTab" />
      </v-window-item>

      <v-window-item
        v-if="classInfo.uid === userInfo.uid"
        :value="2"
        class="pt-5"
      >
        <v-card class="mt-5" :color="themeColor()">
          <v-card-title>수업 세부정보</v-card-title>
          <v-card-text>
            <v-text-field
              variant="outlined"
              :model-value="classInfo.name"
              label="수업 이름"
              required
            />
            <v-textarea
              :model-value="classInfo.description"
              variant="outlined"
              label="수업 설명"
              required
            />
            <v-checkbox
              :model-value="classInfo.public"
              label="수업 전체 공개 여부"
              required
            />
            <v-btn
              rounded="lg"
              variant="tonal"
              color="primary"
              class="mt-5"
              :disabled="!classInfo.name || !classInfo.description"
              @click="Update"
            >
              수업 정보 수정
            </v-btn>
          </v-card-text>
        </v-card>

        <v-card-title>삭제</v-card-title>
        <v-card-text>
          <v-btn
            rounded="lg"
            variant="tonal"
            color="red lighten-2"
            class="delete"
            @click="DeleteClass"
          >
            <v-icon start> mdi-trash-can </v-icon>
            삭제하기
          </v-btn>
        </v-card-text>
      </v-window-item>
    </v-window>
  </div>
</template>

<script setup lang="ts">
import DisplayCards from './components/DisplayCards.vue'
import UploadCards from './components/UploadCards.vue'

const { $db } = useNuxtApp()

const userInfo = User()
const route = useRoute()

const id = route.params.class
const classInfo = ref<any>({})
const listev = ref<any[]>([])
const tab = ref<number>(0)

onBeforeMount(() => {
  $db
    .ref(`/classes/${id}`)
    .on('value', async (s: any) => (classInfo.value = await s.val()))

  $db.ref('/contents/').on('child_added', (s: any) => {
    const { title, time, uid, displayName, image } = s.val()

    listev.value.push({
      title,
      time,
      uid,
      displayName,
      image,
    })
  })
})

const updateTab = (num: number) => (tab.value = num)

const Update = () => {
  $db.ref(`/classes/${id}`).update(classInfo)
  tab.value = 0
}

const DeleteClass = () => {
  $db.ref('classes').child(id).remove()
  navigateTo('/class/classes')
}

useHead({
  title: '알림판 (자세히) - LCW',
})
</script>

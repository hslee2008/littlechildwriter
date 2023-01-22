<template>
  <div class="d-flex">
    <v-dialog width="700">
      <template #activator="{ props }">
        <v-btn rounded="lg" variant="tonal" text v-bind="props" class="mx-1">
          <v-icon start> mdi-town-hall </v-icon>
          학교 도서관
        </v-btn>
      </template>

      <v-card>
        <v-card-title>학교 도서관 책 검색</v-card-title>

        <v-card-text>
          <div class="d-flex">
            <v-select
              variant="outlined"
              :model-value="school.local"
              :items="school.list"
              label="지역 선택"
              class="mr-2"
            />
            <v-text-field
              variant="outlined"
              :model-value="school.name"
              label="학교 이름"
              :rules="[endWithSchool]"
              class="mx-2"
            />
            <v-btn
              rounded="lg"
              ref="search"
              variant="tonal"
              icon="mdi-magnify"
              class="elevation-0"
              @click="schoolBookSearch"
            />
          </div>
          <v-text-field
            variant="outlined"
            :model-value="school.title"
            label="책 제목"
          />
        </v-card-text>

        <div v-if="schoolLoading" class="text-center">
          <v-progress-circular indeterminate color="primary" class="mb-5" />
        </div>
        <v-list
          v-else-if="!school.resultString?.endsWith('찾을 수 없습니다.')"
          nav
        >
          <v-list-item
            v-for="item in school.result"
            :key="item.callNumber"
            :style="`
                border: 2px dashed #${item.canRental ? '4caf50' : 'f44336'};
              `"
          >
            <v-img
              :src="item.previewImage"
              alt="학교 도서관"
              max-width="100"
              class="rounded-lg ma-2"
            >
              <v-overlay absolute>
                {{ item.canRental ? '대출 가능' : '대출 불가능' }}
              </v-overlay>
            </v-img>

            <v-card>
              <v-card-title class="text-primary">
                {{ item.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ item.writer }}
              </v-card-subtitle>

              <v-card-text class="mt-2 text-white">
                청구 기호: {{ item.callNumber }}<br />
                회사: {{ item.company }}
              </v-card-text>
            </v-card>
          </v-list-item>
        </v-list>
        <v-card-text v-else>{{ school.resultString }}</v-card-text>
      </v-card>
    </v-dialog>
    <v-btn rounded="lg" variant="tonal" text class="mx-1" @click="share">
      <v-icon start> mdi-share-variant </v-icon>
      공유
    </v-btn>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  post: any
  userInfo: any
  time: any
}>()

const school = ref({
  list: [
    '서울',
    '부산',
    '대구',
    '인천',
    '광주',
    '대전',
    '울산',
    '세종',
    '경기',
    '강원',
    '충북',
    '충남',
    '전북',
    '전남',
    '경북',
    '경남',
    '제주'
  ] as string[],
  result: [] as any,
  resultString: '',
  local: '',
  name: '',
  title: props.post.value.title
})
const schoolLoading = ref<boolean>(false)

const schoolBookSearch = async () => {
  schoolLoading.value = true

  localStorage.setItem(
    'school',
    JSON.stringify({
      local: school.value.local,
      name: school.value.name
    })
  )

  await fetch(
    `https://little-child-writer-school-book-search.onrender.com/?book=${school.value.title}&school=${school.value.name}&local=${school.value.local}`
  )
    .then(res => res.json())
    .then(json => {
      school.value.result = json.result
      school.value.resultString = json.result.toString()
    })

  schoolLoading.value = false
}

const share = async () => {
  const { title, content } = props.post.value
  await navigator.share({
    title,
    text: content,
    url: `https://littlechildwriter.app/book/content/${props.time}`
  })
  Libris(props.userInfo.value.uid, 1)
}

onMounted(() => {
  if (localStorage.getItem('school'))
    school.value = {
      ...school.value,
      ...JSON.parse(localStorage.getItem('school')!)
    }
})

const endWithSchool = (v: string) =>
  v.endsWith('학교') || '-학교로 끝나게 입력해주세요'
</script>

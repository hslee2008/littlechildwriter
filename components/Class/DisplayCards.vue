<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<!-- eslint-disable vue/max-attributes-per-line -->
<template>
  <div>
    <h4 class="mb-3">{{ classInfo.description }} ({{ classInfo.creator }})</h4>
    <h1 class="text-primary text-h4 mb-8">
      {{ classInfo.name }}
    </h1>

    <v-expansion-panels variant="popout">
      <v-expansion-panel
        v-for="(category, title) in classInfo.contents"
        :key="title"
        :bg-color="title === '기타' ? 'primary' : ''"
      >
        <v-expansion-panel-title class="elevation-0">
          {{ title.toString().replaceAll('_', ' - ') }}
        </v-expansion-panel-title>

        <v-expansion-panel-text v-for="(item, i) in category" :key="item.title">
          <v-card
            v-if="item.type === '책'"
            class="d-flex mt-5"
            :to="`/book/content/${item.time}`"
          >
            <template #prepend>
              <v-icon color="orange" class="ml-4" size="40"> mdi-book </v-icon>
            </template>

            <v-card-item>
              <v-card-title>{{ item.displayName }}</v-card-title>
              <v-card-subtitle>{{ item.title }}</v-card-subtitle>
              <v-card-text>
                {{ new Date(item.time).toLocaleDateString() }}
              </v-card-text>
            </v-card-item>

            <v-spacer />

            <ClassActions
              v-if="userInfo.is(item.uid)"
              :item="item"
              :i="i"
              :title="title"
              type="other"
            />
          </v-card>
          <v-card
            v-else-if="
              item.type === '파일 사진' || (item.file || '').endsWith('jpg')
            "
            class="mt-5"
          >
            <div class="d-flex">
              <v-card-item>
                <v-card-title>{{ item.file }}</v-card-title>
                <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
              </v-card-item>

              <ClassActions
                v-if="userInfo.is(item.uid)"
                :item="item"
                :i="i"
                :title="title"
                type="파일"
              />
            </div>

            <a :href="item.url" target="_blank">
              <v-img :src="item.url" width="500" class="mt-4" />
            </a>
          </v-card>
          <v-card
            v-else-if="item.type === '파일'"
            :href="item.url"
            class="d-flex mt-3"
            rounded="lg"
            variant="outlined"
          >
            <template #prepend>
              <v-icon class="ml-4"> mdi-link-variant </v-icon>
            </template>

            <v-card-item>
              <v-card-title>{{ item.file }}</v-card-title>
              <v-card-subtitle>
                {{ item.displayName || '비공개' }}
              </v-card-subtitle>
            </v-card-item>

            <v-spacer />

            <ClassActions
              v-if="userInfo.is(item.uid)"
              :item="item"
              :i="i"
              :title="title"
              type="파일"
            />
          </v-card>
          <div v-else-if="item.type === '파일 (숙제로)'">
            <v-card
              v-if="userInfo.is(item.uid) || userInfo.is(classInfo.uid)"
              :href="item.url"
              class="d-flex"
              rounded="lg"
              variant="outlined"
            >
              <template #prepend>
                <v-icon class="ml-4"> mdi-note </v-icon>
              </template>

              <v-card-item>
                <v-card-title>{{ item.file }}</v-card-title>
                <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
              </v-card-item>

              <v-spacer />

              <ClassActions
                v-if="userInfo.is(item.uid)"
                :item="item"
                :i="i"
                :title="title"
                type="파일"
              />
            </v-card>
            <v-card v-else variant="tonal" rounded="lg">
              <template #prepend>
                <v-icon> mdi-note </v-icon>
              </template>
              <v-card-item>
                <v-card-title> 비공개 파일 </v-card-title>
                <v-card-subtitle>
                  {{ item.displayName || '?' }}
                </v-card-subtitle>
              </v-card-item>
            </v-card>
          </div>
          <v-card
            v-else-if="item.type === '링크'"
            class="d-flex mt-5 pa-2"
            variant="outlined"
            :href="item.link"
            target="_blank"
            rounded="lg"
          >
            <template #prepend>
              <v-icon class="ml-4"> mdi-link </v-icon>
            </template>

            <v-card-item>
              <v-card-title>{{ item.name }} 링크</v-card-title>
              <v-card-subtitle>
                <a :href="item.link" target="_blank" v-text="item.title" />
              </v-card-subtitle>
            </v-card-item>

            <v-spacer />

            <ClassActions
              v-if="userInfo.is(item.uid)"
              :item="item"
              :i="i"
              :title="title"
              type="other"
            />
          </v-card>
          <v-card
            v-else-if="item.type === '파일 비디오'"
            class="mt-5"
            variant="outlined"
          >
            <div class="d-flex">
              <v-card-item>
                <v-card-title>{{ item.file }}</v-card-title>
                <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
              </v-card-item>

              <ClassActions
                v-if="userInfo.is(item.uid)"
                :item="item"
                :i="i"
                :title="title"
                type="파일"
              />
            </div>
            <v-card-text>
              <video width="320" height="240" controls autoplay loop muted>
                <source :src="item.url" type="video/mp4" />
                비디오 태그를 지원하지 않는 브라우저입니다.
              </video>
            </v-card-text>
          </v-card>
          <div v-else-if="item.type === '숙제 제출 (학생)'">
            <v-card class="d-flex mt-5" variant="outlined">
              <div>
                <v-card-title>{{ item.title }}</v-card-title>
                <v-card-text>
                  {{ item.content }}
                </v-card-text>
              </div>

              <v-spacer />

              <ClassActions
                v-if="userInfo.is(item.uid)"
                :item="item"
                :i="i"
                :title="title"
                type="other"
              />
            </v-card>
          </div>
          <v-card v-else class="mt-5" variant="outlined">
            <div class="d-flex">
              <v-avatar size="45" class="ml-3 mt-4">
                <UserPhoto :size="45" :src="item?.photoURL" />
              </v-avatar>
              <v-card-item>
                <v-card-title>
                  {{ item.displayName }}님의 공지사항
                </v-card-title>
                <v-card-subtitle>
                  {{ new Date(item.time).toLocaleDateString() }}
                </v-card-subtitle>
              </v-card-item>

              <v-spacer />

              <ClassActions
                v-if="userInfo.is(item.uid)"
                :item="item"
                :i="i"
                :title="title"
                type="other"
              />
            </div>
            <v-card-text>{{ item.content }}</v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
const userInfo = User()
const other = ref([])

const props = defineProps({
  classInfo: {
    type: Object,
    required: true
  }
})

onMounted(async () => {
  other.value = await props.classInfo.contents.find(({ key }) => key === '기타')
})
</script>

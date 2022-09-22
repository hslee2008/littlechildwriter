<template>
  <div>
    <v-card
      v-for="(category, title) in classInfo.contents"
      :key="title"
      class="transparent"
    >
      <v-card-title>{{ title }}</v-card-title>

      <div v-for="(item, i) in category" :key="item.title">
        <v-card
          v-if="item.type === '책'"
          class="d-flex mt-5"
          :to="`/book/content/${item.time}`"
        >
          <v-icon color="orange" class="ml-4" size="40"> mdi-book </v-icon>
          <div>
            <v-card-title>{{ item.displayName }}</v-card-title>
            <v-card-subtitle>{{ item.title }}</v-card-subtitle>
            <v-card-text>
              {{ new Date(item.time).toLocaleDateString() }}
            </v-card-text>
          </div>

          <v-spacer />

          <v-card-actions>
            <v-menu v-if="userInfo.uid === item.uid" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  cols="1"
                  v-on="on"
                  @click.stop.prevent=""
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="DeleteContent(title, i)">
                  <v-list-item-title>
                    <v-icon left> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
        <v-card
          v-else-if="item.type === '파일'"
          :href="item.url"
          class="d-flex mt-5"
        >
          <v-icon class="ml-4"> mdi-link-variant </v-icon>

          <div>
            <v-card-title>{{ item.file }}</v-card-title>
            <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
          </div>

          <v-spacer />

          <v-card-actions>
            <v-menu v-if="userInfo.uid === item.uid" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  cols="1"
                  v-on="on"
                  @click.stop.prevent=""
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="DeleteContent(title, i)">
                  <v-list-item-title>
                    <v-icon left> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
        <v-card
          v-else-if="
            item.type === '파일 (숙제로)' &&
            (userInfo.uid === item.uid || userInfo.uid === classInfo.uid)
          "
          :href="item.url"
          class="d-flex rounded-0"
        >
          <v-icon class="ml-4"> mdi-link-variant </v-icon>

          <div>
            <v-card-title>{{ item.file }}</v-card-title>
            <v-card-subtitle>{{ item.displayName }}</v-card-subtitle>
          </div>

          <v-spacer />

          <v-card-actions>
            <v-menu v-if="userInfo.uid === item.uid" offset-y>
              <template #activator="{ on, attrs }">
                <v-btn
                  icon
                  v-bind="attrs"
                  cols="1"
                  v-on="on"
                  @click.stop.prevent=""
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item @click="DeleteContent(title, i)">
                  <v-list-item-title>
                    <v-icon left> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
        <v-card v-else-if="item.type === '링크'" class="d-flex mt-5">
          <v-icon class="ml-4"> mdi-link </v-icon>

          <div>
            <v-card-title>{{ item.name }} 링크</v-card-title>
            <v-card-subtitle>
              <a :href="item.link" target="_blank" v-text="item.title" />
            </v-card-subtitle>
          </div>
        </v-card>
        <div v-else-if="item.type === '숙제'">
          <v-card
            class="d-flex mt-5 rounded-b-0"
            @click="
              () => {
                tab = 1
                post.type = '파일 (숙제로)'
                post.category = item.title
              }
            "
          >
            <v-icon class="ml-4"> mdi-school </v-icon>

            <div>
              <v-card-title>{{ item.title }} 숙제</v-card-title>
            </div>
          </v-card>
          <v-divider />
        </div>
        <v-card v-else class="mt-5">
          <div class="d-flex">
            <v-avatar size="40" class="ml-3 mt-6">
              <v-img :src="item.photoURL" class="rounded-lg" />
            </v-avatar>
            <div>
              <v-card-title>{{ item.displayName }}의 공지사항</v-card-title>
              <v-card-subtitle>
                {{ new Date(item.time).toLocaleDateString() }}
              </v-card-subtitle>
            </div>
            <v-spacer />
            <v-card-actions>
              <v-menu v-if="userInfo.uid === item.uid" offset-y>
                <template #activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    cols="1"
                    v-on="on"
                    @click.stop.prevent=""
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="DeleteContent(title, i)">
                    <v-list-item-title>
                      <v-icon left> mdi-trash-can </v-icon> 삭제
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-card-actions>
          </div>
          <v-card-text>{{ item.content }}</v-card-text>
        </v-card>
      </div>
    </v-card>
  </div>
</template>
<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const route = useRoute()
const id = route.params.class
const classInfo = ref<any>({})
const listev = ref<any[]>([])
const post = ref<any>({
  isbn: '',
  title: '',
  image: '',
  pageCount: '',
  categories: [] as string[],
  rating: 5,
  content: '',
  uid: '',
  displayName: '',
  author: '',
  views: 0,
  time: Date.now(),
  isPublic: true,
  file: [] as File[],
  type: '책',
  category: '기타',
  book: true,
  link: ''
})
const tab = ref<number>(0)

onBeforeMount(() => {
  db.ref(`/classes/${id}`).on(
    'value',
    async s => (classInfo.value = await s.val())
  )

  db.ref('/contents/').on('child_added', s => {
    const { title, time, uid, displayName, image } = s.val()

    listev.value.unshift({
      title,
      time,
      uid,
      displayName,
      image
    })
  })
})

const DeleteContent = (title: number, i: number) => {
  db.ref(`/classes/${id}/contents/${title}/${i}`).remove()
}
</script>

<style scoped>
.gap20 {
  gap: 20px;
}
</style>

<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-card>
      <NLink to="./markdown" class="text-decoration-none">
        <v-card-subtitle>
          Markdown을 지원합니다 <v-icon small>mdi-information</v-icon>
        </v-card-subtitle>
      </NLink>
      <v-card-title>
        <v-text-field
          v-model="topic"
          label="Topic"
          placeholder="Topic"
          required
        />
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="content"
          label="Content"
          placeholder="Content"
          hint="Markdown을 사용할 수 있습니다."
          required
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="SaveContent">Save</v-btn>
      </v-card-actions>
    </v-card>

    <br />

    <v-card>
      <v-card-title>미리보기</v-card-title>
      <v-card-text v-html="parse(content)" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { parse } from 'marked'
import { db } from 'plugins/firebase'
import { User } from 'plugins/global'

const userInfo = User()
const router = useRouter()
const topic = ref('')
const content = ref('')

const SaveContent = () => {
  const time = Date.now()
  const { uid, displayName, photoURL } = userInfo.value

  db.ref(`/blog/${time}`).set({
    topic: topic.value,
    markdown: parse(content.value),
    uid,
    displayName,
    photoURL,
    time,
    pro: {},
    con: {}
  })

  Libris(userInfo.value.uid, 50)

  router.push(`/blog/content/${time}`)
}

useHead({
  title: '창작 코너 글쓰기 - Little Child Writer'
})
</script>

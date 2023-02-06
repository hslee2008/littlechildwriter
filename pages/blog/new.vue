<template>
  <div>
    <v-card class="pa-2">
      <v-card-title>
        <v-text-field
          v-model="topic"
          variant="outlined"
          label="Topic"
          placeholder="Topic"
          required
        />
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="content"
          variant="outlined"
          label="Content"
          placeholder="Content"
          required
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn
          rounded="lg"
          variant="tonal"
          color="primary"
          @click="SaveContent"
        >
          올리기
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()
const userInfo = User()
const topic = ref('')
const content = ref('')

const SaveContent = () => {
  const time = Date.now()
  const { uid, displayName, photoURL } = userInfo

  $db.ref(`/blog/${time}`).set({
    topic: topic.value,
    markdown: content.value,
    uid,
    displayName,
    photoURL,
    time
  })

  Libris(userInfo.uid, 50)

  navigateTo(`/blog/content/${time}`)
}

useHead({
  title: '창작 코너 글쓰기 - Little Child Writer'
})
</script>

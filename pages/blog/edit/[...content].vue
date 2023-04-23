<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-card>
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
          업데이트
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()
const route = useRoute()
const time = route.params.content
const userInfo = User()
const topic = ref('')
const content = ref('')

onBeforeMount(() => {
  $db
    .ref(`blog/${time}`)
    .once('value')
    .then((s: any) => {
      const data = s.val()
      topic.value = data.topic
      content.value = data.markdown
    })
})

const SaveContent = () => {
  const { uid, displayName, photoURL } = userInfo

  $db.ref(`/blog/${time}`).update({
    topic: topic.value,
    markdown: content.value,
    uid,
    displayName,
    photoURL
  })

  navigateTo(`/blog/content/${time}`)
}

useHead({
  title: '창작 코너 업데이트 - Little Child Writer'
})

definePageMeta({
  middleware: ['notloggedin']
})
</script>

<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-card class="transparent">
      <h1>{{ content?.topic }}</h1>
      <v-card class="d-flex transparent" :to="`/user/${content.uid}`">
        <v-avatar class="my-auto ml-2">
          <UserPhoto :src="content?.photoURL" />
        </v-avatar>
        <div>
          <v-card-title>{{ content?.displayName }}</v-card-title>
          <v-card-subtitle class="grey--text">
            {{ new Date(content?.time).toLocaleDateString() }}
          </v-card-subtitle>
        </div>
      </v-card>
      <v-card-text v-html="content?.markdown"></v-card-text>
    </v-card>

    <LazyCommentComponent
      :link="`/blog/content/${time}`"
      :dbr="`blog/${time}/comments`"
      :uid="content.uid"
    />
  </div>
</template>

<script setup lang="ts">
import { db } from 'plugins/firebase'

const route = useRoute()
const time = route.params.content
const content = ref<any>({
  topic: '',
  markdown: '',
  displayName: '',
  photoURL: '',
  time: 0,
  uid: ''
})

onMounted(() => {
  db.ref(`/blog/${time}`).on('value', s => (content.value = s.val()))
})
</script>

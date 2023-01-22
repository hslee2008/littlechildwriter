<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-card :color="themeColor()" class="elevation-0">
      <h1>{{ content?.topic }}</h1>
      <v-card
        class="d-flex elevation-0"
        :color="themeColor()"
        :to="`/user/${content.uid}`"
      >
        <v-avatar size="45" class="my-auto ml-2">
          <UserPhoto :size="45" :src="content?.photoURL" />
        </v-avatar>
        <div>
          <v-card-title>{{ content?.displayName }}</v-card-title>
          <v-card-subtitle class="text-grey">
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
      class="mt-3"
    />
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

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
  $db.ref(`/blog/${time}`).on('value', (s: any) => (content.value = s.val()))
})
</script>

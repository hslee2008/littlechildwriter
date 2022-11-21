<template>
  <div>
    <v-card class="d-flex transparent" :to="`/user/${threadData.uid}`">
      <v-avatar class="my-auto ml-2">
        <UserPhoto :src="threadData.photoURL" />
      </v-avatar>
      <div>
        <v-card-title>{{ threadData.displayName }}</v-card-title>
        <v-card-subtitle class="grey--text">
          {{ new Date(threadData.time).toLocaleDateString() }}
        </v-card-subtitle>
      </div>
    </v-card>
    <v-card-title>{{ threadData.topic }}</v-card-title>

    <br /><br />

    <LazyCommentComponent
      :link="`/debate/thread/${time}+${side}+${thread}`"
      :dbr="`debate/${time}/${side}/${thread}/comments`"
      :uid="threadData.uid"
    />
  </div>
</template>

<script setup lang="ts">
import { db } from 'plugins/firebase'

const route = useRoute()
const [time, side, thread] = route.params.thread.split('+')
const threadData = ref<any>({})

onMounted(() => {
  db.ref(`debate/${time}/${side}/${thread}`).on('value', async snapshot => {
    threadData.value = await snapshot.val()
  })
})
</script>

<script lang="ts">
export default {
  name: 'Thread',
  inheritAttrs: false,
  customOptions: {}
}
</script>

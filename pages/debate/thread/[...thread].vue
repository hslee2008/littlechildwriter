<template>
  <div>
    <v-card class="d-flex" :to="`/user/${threadData.uid}`">
      <v-avatar size="45" class="my-auto ml-2">
        <UserPhoto :size="45" :src="threadData?.photoURL" />
      </v-avatar>

      <div>
        <v-card-title>{{ threadData.displayName }}</v-card-title>
        <v-card-subtitle class="text-grey">
          {{ new Date(threadData.time).toLocaleDateString() }}
        </v-card-subtitle>
      </div>
    </v-card>
    <v-card-title>{{ threadData.topic }}</v-card-title>

    <br /><br />

    <CommentComponent
      :link="`/debate/thread/${time}+${side}+${thread}`"
      :dbr="`debate/${time}/${side}/${thread}/comments`"
      :uid="threadData.uid"
    />
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const route = useRoute()
const [time, side, thread] = route.params.thread[0].split('+')
const threadData = ref<any>({})

onMounted(() => {
  $db.ref(`debate/${time}/${side}/${thread}`).on('value', async (s: any) => {
    threadData.value = await s.val()
  })
})
</script>

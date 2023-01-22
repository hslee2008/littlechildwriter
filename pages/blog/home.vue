<template>
  <div>
    <div class="d-flex">
      <h1>창작 코너</h1>

      <v-btn rounded="lg"
        variant="tonal"
        icon="mdi-plus"
        color="primary"
        size="small"
        class="rounded-lg ml-1 mb-5"
        to="./new"
      />
    </div>

    <v-list nav :bg-color="themeColor()">
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/blog/content/${item.time}`"
      >
        <template #prepend>
          <UserPhoto :size="45" :src="item?.photoURL" />
        </template>

        <v-list-item-title>{{ item.topic }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>

        <v-spacer />

        <template v-if="item.uid == userInfo.uid" #append>
          <v-menu offset-y>
            <template #activator="{ props }">
              <v-btn rounded="lg" icon v-bind="props" cols="1" @click.stop.prevent="">
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="DeleteContent(i)">
                <v-list-item-title>
                  <v-icon start> mdi-trash-can </v-icon> 삭제
                </v-list-item-title>
              </v-list-item>
              <v-list-item :to="`./edit/${item.time}`">
                <v-list-item-title>
                  <v-icon start> mdi-pencil </v-icon> 편집
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const list = ref<any>([])

onMounted(() =>
  $db
    .ref('/blog')
    .on('child_added', async (s: any) => list.value.unshift(await s.val()))
)

const DeleteContent = (i: number) => {
  $db.ref(`/blog/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
}

useHead({
  title: '창작 코너 - LCW'
})
</script>

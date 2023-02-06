<template>
  <div>
    <div>
      <h1>토론 광장</h1>

      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="ml-3 my-5"
        to="./new"
      >
        <v-icon start>mdi-plus</v-icon> 새 토론 주제
      </v-btn>
    </div>

    <v-list nav>
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/debate/topic/${item.time}`"
      >
        <template #prepend>
          <v-avatar size="45">
            <UserPhoto :size="45" :src="item?.photoURL" />
          </v-avatar>
        </template>

        <v-list-item-title>{{ item.topic }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>

        <v-spacer />

        <template #append>
          <v-icon start class="mr-2">mdi-comment-flash</v-icon>
          {{ Object.keys({ ...item.pro, ...item.con } ?? {}).length }}

          <v-list-item-action v-if="userInfo.is(item.uid)">
            <v-btn variant="plain" rounded="lg" icon cols="1" @click.stop.prevent="">
              <v-icon>mdi-dots-vertical</v-icon>

              <v-menu offset-y activator="parent">
                <v-list>
                  <v-list-item @click="DeleteContent(i)">
                    <v-list-item-title>
                      <v-icon start> mdi-trash-can </v-icon> 삭제
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-list-item-action>
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
    .ref('/debate')
    .on('child_added', async (s: any) => list.value.unshift(await s.val()))
)

const DeleteContent = (i: number) => {
  $db.ref(`/debate/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
}

useHead({
  title: '토론 광장 - LCW'
})
</script>

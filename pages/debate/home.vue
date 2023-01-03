<template>
  <div>
    <div class="d-flex">
      <h1>토론 광장</h1>
      <v-btn icon="mdi-plus" size="small" color="primary" class="ml-3" rounded to="./new" />
    </div>

    <v-list nav bg-color="#23262e">
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/debate/topic/${item.time}`"
      >
        <template #prepend>
          <v-avatar> <UserPhoto :src="item.photoURL" /></v-avatar>
        </template>

        <v-list-item-title>{{ item.topic }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>

        <v-spacer />

        <template #append>
          <v-icon start class="mr-2">mdi-comment-flash</v-icon>
          {{ Object.keys({ ...item.pro, ...item.con } ?? {}).length }}

          <v-list-item-action v-if="item.uid == userInfo.uid">
            <v-btn
              icon
              cols="1"
              flat
              color="#23262e"
              @click.stop.prevent=""
              id="btn"
            >
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>

            <v-menu offset-y activator="#btn">
              <v-list>
                <v-list-item @click="DeleteContent(i)">
                  <v-list-item-title>
                    <v-icon start> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
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

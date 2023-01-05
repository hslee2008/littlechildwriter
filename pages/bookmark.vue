<template>
  <div>
    <h1><v-icon start>mdi-bookmark</v-icon> 책갈피</h1>

    <br />

    <v-list v-if="items.length > 0" :model-value="items" bg-color="#23262e" nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="item.time"
        :to="`/book/content/${item.time}`"
        bg-color="#23262E"
      >
        <template #append>
          <v-btn
            icon="mdi-delete"
            color="#23262e"
            flat
            @click.prevent.stop="deleteBookmark(item.time, i)"
          />
        </template>

        <v-list-item-title> {{ item.title }} </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-card v-else color="#23262e" class="elevation-0">
      <v-card-text> 책갈피가 없습니다. </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const items = ref<any>([])

useAuth((u: any) => {
  $db
    .ref(`/users/${u?.uid}/bookmarks`)
    .on('child_added', async (s: any) => items.value.push(await s.val()))
})

const deleteBookmark = (time: string, i: number) => {
  $db.ref(`/users/${userInfo.value.uid}/bookmarks/${time}`).remove()
  $db.ref(`/contents/${time}/bookmarks/${userInfo.value.uid}`).remove()
  items.value.splice(i, 1)
}

useHead({
  title: '책갈피 - LCW'
})
</script>

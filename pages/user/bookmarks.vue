<template>
  <div>
    <h1><v-icon start>mdi-bookmark</v-icon> 책갈피</h1>

    <v-list v-if="bookmarks.length > 0" v-model="bookmarks" nav>
      <v-list-item
        v-for="(item, i) in bookmarks"
        :key="item.time"
        :to="`/book/content/${item.time}`"
      >
        <template #append>
          <v-btn
            variant="tonal"
            icon="mdi-delete"
            @click.prevent.stop="deleteBookmark(item.time, i)"
          />
        </template>

        <v-list-item-title> {{ item.title }} </v-list-item-title>
      </v-list-item>
    </v-list>
    <v-card v-else>
      <v-card-text> 책갈피가 없습니다. </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const bookmarks = ref<any>([])

useAuth((u: any) => {
  $db.ref(`/users/${u?.uid}/bookmarks`).once('value', (snapshot: any) => {
    const data = snapshot.val()

    if (data) {
      bookmarks.value = Object.values(data)
    }
  })
})

const deleteBookmark = (time: string, i: number) => {
  $db.ref(`/users/${userInfo.uid}/bookmarks/${time}`).remove()
  $db.ref(`/contents/${time}/bookmarks/${userInfo.uid}`).remove()
  bookmarks.value.splice(i, 1)
}

useHead({
  title: '책갈피 - LCW'
})
</script>

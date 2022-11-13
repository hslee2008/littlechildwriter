<template>
  <div>
    <h1><v-icon left>mdi-bookmark</v-icon> 책갈피</h1>
    <v-list v-if="items.length > 0" v-model="items" class="transparent" nav>
      <v-list-item
        v-for="(item, i) in items"
        :key="item.time"
        :to="`/book/content/${item.time}`"
        :color="$vuetify.theme.dark ? '#23262E' : 'white'"
      >
        <v-list-item-content>
          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item-content>

        <v-list-item-action>
          <v-spacer />
          <v-btn
            icon
            color="red"
            @click.prevent.stop="deleteBookmark(item.time, i)"
          >
            <v-icon>mdi-delete</v-icon>
          </v-btn>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-card v-else class="transparent">
      <v-card-text> 책갈피가 없습니다. </v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { auth, db } from 'plugins/firebase'
import { User } from 'plugins/global'

const userInfo = User()
const items = ref<any>([])

onMounted(() =>
  auth.onAuthStateChanged(u =>
    db
      .ref(`/users/${u?.uid}/bookmarks`)
      .on('child_added', async s => items.value.push(await s.val()))
  )
)

const deleteBookmark = (time: string, i: number) => {
  db.ref(`/users/${userInfo.value.uid}/bookmarks/${time}`).remove()
  db.ref(`/contents/${time}/bookmarks/${userInfo.value.uid}`).remove()
  items.value.splice(i, 1)
}

useHead({
  title: '책갈피 - LCW'
})
</script>

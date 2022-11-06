<template>
  <div>
    <h1><v-icon left>mdi-bookmark</v-icon> 책갈피</h1>
    <v-list
      v-if="items.length > 0"
      v-model="items"
      class="transparent"
      nav
      @change="onChange"
    >
      <v-list-item
        v-for="(item, i) in items"
        :key="item.time"
        :to="`/book/content/${item.time}`"
        style="background-color: #22262e"
      >
        <v-list-item-content>
          <v-list-item-title> {{ item.title }} </v-list-item-title>
        </v-list-item-content>
        <v-list-item-action>
          <v-spacer />
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn icon v-bind="attrs" cols="1" v-on="on" @click.prevent>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="deleteBookmark(item.time, i)">
                <v-list-item-content>
                  <v-list-item-title>
                    <v-icon left> mdi-trash-can </v-icon>
                    삭제
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-card v-else class="transparent">
      <v-card-text> 북마크가 없습니다. </v-card-text>
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

const onChange = () =>
  db.ref(`/users/${userInfo.value.uid}/bookmarks`).set(items.value)

useHead({
  title: '책갈피 - LCW'
})
</script>

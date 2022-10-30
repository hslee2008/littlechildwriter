<template>
  <div>
    <h1>토론 광장</h1>

    <v-list nav class="transparent">
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/debate/topic/${item.time}`"
      >
        <v-list-item-avatar>
          <UserPhoto :src="item.photoURL" />
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title>{{ item.topic }}</v-list-item-title>
          <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>
        </v-list-item-content>

        <v-spacer />

        <v-icon left>mdi-comment-flash</v-icon>
        {{ Object.keys(item.pro).length + Object.keys(item.con).length }}

        <v-card-actions v-if="item.uid == userInfo.uid">
          <v-menu offset-y>
            <template #activator="{ on, attrs }">
              <v-btn
                icon
                v-bind="attrs"
                cols="1"
                v-on="on"
                @click.stop.prevent=""
              >
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="DeleteContent(i)">
                <v-list-item-title>
                  <v-icon left> mdi-trash-can </v-icon> 삭제
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-card-actions>
      </v-list-item>
    </v-list>

    <v-btn bottom right fixed fab color="primary" class="zmax" to="./new">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </div>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { User } from '@/plugins/global'

const userInfo = User()
const list = ref<any>([])

onMounted(() => {
  db.ref('/debate').on('child_added', async s => {
    list.value.unshift(await s.val())
  })
})

const DeleteContent = (i: number) => {
  db.ref(`/debate/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
}

useHead({
  title: '토론 광장 - LCW'
})
</script>

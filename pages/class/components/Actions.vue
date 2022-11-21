<template>
  <v-card-actions>
    <v-menu offset-y>
      <template #activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" cols="1" v-on="on" @click.stop.prevent="">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="DeleteContent(title, i)">
          <v-list-item-title>
            <v-icon left> mdi-trash-can </v-icon> 삭제
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card-actions>
</template>

<script setup lang="ts">
import { db, storage } from 'plugins/firebase'

const route = useRoute()
const props = defineProps<{
  item: any
  i: string
  title: string
  type: string
}>()
const id = route.params.class

const DeleteContent = (title: string, i: string) => {
  db.ref(`/classes/${id}/contents/${title}/${i}`).remove()
  props.type === '파일' && storage.ref(`${props.type}`).delete()
}
</script>

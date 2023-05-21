<template>
  <v-card-actions>
    <v-btn cols="1" icon @click.stop.prevent="">
      <v-icon>mdi-dots-vertical</v-icon>

      <v-menu offset-y activator="parent">
        <v-list>
          <v-list-item @click="DeleteContent(title, i)">
            <v-list-item-title>
              <v-icon start> mdi-trash-can </v-icon> 삭제
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>
  </v-card-actions>
</template>

<script setup lang="ts">
const { $db, $storage } = useNuxtApp()

const route = useRoute()
const props = defineProps<{
  item: any
  i: string
  title: string
  type: string
}>()
const id = route.params.class

const DeleteContent = (title: string, i: string) => {
  $db.ref(`/classes/${id}/contents/${title}/${i}`).remove()
  props.type === '파일' && $storage.ref(`${props.type}`).delete()
}
</script>

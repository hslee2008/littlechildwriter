<template>
  <v-card-actions>
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn variant="tonal" icon v-bind="props" cols="1" @click.stop.prevent="">
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item @click="DeleteContent(title, i)">
          <v-list-item-title>
            <v-icon start> mdi-trash-can </v-icon> 삭제
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
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

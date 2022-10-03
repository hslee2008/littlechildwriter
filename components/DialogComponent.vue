<template>
  <v-dialog v-model="dialog" width="500">
    <template #activator="{ on, attrs }">
      <v-btn
        color="red lighten-2"
        v-bind="attrs"
        class="delete"
        @click="dialog = true"
        v-on="on"
      >
        <v-icon left> mdi-{{ icon }} </v-icon>
        {{ btnTitle }}
      </v-btn>
    </template>

    <v-card>
      <v-card-title>{{ title }}</v-card-title>
      <v-card-text>{{ text }}</v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" class="m-3 ok" @click="cb"> 확인 </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const dialog = ref<boolean>(false)
const props = defineProps({
  title: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  cb: {
    type: Function,
    required: true
  },
  btnTitle: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

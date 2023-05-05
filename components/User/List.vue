<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-row class="d-flex justify-center align-center my-5">
    <v-col
      v-for="(item, i) in lbt.slice(0, 3)"
      :key="i"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <v-card :to="`/user/${item.uid}`" variant="outlined">
        <v-card-text class="text-center">
          <UserPhoto :size="65" :src="item.photoURL" />
        </v-card-text>

        <v-card-subtitle class="text-center">
          {{ i + 1 }}등
        </v-card-subtitle>
        <v-card-title class="text-center">
          {{ item.displayName }}
        </v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-list v-if="!limit" nav lines="two">
    <v-list-item
      v-for="(item, i) in lbt.slice(3, -2)"
      v-show="lbt[i].displayName"
      :key="lbt[i].uid"
      :to="`/user/${lbt[i].uid}`"
      :title="lbt[i]?.displayName"
      :subtitle="`${formatter(lbt[i].libris)} 리브리스`"
    >
      <template #prepend>
        {{ i + 1 }}등
        <v-avatar size="45" color="grey-lighten-1" class="ml-3">
          <UserPhoto :size="45" :src="lbt[i]?.photoURL ?? ''" />
        </v-avatar>
      </template>

      <template #append>
        <v-avatar size="45">
          <v-icon :color="item.status === 'online' ? 'primary' : 'grey'">
            mdi-account-{{ item.status === 'online' ? 'check' : 'remove' }}
          </v-icon>
        </v-avatar>
      </template>
    </v-list-item>
  </v-list>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const props = defineProps({
  limit: {
    type: Boolean,
    required: true
  }
})
const lbt = ref<any>([])

onBeforeMount(() => (props.limit ? Limited() : UnLimited()))

const Handler = async (s: any) => {
  const { displayName, libris, photoURL, status } = await s.val()

  lbt.value.unshift({
    displayName,
    libris,
    photoURL,
    status,
    uid: s.key
  })
}

const Limited = () => {
  $db
    .ref('/users')
    .orderByChild('libris')
    .limitToLast(3)
    .on('child_added', Handler)
}

const UnLimited = () => {
  $db.ref('/users').orderByChild('libris').on('child_added', Handler)
}
</script>

<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-list nav :bg-color="themeColor()" lines="two">
    <v-list-item
      v-for="(item, i) in lbt"
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
    .limitToLast(5)
    .on('child_added', Handler)
}

const UnLimited = () => {
  $db.ref('/users').orderByChild('libris').on('child_added', Handler)
}
</script>

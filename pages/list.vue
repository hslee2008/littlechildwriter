<template>
  <div>
    <v-row class="mt-5 g-10">
      <BookCard
        :items="books.slice((page - 1) * itemsPerPage, page * itemsPerPage)"
      />
    </v-row>

    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.ceil(books.length / itemsPerPage)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const route = useRoute()
const books = ref<any[]>([])
// eslint-disable-next-line func-call-spacing
const search = ref<string | (string | null)[]>('')
const page = ref<number>(1)
const itemsPerPage = ref<number>(15)

onBeforeMount(() => {
  route.query.search && (search.value = route.query.search)
  $db
    .ref('contents')
    .on('child_added', async (s: any) => books.value.unshift(await s.val()))
})

useHead({
  title: '리스트 - LCW'
})
</script>

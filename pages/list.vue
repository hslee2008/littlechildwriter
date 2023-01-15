<template>
  <div>
    <v-row class="mt-5 g-10">
      <v-col cols="12">
        <v-text-field
          v-model="search"
          label="검색"
          outlined
          dense
          variant="outlined"
        />
      </v-col>
    </v-row>

    <v-row class="mt-5 g-10">
      <BookCard
        :items="books.slice((page - 1) * itemsPerPage, page * itemsPerPage).filter((book: any) => {
            return (
              book.title.toLowerCase().includes(search.toLowerCase()) ||
              book.displayName.toLowerCase().includes(search.toLowerCase()) ||
              book.categories.includes(search.toLowerCase())
            )
          })"
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

const books = ref<any[]>([])
// eslint-disable-next-line func-call-spacing
const search = ref<string>('')
const page = ref<number>(1)
const itemsPerPage = ref<number>(12)
const latest = ref<boolean>(true)

onBeforeMount(() => {
  $db
    .ref('contents')
    .on('child_added', async (s: any) => books.value.unshift(await s.val()))
})

useHead({
  title: '리스트 - LCW'
})
</script>

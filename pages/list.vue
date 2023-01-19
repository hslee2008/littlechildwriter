<template>
  <div>
    <v-row class="mt-5 mx-2 g-10">
      <v-col cols="12">
        <v-text-field
          v-model="search"
          variant="outlined"
          label="검색"
          outlined
          dense
          :loading="loading"
        />
      </v-col>
    </v-row>

    <v-row class="mt-5 g-10">
      <BookCard
        :items="books.filter((book: any) => {
          return (
            (book.title?.toLowerCase() ?? []).includes(search?.toLowerCase()) ||
            book.displayName?.toLowerCase().includes(search?.toLowerCase()) ||
            (book?.categories ?? []) === (search?.toLowerCase()) ||
            search === ''
          )
        }).slice((page - 1) * itemsPerPage, page * itemsPerPage)"
      />
    </v-row>

    <div class="d-flex text-center">
      <v-select
        v-model="itemsPerPage"
        :items="[12, 24, 36]"
        variant="outlined"
        dense
        class="mr-10"
      />

      <v-btn icon variant="plain" color="blue darken-3" @click="Before">
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
      <v-btn
        icon
        variant="plain"
        color="blue darken-3"
        @click="Next"
        class="mr-10"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()

const books = ref<any[]>([])
// eslint-disable-next-line func-call-spacing
const search = ref<string>('')
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)
const loading = ref<boolean>(true)

onBeforeMount(() => {
  $db
    .ref('contents')
    .on('child_added', async (s: any) => books.value.unshift(await s.val()))

  setTimeout(() => {
    loading.value = false
  }, 4000)

  if (mobile.value) {
    itemsPerPage.value = 12
  }
})

const Before = () => {
  if (page.value > 1) {
    page.value--
  }

  window.scrollTo(0, 0)
}

const Next = () => {
  if (page.value < Math.ceil(books.value.length / itemsPerPage.value)) {
    page.value++
  }

  window.scrollTo(0, 0)
}

useHead({
  title: '리스트 - LCW'
})
</script>

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
        />
      </v-col>
    </v-row>

    <v-card
      v-if="loading"
      :color="themeColor()"
      class="elevation-0 text-center"
    >
      <v-card-text>
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="primary"
          size="30"
        />

        <v-card-title>책을 불러오는 중입니다...</v-card-title>
      </v-card-text>
    </v-card>
    <BookCard
      v-else
      :items="
        books.filter((book: any) => {
          return (
            (book.title?.toLowerCase() ?? []).includes(search?.toLowerCase()) ||
            book.displayName?.toLowerCase().includes(search?.toLowerCase()) ||
            (book?.categories ?? []) === (search?.toLowerCase()) ||
            search === ''
          )
        }).slice((page - 1) * itemsPerPage, page * itemsPerPage)
      "
    />

    <div class="d-flex text-center ma-3 mx-5">
      <v-row class="mt-10" align="center" justify="center">
        <v-menu top>
          <template #activator="{ props }">
            <v-btn text color="primary" variant="tonal" class="ml-2" v-bind="props">
              {{ itemsPerPage }}
              <v-icon right> mdi-chevron-down </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="num in [10, 50, 150, 200]"
              :key="num"
              @click="itemsPerPage = num"
            >
              <v-list-item-title>{{ num }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer />

        <span class="mr-4 grey--text"> {{ page }} / {{ numberOfPages }} </span>
        <v-btn icon variant="plain" color="blue darken-3" @click="Before">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon variant="plain" color="blue darken-3" @click="Next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const books = ref<any[]>([])
// eslint-disable-next-line func-call-spacing
const search = ref<string>('')
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)
const numberOfPages = computed(() =>
  Math.ceil(books.value.length / itemsPerPage.value)
)
const loading = ref<boolean>(true)

onBeforeMount(() => {
  $db
    .ref('contents')
    .on('child_added', async (s: any) => books.value.unshift(await s.val()))

  setTimeout(() => {
    loading.value = false
  }, 4000)
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

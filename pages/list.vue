<template>
  <v-data-iterator
    :items="books"
    :items-per-page.sync="itemsPerPage"
    :page.sync="page"
    :search="search"
    :sort-by="sortBy.toLowerCase()"
    :sort-desc="sortDesc"
    hide-default-footer
    loading-text="로딩중..."
    no-data-text="로딩중..."
    class="mb-10"
  >
    <template #header>
      <v-text-field
        :model-value="search"
        label="Search"
        outlined
        rounded
        class="my-2 mr-2 rounded-xl"
      />

      <v-switch
        :model-value="sortDesc"
        :label="sortDesc ? '최신순' : '오래된순'"
        hide-details
        class="my-2"
      />
    </template>

    <template #default="props">
      <v-row class="mt-5 g-10">
        <BookCard :items="props.items" />
      </v-row>
    </template>

    <template #footer>
      <v-row class="mt-10" align="center" justify="center">
        <v-menu top>
          <template #activator="{ props }">
            <v-btn text color="primary" class="ml-2" v-bind="props">
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

        <span class="mr-4 text-grey"> {{ page }} / {{ numberOfPages }} </span>
        <v-btn icon color="blue darken-3" @click="Before">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon color="blue darken-3" @click="Next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp();

const route = useRoute()
const books = ref<any[]>([])
const sortBy = ref<string>('time')
// eslint-disable-next-line func-call-spacing
const search = ref<string | (string | null)[]>('')
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)
const sortDesc = ref<boolean>(true)

const numberOfPages = computed(() =>
  Math.ceil(books.value.length / itemsPerPage.value)
)

onBeforeMount(() => {
  route.query.search && (search.value = route.query.search)
  $db.ref('contents').on('child_added', async (s: any) =>
    books.value.unshift(await s.val())
  )
})

const Next = () => {
  page.value + 1 <= numberOfPages.value && (page.value += 1)
  window.scrollTo({ top: 0 })
}

const Before = () => {
  page.value - 1 >= 1 && (page.value -= 1)
  window.scrollTo({ top: 0 })
}

useHead({
  title: '리스트 - LCW'
})
</script>

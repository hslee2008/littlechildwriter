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
      <v-combobox
        v-model="search"
        :items="categories"
        auto-select-first
        cache-items
        label="Search"
        outlined
        hide-selected
        disable-lookup
        no-data-text
        open-on-clear
        rounded
        clearable
        class="my-2 mr-2 rounded-xl"
      />

      <v-switch
        v-model="sortDesc"
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
          <template #activator="{ on, attrs }">
            <v-btn text color="primary" class="ml-2" v-bind="attrs" v-on="on">
              {{ itemsPerPage }}
              <v-icon right> mdi-chevron-down </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(number, index) in [10, 50, 150, 200]"
              :key="index"
              @click="itemsPerPage = number"
            >
              <v-list-item-title>{{ number }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer />

        <span class="mr-4 grey--text"> {{ page }} / {{ numberOfPages }} </span>
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
import { db } from 'plugins/firebase'
import { Book } from 'plugins/global'

const route = useRoute()
const books = ref<Book[]>([])
const categories = ref<string[]>([])
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

  db.ref('/contents/').on('child_added', async s => {
    const book = await s.val()
    books.value.unshift(book)
    categories.value.push(
      ...(book.categories || ['Juvenile Fiction / General']).map((c: any) => {
        const category = c.split(' / ')
        return category[1]
      })
    )
    categories.value = [...new Set(categories.value)]
  })
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

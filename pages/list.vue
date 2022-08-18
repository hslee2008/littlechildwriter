<template>
  <v-data-iterator
    :items="books"
    :items-per-page.sync="itemsPerPage"
    :page.sync="page"
    :search="search"
    :sort-by="sortBy.toLowerCase()"
    :sort-desc="sortDesc"
    hide-default-footer
    class="mb-10"
  >
    <template #header>
      <v-text-field
        v-model="search"
        label="Search"
        outlined
        append-icon="mdi-swap-horizontal"
        @click:append="sortDesc = !sortDesc"
        class="ml-2 mr-2"
      />
    </template>

    <template #default="props">
      <v-row class="mt-5 gap10">
        <LazyBookCard :items="props.items" />
      </v-row>
    </template>

    <template #footer>
      <v-row class="mt-10" align="center" justify="center">
        <v-menu top>
          <template #activator="{ on, attrs }">
            <v-btn
              dark
              text
              color="primary"
              class="ml-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ itemsPerPage }}
              <v-icon right> mdi-chevron-down </v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item
              v-for="(number, index) in [10, 50, 100, 150]"
              :key="index"
              @click="itemsPerPage = number"
            >
              <v-list-item-title v-text="number" />
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer />

        <span class="mr-4 grey--text"> {{ page }} / {{ numberOfPages }} </span>
        <v-btn icon color="blue darken-3" @click="formerPage">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon color="blue darken-3" @click="nextPage">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  data() {
    return {
      books: [],
      sortBy: 'time',
      search: '',
      page: 1,
      itemsPerPage: 10,
      sortDesc: true
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.books.length / this.itemsPerPage)
    }
  },
  created() {
    this.$route.query.search && (this.search = this.$route.query.search)

    db.ref('/contents/').on('child_added', async s =>
      this.books.unshift(await s.val())
    )
  },
  methods: {
    nextPage() {
      this.page + 1 <= this.numberOfPages && (this.page += 1)
      window.scrollTo({ top: 0 })
    },
    formerPage() {
      this.page - 1 >= 1 && (this.page -= 1)
      window.scrollTo({ top: 0 })
    }
  }
}
</script>

<template>
  <v-data-iterator
    :items="listev"
    :items-per-page.sync="itemsPerPage"
    :page.sync="page"
    :search="search"
    :sort-by="sortBy.toLowerCase()"
    :sort-desc="sortDesc"
    hide-default-footer
    no-results-text="아무것도 없습니다..."
    no-data-text="로딩 중..."
    loading-text="로딩 중..."
    class="mb-10"
  >
    <template v-slot:header>
      <v-toolbar dark class="mb-1 transparent elevation-0">
        <v-text-field
          v-model="search"
          clearable
          flat
          solo-inverted
          hide-details
          prepend-inner-icon="mdi-magnify"
          label="Search"
        />
        <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-spacer></v-spacer>
          <v-select
            v-model="sortBy"
            flat
            solo-inverted
            hide-details
            :items="keys"
            prepend-inner-icon="mdi-magnify"
            label="Sort by"
          ></v-select>
          <v-spacer></v-spacer>
          <v-btn-toggle v-model="sortDesc" mandatory>
            <v-btn depressed :value="false">
              <v-icon>mdi-arrow-up</v-icon>
            </v-btn>
            <v-btn depressed :value="true">
              <v-icon>mdi-arrow-down</v-icon>
            </v-btn>
          </v-btn-toggle>
          <v-spacer></v-spacer>
          <v-btn text @click="simplify = !simplify">
            <v-icon left>mdi-{{ simplify ? 'eye' : 'eye-off' }}</v-icon>
            {{ simplify ? '자세한' : '간단한' }} 뷰
          </v-btn>
        </template>
      </v-toolbar>
    </template>

    <template v-slot:default="props">
      <v-row style="gap: 10px; margin-top: 5px">
        <BookCard
          :items="props.items"
          :uid="uid"
          :displayName="userDisplayName"
          :simple="simplify"
        />
      </v-row>
    </template>

    <template v-slot:footer>
      <v-row class="mt-10 px-9" align="center" justify="center">
        <span class="grey--text">Items per page</span>
        <v-menu top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              dark
              text
              color="primary"
              class="ml-2"
              v-bind="attrs"
              v-on="on"
            >
              {{ itemsPerPage }}
              <v-icon>mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(number, index) in [10, 50, 100, 150]"
              :key="index"
              @click="updateItemsPerPage(number)"
            >
              <v-list-item-title>{{ number }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

        <v-spacer></v-spacer>

        <span class="mr-4 grey--text">
          Page {{ page }} of {{ numberOfPages }}
        </span>
        <v-btn icon dark color="blue darken-3" class="mr-1" @click="formerPage">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon dark color="blue darken-3" class="ml-1" @click="nextPage">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
import { db, auth } from '../plugins/firebase.js';

export default {
  data() {
    return {
      listev: [],
      search: '',
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 10,
      sortBy: 'time',
      keys: ['time', 'likes', 'views'],
      userDisplayName: '',
      uid: '',
      simplify: false,
    };
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.listev.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== 'Name');
    },
  },
  methods: {
    nextPage() {
      this.page + 1 <= this.numberOfPages && (this.page += 1);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    formerPage() {
      this.page - 1 >= 1 && (this.page -= 1);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    updateItemsPerPage(n) {
      this.itemsPerPage = n;
    },

    getUserInfo() {
      auth.onAuthStateChanged((u) => {
        if (u) {
          this.userDisplayName = u.displayName;
          this.uid = u.uid;
        }
      });
    },

    async fetchContent() {
      db.ref('/contents/')
        .orderByKey()
        .on('child_added', async (s) => this.listev.unshift(await s.val()));
    },
  },

  created() {
    this.fetchContent();
    this.getUserInfo();
  },
};
</script>

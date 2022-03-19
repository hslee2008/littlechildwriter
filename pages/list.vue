<template>
  <div>
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
          <span class="grey--text to-hide">Items per page</span>
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
                v-for="(number, index) in itemsPerPageArray"
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
          <v-btn
            icon
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>

    <br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js';

export default {
  data() {
    return {
      listev: [],
      itemsPerPageArray: [10, 30, 50, 70, 100],
      search: '',
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 10,
      sortBy: 'time',
      keys: ['time', 'likes', 'views'],
      userDisplayName: '',
      uid: '',
      libris: '',
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
      if (this.page + 1 <= this.numberOfPages) this.page += 1;
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1;
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number;
    },
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userDisplayName = user.displayName;
          this.uid = user.uid;

          await db
            .ref('/users/' + user.uid)
            .once('value')
            .then((s) => (this.libris = s.val().libris));
        }
      });
    },

    async fetchContent() {
      const content = db.ref('/contents/');

      await content.on('child_added', async (snapshot) => {
        const data = await snapshot.val();

        this.listev.unshift(data);
      });

      await this.listev.sort((a, b) => {
        return a.time + a.likes / 2 - (b.time + b.likes / 2);
      });
    },
  },
  async created() {
    if (this.$route.query.username) this.search = this.$route.query.username;
    if (this.$route.query.time) this.search = this.$route.query.time;

    await this.fetchContent();

    this.getUserInfo();
  },
};
</script>

<style>
.to-show {
  display: none;
}

@media screen and (max-width: 686px) {
  .to-hide {
    display: none;
  }
  .to-show {
    display: block;
  }
}
</style>

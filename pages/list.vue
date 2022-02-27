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
        <v-toolbar dark class="mb-1" style="background-color: transparent">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          ></v-text-field>
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
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row style="gap: 10px; margin-top: 5px">
          <v-card
            v-for="item in props.items"
            :key="item.uid + item.time"
            :width="
              $vuetify.breakpoint.width < 330
                ? '90%'
                : $vuetify.breakpoint.width < 400
                ? 150
                : $vuetify.breakpoint.xs
                ? 185
                : $vuetify.breakpoint.sm
                ? 215
                : $vuetify.breakpoint.md
                ? 215
                : 225
            "
            class="mx-auto my-3"
            elevation="20"
          >
            <v-img
              :src="
                item.image === ''
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                  : item.image
              "
              :height="
                $vuetify.breakpoint.width < 330
                  ? 300
                  : $vuetify.breakpoint.width < 400
                  ? 220
                  : $vuetify.breakpoint.xs
                  ? 265
                  : $vuetify.breakpoint.sm
                  ? 300
                  : $vuetify.breakpoint.md
                  ? 330
                  : 345
              "
              style="margin: auto"
            ></v-img>

            <v-card-title
              class="primary--text col-11 text-truncate"
              style="font-size: 1rem"
            >
              {{
                item.title.includes(': ')
                  ? item.title.substring(item.title.indexOf(': ') + 2)
                  : item.title
              }}</v-card-title
            >
            <v-card-subtitle style="font-size: 0.9rem">{{
              item.username
            }}</v-card-subtitle>

            <v-divider></v-divider>

            <v-card-text>
              <p>
                {{
                  new Date(parseInt(item.time)).getMonth() +
                  '월 ' +
                  new Date(parseInt(item.time)).getDate() +
                  '일'
                }}<br />
                {{ new Date(parseInt(item.time)).toLocaleTimeString() }}
              </p>
              <div style="margin-right: 10px">
                <v-icon>mdi-eye</v-icon> {{ item.views }}
              </div>
              <v-rating
                :value="item.rating"
                dense
                color="orange"
                background-color="orange"
                hover
                readonly
                :size="$vuetify.breakpoint.xs ? 15 : 20"
                class="mr-1"
              ></v-rating>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn @click="openPost(item)" color="primary" elevation="0"
                ><v-icon left>mdi-open-in-new</v-icon>열기</v-btn
              >
              <v-btn
                rounded
                text
                @click="likeThis(item)"
                :disabled="item.liked[uid]"
                v-if="uid"
              >
                <v-icon>mdi-thumb-up</v-icon> {{ item.likes }}
              </v-btn></v-card-actions
            >
          </v-card>
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
import { db, auth } from '../plugins/firebase.js'

export default {
  data() {
    return {
      listev: [],
      itemsPerPageArray: [10, 20, 30, 40],
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
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.listev.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== 'Name')
    },
  },
  methods: {
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    openPost(it) {
      const { uid, time, views, pageCount } = it

      this.$router.push({
        path: '/loadpost',
        query: {
          uid,
          time,
          views: views + 1,
          pageCount,
        },
      })
    },
    likeThis(it) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          it.likes++
          it.liked[this.uid] = true

          db.ref(`/contents/${it.uid}/posts/${it.time}/likes`).set(it.likes + 1)

          db.ref(`contents/${it.uid}/posts/${it.time}/liked/${user.uid}`).set(
            true
          )

          this.notify(it)
        }
      })
    },
    async pdateLibris(uid) {
      await db
        .ref(`users/${uid}/libris`)
        .transaction((currentValue) => currentValue + 0.1)
    },

    notify(it) {
      auth.onAuthStateChanged(async (user) => {
        await db.ref(`users/${this.$route.query.uid}/notification`).push({
          title: `${user.displayName}님이 글을 좋아합니다`,
          time: Date.now(),
          link: `/loadpost?uid=${it.uid}&time=${it.time}&views=${it.views}&pageCount=${it.pageCount}`,
        })
      })
    },

    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userDisplayName = user.displayName
          this.uid = user.uid

          await db
            .ref('/users/' + user.uid)
            .once('value')
            .then((s) => (this.libris = s.val().libris))
        }
      })
    },

    fetchContent() {
      db.ref('/contents/')
        .orderByChild('/posts/time')
        .on('child_added', async (snapshot) => {
          const data = await snapshot.val().posts

          for (let i = 0; i < Object.keys(data).length; i++) {
            this.listev.unshift(data[Object.keys(data)[i]])
          }
        })
      this.listev.sort((a, b) => {
        return a.time + a.likes / 2 - (b.time + a.likes / 2)
      })
    },
  },
  async mounted() {
    if (this.$route.query.username) this.search = this.$route.query.username
    if (this.$route.query.time) this.search = this.$route.query.time

    await this.fetchContent()

    this.getUserInfo()
  },
}
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

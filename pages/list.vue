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
    >
      <template v-slot:header>
        <v-toolbar dark style="background-color: transparent" class="mb-1">
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
        <v-row style="gap: 10px; margin-top: 10px">
          <v-card
            v-for="item in props.items"
            :key="item.uid + item.time"
            :width="$vuetify.breakpoint.xs ? 155 : 225"
            class="mx-auto"
            elevation="20"
          >
            <v-img
              :src="
                item.image === ''
                  ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
                  : item.image
              "
              height="325"
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

            <v-card-text>
              <v-divider></v-divider>
              <br />
              <p>[{{ item.username.split(' ')[0] }}]</p>
              <p>
                {{ new Date(parseInt(item.time)).toLocaleDateString() }}
              </p>
              <p class="text-truncate">{{ item.content }}</p>
              <br />
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
              <div style="margin-right: 10px">
                <v-icon>mdi-eye</v-icon> {{ item.views }}
              </div>
            </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-btn @click="loadPost(item)" color="primary" elevation="0"
                ><v-icon left>mdi-open-in-new</v-icon>열기</v-btn
              >
              <v-btn
                rounded
                text
                @click="likeThis(item)"
                :disabled="item.liked[uid]"
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

    <br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js'

export default {
  data() {
    return {
      listev: [],
      itemsPerPageArray: [10, 15, 20],
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
    loadPost(item) {
      const { uid, time, views, pageCount } = item

      this.$router.push({
        path: '/loadpost',
        query: {
          uid,
          time,
          views,
          pageCount,
        },
      })
    },
    likeThis(item) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          db.ref(`/contents/${item.uid}/posts/${item.time}/likes`).set(
            item.likes + 1
          )

          db.ref(
            `contents/${item.uid}/posts/${item.time}/liked/${user.uid}`
          ).set(true)

          db.ref(`/users/${user.uid}`).update({
            libris: this.libris + 0.5,
          })

          await db.ref(`users/${this.$route.query.uid}/notification`).push({
            title: `${user.displayName}님이 글을 좋아합니다`,
            time: timestamp,
            link: `/loadpost?uid=${item.uid}&time=${item.time}&views=${item.views}&pageCount=${item.pageCount}`,
          })

          item.likes++
          item.liked[this.uid] = true
        }
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
            .then((snapshot) => {
              this.libris = snapshot.val().libris
            })
        }
      })
    },
    fetchContent() {
      db.ref('/contents/')
        .orderByChild('/time')
        .on('child_added', async (snapshot) => {
          const data = await snapshot.val().posts

          for (let i = 0; i < Object.keys(data).length; i++) {
            this.listev.unshift(data[Object.keys(data)[i]])
          }
        })
      this.listev.sort((val) => val.views / 2 + val.likes / 3 + this.libris / 4)
    },
  },
  mounted() {
    this.fetchContent()
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

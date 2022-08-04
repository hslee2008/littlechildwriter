<template>
  <v-lazy>
    <v-row class="row">
      <v-card
        v-for="(item, i) in items"
        v-if="showprivate ? item.isPublic === false : item.isPublic !== false"
        :key="i"
        :width="$vuetify.breakpoint.mobile ? 150 : 200"
        class="mx-auto my-5 transparent"
      >
        <v-card :to="`/book/content/${item.time}`" class="transparent">
          <v-img :src="item.image" :lazy-src="item.image" class="rounded-lg">
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-card-title class="primary--text" v-text="item.title" />

          <v-card-subtitle>
            <NuxtLink :to="`/user/${item.uid}`" v-text="item.displayName" />
          </v-card-subtitle>

          <v-card-text>
            <span class="text--disabled">
              {{ item.views }} views ·
              {{ new Date(parseInt(item.time)).getMonth() }}/{{
                new Date(parseInt(item.time)).getDate()
              }}
            </span>
          </v-card-text>
        </v-card>

        <v-card v-show="!simple" class="transparent">
          <v-card-actions v-if="userInfo.uid">
            <v-btn icon @click="bookmark(item.time, i)" color="primary">
              <v-icon>
                mdi-bookmark{{
                  Object.keys(item.bookmarks ?? {}).includes(userInfo.uid)
                    ? ''
                    : '-outline'
                }}
              </v-icon>
            </v-btn>
            <v-btn
              icon
              :disabled="item.liked[userInfo.uid] == true"
              @click="likeThis(item)"
              class="mr-2"
            >
              <v-icon> mdi-thumb-up </v-icon>
            </v-btn>
            <span class="subheading" v-text="item.likes" />
          </v-card-actions>
        </v-card>
      </v-card>
    </v-row>
  </v-lazy>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  props: {
    items: {
      type: Array,
      required: true
    },
    simple: {
      type: Boolean,
      default: false
    },
    showprivate: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    likeThis(it) {
      it.likes++
      it.liked[this.userInfo.uid] = true

      db.ref(`/contents/${it.time}/liked/${this.userInfo.uid}`).set(true)
      db.ref(`/contents/${it.time}/likes`).set(it.likes)

      this.updateLibris(this.userInfo.uid, 0.1)
      this.updateLibris(it.uid, 0.1)
    },
    bookmark(time, i) {
      db.ref(`/users/${this.userInfo.uid}/bookmarks/${time}`).set({
        title: this.items[i].title,
        image: this.items[i].image,
        time: time
      })
      db.ref(`/contents/${time}/bookmarks/${this.userInfo.uid}`).set(true)
      this.items[i].bookmarks = {
        ...this.items[i].bookmarks,
        [this.userInfo.uid]: true
      }
      this.updateLibris(this.userInfo.uid, 0.1)
      this.$forceUpdate()
    }
  }
}
</script>

<style scoped>
.row {
  margin-top: 5px;
  gap: 3px;
  margin: 5px;
}
</style>

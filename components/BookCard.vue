<template>
  <v-row style="margin-top: 5px; gap: 3px; margin: 5px">
    <v-card
      v-for="(item, index) in items"
      :key="index"
      :width="
        $vuetify.breakpoint.width < 400
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
        :src="item.image"
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
        {{ item.title }}</v-card-title
      >
      <v-card-subtitle style="font-size: 0.9rem"
        >by {{ item.username }}</v-card-subtitle
      >

      <v-divider />

      <v-btn
        block
        tile
        @click="loadPost(item.uid, item.time)"
        text
        color="primary"
      >
        <v-icon left>mdi-open-in-new</v-icon> 열기
      </v-btn>

      <v-divider />

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
        <ReadOnlyRating :value="item.rating" />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-row align="center" justify="center" class="my-1">
          <v-btn
            class="mr-1"
            icon
            @click="likeThis(item)"
            :disabled="item.liked[uid] == true"
            ><v-icon> mdi-thumb-up </v-icon></v-btn
          >
          <span class="subheading mr-2"> {{ item.likes }}</span>
          <span class="mr-1">·</span>
          <v-icon class="mr-1"> mdi-eye </v-icon>
          <span class="subheading"> {{ Math.round(item.views) }}</span>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-row>
</template>

<script>
import { auth, db } from '../plugins/firebase.js'

export default {
  props: ['items', 'uid'],
  methods: {
    loadPost(uid, time) {
      this.$router.push(`/content/${uid}-${time}`)
    },
    likeThis(it) {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          it.likes++
          ;(it.liked ?? {
            [this.uid]: false,
          })[this.uid] = true

          db.ref(`/contents/${it.time}/likes`).set(it.likes)

          db.ref(`contents/${it.time}/liked/${user.uid}`).set(true)

          this.notify(it)
          this.updateLibris(user.uid)
        }
      })
    },
  },
}
</script>

<template>
  <v-lazy>
    <v-row style="margin-top: 5px; gap: 3px; margin: 5px">
      <v-skeleton-loader
        v-if="loading"
        :active="loading"
        width="100%"
        type="list-item-avatar-three-line, image, article"
        class="mx-5"
      />
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
            $vuetify.breakpoint.width < 300
              ? '90%'
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
          class="rounded-lg"
        />

        <v-tooltip :left="!$vuetify.breakpoint.mobile">
          <template v-slot:activator="{ on, attrs }">
            <v-card-title
              class="primary--text col-11 text-truncate"
              v-bind="attrs"
              v-on="on"
            >
              {{ item.title }}
            </v-card-title>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
        <v-card-subtitle>by {{ item.username }}</v-card-subtitle>

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

        <template v-if="!simple">
          <v-divider />

          <v-card-text>
            <p>
              {{ new Date(parseInt(item.time)).toLocaleDateString() }}<br />
              {{ new Date(parseInt(item.time)).toLocaleTimeString() }}
            </p>
            <ReadOnlyRating :value="item.rating" />
          </v-card-text>

          <v-divider />

          <v-card-actions class="my-1 justify-center">
            <v-icon class="mr-1"> mdi-eye </v-icon>
            <span class="subheading"> {{ Math.round(item.views) }}</span>

            <span class="mr-1 ml-2">·</span>

            <v-btn
              class="mr-1"
              icon
              @click="likeThis(item)"
              :disabled="item.liked[uid] == true"
              ><v-icon> mdi-thumb-up </v-icon></v-btn
            >
            <span class="subheading"> {{ item.likes }}</span>
          </v-card-actions>
        </template>
      </v-card>
    </v-row>
  </v-lazy>
</template>

<script>
import { db } from '../../plugins/firebase.js';

export default {
  props: ['items', 'uid', 'displayName', 'loading', 'simple'],
  methods: {
    loadPost(uid, time) {
      this.$router.push(`/content/${uid}-${time}`);
    },
    updateLibris() {
      db.ref(`users/${this.uid}/libris`).transaction((cv) => cv + 0.1);
    },
    notify(uid, time) {
      db.ref(`users/${uid}/notification`).push({
        title: `${this.displayName}님이 글을 좋아합니다`,
        time: Date.now(),
        link: `/content/${uid}-${time}`,
      });
    },
    likeThis(it) {
      it.likes++;
      (it.liked ?? {
        [this.uid]: false,
      })[this.uid] = true;

      db.ref(`/contents/${it.time}/likes`).set(it.likes);

      db.ref(`contents/${it.time}/liked/${this.uid}`).set(true);

      this.notify(it.uid, it.time);

      this.updateLibris();
      this.updateLibris(it.uid);
    },
  },
};
</script>

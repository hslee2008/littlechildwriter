<template>
  <div>
    <h2>{{ title }}</h2>
    <v-divider />

    <br />

    <v-row style="gap: 15px">
      <v-card
        v-for="item in data.slice(0, 8)"
        :key="item.uid + item.time"
        :width="
          $vuetify.breakpoint.width < 330
            ? '90%'
            : $vuetify.breakpoint.width < 400
            ? 120
            : $vuetify.breakpoint.xs
            ? 185
            : $vuetify.breakpoint.sm
            ? 215
            : $vuetify.breakpoint.md
            ? 215
            : 225
        "
        class="mx-auto"
      >
        <v-img
          :src="item.image"
          :height="
            $vuetify.breakpoint.width < 330
              ? 300
              : $vuetify.breakpoint.width < 400
              ? 200
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
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BookCardSimple',
  props: ['data', 'title', 'uid'],
  methods: {
    loadPost(uid, time) {
      this.$router.push(`/content/${uid}-${time}`)
    },
  },
}
</script>

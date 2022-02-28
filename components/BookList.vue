<template>
  <div>
    <h2>{{ title }}</h2>
    <v-divider />

    <br />

    <v-row style="gap: 15px">
      <v-card
        v-for="item in data.slice(0, 4)"
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
          :src="
            item.image === ''
              ? 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXeHDt7iweZ7AdiGtllZWINfZ0_5fPcntSiA&usqp=CAU'
              : item.image
          "
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
      </v-card>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'BookList',
  props: ['data', 'title', 'uid'],
  methods: {
    loadPost(uid, time) {
      this.$router.push(`/content/${uid}-${time}`)
    },
  },
}
</script>

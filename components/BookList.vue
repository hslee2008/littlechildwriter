<template>
  <v-container>
    <div>
      <h2>{{ title }}</h2>
      <v-divider></v-divider>
    </div>

    <br />

    <v-row style="gap: 15px">
      <v-card
        v-for="item in data.slice(4 * page - 3, 4 * page + 1)"
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

        <v-card-title class="primary--text col-11 text-truncate">
          {{ item.title }}</v-card-title
        >
        <v-card-subtitle>by {{ item.username }}</v-card-subtitle>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn @click="loadPost(item)" color="primary" elevation="0" icon
            ><v-icon>mdi-open-in-new</v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
    <br />
    <div class="text-center">
      <v-pagination
        v-model="page"
        :length="Math.round(data.length / 4)"
      ></v-pagination>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'BookList',
  props: ['data', 'title'],
  data() {
    return {
      page: 1,
    }
  },
  methods: {
    loadPost(item) {
      const { uid, time } = item

      this.$router.push(`/content/${uid}-${time}`)
    },
  },
}
</script>

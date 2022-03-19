<template>
  <div class="ma-auto err">
    <v-card class="ma-auto" max-width="400" color="error">
      <v-card-title>
        {{ error.statusCode === 404 ? pageNotFound : otherError }}
      </v-card-title>

      <v-card-actions class="ml-1">
        <v-btn aria-label="Coding Insight Button" icon @click="refresh">
          <v-icon>mdi-refresh</v-icon></v-btn
        >
        <v-btn aria-label="Coding Insight Button" icon @click="backward">
          <v-icon>mdi-chevron-left</v-icon></v-btn
        >

        <v-btn aria-label="Coding Insight Button" icon to="/">
          <v-icon>mdi-home</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: ['error'],
  data() {
    return {
      pageNotFound: '💀 Error 404 💀',
      otherError: '😕 Unknown Error 🤔',
    };
  },
  head() {
    return {
      title:
        this.error.statusCode === 404 ? this.pageNotFound : this.otherError,
    };
  },
  methods: {
    backward() {
      history.back();
    },
    refresh() {
      location.reload();
    },
  },
};
</script>

<style>
.err {
  width: 80%;
  height: 100px;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
</style>

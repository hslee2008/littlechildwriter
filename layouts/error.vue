<template>
  <div
    style="
      width: 80%;
      height: 100px;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    "
  >
    <v-card class="mx-auto" max-width="400">
      <v-alert border="right" colored-border type="error" elevation="2">
        <h1 v-if="error.statusCode === 404">
          {{ pageNotFound }}
        </h1>
        <h1 v-else>
          {{ otherError }}
        </h1>
      </v-alert>

      <v-card-actions>
        <v-btn aria-label="Coding Insight Button" @click="refresh">
          <v-icon>mdi-refresh</v-icon></v-btn
        >
        <v-btn aria-label="Coding Insight Button" @click="backward">
          <v-icon>mdi-chevron-left</v-icon></v-btn
        >

        <v-btn aria-label="Coding Insight Button" to="/">
          <v-icon left>mdi-home</v-icon></v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '😭 Error 404 😭',
      otherError: '😢 Unknown Error 😢',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
  methods: {
    backward() {
      history.back()
    },
    refresh() {
      location.reload()
    },
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>

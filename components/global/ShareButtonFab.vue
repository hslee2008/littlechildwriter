<template>
  <v-fab-transition v-if="$vuetify.breakpoint.mobile">
    <v-btn
      fab
      small
      bottom
      right
      fixed
      class="mb-10"
      color="primary"
      @click="sharePost"
    >
      <v-icon>mdi-share-variant</v-icon>
    </v-btn>
  </v-fab-transition>
</template>

<script>
export default {
  name: 'shareButtonFab',
  props: ['title', 'username'],
  methods: {
    sharePost() {
      if (navigator.canShare)
        navigator.share({
          title: `Little 작가 (${this.title} by ${this.username})`,
          url: window.location.href,
        })
    },
  },
}
</script>

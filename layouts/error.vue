<template>
  <div>
    <h1 v-if="error.statusCode === 404">Page not found</h1>
    <h1 v-else>An error occurred - {{ error.statusCode }}</h1>
    <NuxtLink to="/">Home page</NuxtLink>
  </div>
</template>

<script>
export default {
  layout: 'error',
  head: {
    title: 'Error'
  },
  props: {
    error: {
      type: Object,
      default: {
        statusCode: 500
      }
    }
  }
}
</script>

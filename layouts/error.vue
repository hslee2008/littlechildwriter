<template>
  <div>
    <v-card-title> Oopsie! 에러</v-card-title>
  </div>
</template>

<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$router.push('/')
    }, 3000)
  }
}
</script>

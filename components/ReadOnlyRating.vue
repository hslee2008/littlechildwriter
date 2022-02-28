<template>
  <v-rating
    :value="value"
    dense
    readonly
    half-increments
    size="20"
    color="amber"
  />
</template>

<script>
export default {
  props: ['value'],
}
</script>

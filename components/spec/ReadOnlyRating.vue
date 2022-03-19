<template>
  <v-rating
    dense
    readonly
    half-increments
    size="15"
    color="amber"
    background-color="white"
    :value="value"
  />
</template>

<script>
export default {
  props: ['value'],
};
</script>

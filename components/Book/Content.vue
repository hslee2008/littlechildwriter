<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="ma-auto">
    <v-card-title class="h1 text-primary text-center title">
      {{ ReduceTitle(post.title) }}
    </v-card-title>

    <v-card-subtitle v-if="mobile" class="text-center">
      by
      <NuxtLink :to="`/user/${post.uid}`">
        {{ post.displayName }}
      </NuxtLink>
    </v-card-subtitle>

    <div class="text-center">
      <v-rating
        v-model="post.rating"
        dense
        readonly
        half-increments
        size="20"
        color="amber"
        background-color="white"
        class="mt-3"
      />
    </div>

    <v-card-text>
      <div class="my-5">
        <p
          v-for="(p, i) in ToSplit(ToDisplay(post.content))"
          :key="`${p}-${i}`"
        >
          {{ p }}<br />
        </p>
      </div>
      <v-chip-group class="my-5" column>
        <v-chip label>
          <v-icon start> mdi-eye </v-icon>
          {{ formatter(post.views + 1) }}
        </v-chip>
        <v-chip label>
          <v-icon start>mdi-sort-clock-descending-outline</v-icon>
          {{ new Date(post.time).toLocaleDateString() }}
        </v-chip>
        <v-chip label>
          <v-icon start>mdi-book</v-icon>
          {{ post.pageCount }}
        </v-chip>
        <v-chip label>
          <v-icon start> mdi-counter </v-icon>
          {{ ToDisplay(post.content).length }}자
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

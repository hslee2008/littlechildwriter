<!-- eslint-disable vue/no-mutating-props -->
<template>
  <div class="ma-auto">
    <v-card-title class="h1 text-primary title">
      {{ post.title }}
      <span
        v-if="otherInfo.volumeInfo?.authors.length > 0"
        class="subtitle-2 ml-1"
      >
        ({{ (otherInfo.volumeInfo?.authors || []).join(', ') }})
      </span>
    </v-card-title>

    <v-card-subtitle>
      by
      <NuxtLink :to="`/user/${post.uid}`">
        {{ post.displayName }}
      </NuxtLink>
    </v-card-subtitle>

    <v-card-text>
      <v-rating
        v-model="post.rating"
        dense
        readonly
        half-increments
        size="20"
        color="amber"
        background-color="white"
      />
      <div class="my-5">
        <p v-for="p in post.content.split('&lt;br>')" :key="p">
          {{ p }}
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
      </v-chip-group>
    </v-card-text>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true
  },
  otherInfo: {
    type: Object,
    required: true
  }
})
</script>

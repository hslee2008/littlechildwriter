<template>
  <div v-if="targetUser.bio" class="my-10">
    <v-card-title>{{ targetUser.bio }}</v-card-title>
  </div>

  <v-list flat class="rounded-lg">
    <v-list-item>
      <template #prepend>
        <v-icon> mdi-crown-circle </v-icon>
      </template>

      <v-list-item-title>
        리브리스:
        {{ Math.round(targetUser.libris) }}
      </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <template #prepend>
        <v-icon> mdi-book </v-icon>
      </template>

      <v-list-item-title> 총 책 업로드: {{ length }} </v-list-item-title>
    </v-list-item>

    <v-list-item>
      <template #prepend>
        <v-icon> mdi-card-account-details </v-icon>
      </template>

      <v-list-item-title> UID: {{ uid }} </v-list-item-title>
    </v-list-item>

    <template v-if="length > 0">
      <v-divider />

      <v-list-item>
        <template #prepend>
          <v-icon> mdi-read </v-icon>
        </template>

        <v-list-item-title>
          사람들이 책 읽은 수: {{ formatter(readCount) }}번
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <template #prepend>
          <v-icon> mdi-thumbs-up-down </v-icon>
        </template>

        <v-list-item-title>
          총 좋아요: {{ formatter(likeCount) }}번
        </v-list-item-title>
      </v-list-item>

      <v-divider />

      <v-list-item>
        <template #prepend>
          <v-icon> mdi-star </v-icon>
        </template>

        <v-list-item-title>
          평균 평점: {{ (avgRating / length).toFixed(2) }}
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <template #prepend>
          <v-icon> mdi-read </v-icon>
        </template>

        <v-list-item-title>
          권당 평균 읽힌 수:
          {{ (readCount / length).toFixed(2) }}번
        </v-list-item-title>
      </v-list-item>

      <v-list-item>
        <template #prepend>
          <v-icon> mdi-thumbs-up-down </v-icon>
        </template>

        <v-list-item-title>
          권당 평균 좋아요:
          {{ (likeCount / length).toFixed(2) }}번
        </v-list-item-title>
      </v-list-item>
    </template>
  </v-list>
</template>

<script setup>
defineProps({
  targetUser: {
    type: Object,
    required: true
  },
  length: {
    type: Number,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  readCount: {
    type: Number,
    required: true
  },
  likeCount: {
    type: Number,
    required: true
  },
  avgRating: {
    type: Number,
    required: true
  }
})
</script>

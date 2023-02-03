<template>
  <div class="d-flex justify-center align-center badge">
    <v-card
      v-if="readCount > 9"
      class="d-flex justify-center elevation-0"
      :color="themeColor()"
    >
      <v-tooltip :text="readCount.toString()" location="bottom">
        <template #activator="{ props }">
          <v-badge
            v-bind="props"
            color="primary"
            location="bottom end"
            offset-x="75"
            :offset-y="mobile ? 150 : 200"
            :content="`x ${Math.floor(Math.log10(readCount))}`"
          >
            <v-img src="/img/views.png" :width="mobile ? 200 : 300" />
          </v-badge>
        </template>
      </v-tooltip>
    </v-card>

    <v-card
      v-if="subCount > 1"
      class="d-flex justify-center elevation-0"
      :color="themeColor()"
    >
      <v-tooltip :text="`구독자: ${subCount.toString()}`" location="bottom">
        <template #activator="{ props }">
          <v-badge
            v-bind="props"
            color="primary"
            location="bottom end"
            offset-x="75"
            :offset-y="mobile ? 150 : 200"
            :content="`x ${Math.floor(Math.log2(subCount))}`"
          >
            <v-img src="/img/followers.png" :width="mobile ? 200 : 300" />
          </v-badge>
        </template>
      </v-tooltip>
    </v-card>

    <v-card
      v-if="length > 9"
      class="d-flex justify-center elevation-0"
      :color="themeColor()"
    >
      <v-tooltip :text="`업로드 수: ${length.toString()}`" location="bottom">
        <template #activator="{ props }">
          <v-badge
            v-bind="props"
            color="primary"
            location="bottom end"
            offset-x="75"
            :offset-y="mobile ? 150 : 200"
            :content="`x ${Math.floor(Math.log10(length))}`"
          >
            <v-img src="/img/uploads.png" :width="mobile ? 200 : 300" />
          </v-badge>
        </template>
      </v-tooltip>
    </v-card>
  </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'

defineProps({
  length: {
    type: Number,
    required: true
  },
  readCount: {
    type: Number,
    required: true
  },
  subCount: {
    type: Number,
    required: true
  }
})

const { mobile } = useDisplay()
</script>

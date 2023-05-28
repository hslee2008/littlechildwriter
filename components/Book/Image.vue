<template>
  <div class="my-auto ml-3">
    <v-card-subtitle
      v-if="otherInfo.volumeInfo?.authors.length > 0"
      class="text-center"
    >
      {{ (otherInfo.volumeInfo?.authors || []).join(', ') }}
    </v-card-subtitle>

    <v-img :src="post.image" width="200" class="mx-auto my-5 rounded-lg pointer">
      <v-bottom-sheet v-model="sheet" inset activator="parent" scrollable>
        <v-card class="pa-5">
          <v-row class="d-flex justify-center align-center">
            <v-col cols="5" sm="6" md="4" lg="2">
              <v-card
                variant="outlined"
                :href="`https://aladin.co.kr/${
                  post.isbn
                    ? 'shop/wproduct.aspx?isbn=' + post.isbn
                    : 'search/wsearchresult.aspx?SearchTarget=All&SearchWord=' +
                      post.title
                }`"
                target="_blank"
              >
                <v-card-text class="text-center">
                  <v-avatar size="40" class="mb-4">
                    <v-img
                      src="https://play-lh.googleusercontent.com/R83BmEu0bafVZ4lNC4dNnJ8Xxt9Cn5ZbS7m96SBaCgsxuTYaWINSgexcuSq8jhAvRkU"
                      alt="aladdin"
                    />
                  </v-avatar>
                  <v-card-subtitle class="text-center">
                    알라딘
                  </v-card-subtitle>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="5" sm="6" md="4" lg="2">
              <v-card
                variant="outlined"
                :href="`https://www.yes24.com/product/search?query=${
                  post.isbn || post.title
                }&domain=all`"
                target="_blank"
              >
                <v-card-text class="text-center">
                  <v-avatar size="40" class="mb-4">
                    <v-img
                      src="https://cdn6.aptoide.com/imgs/2/7/d/27de865af39ece8b577dd12b40165cc3_icon.png"
                      alt="yes24"
                    />
                  </v-avatar>
                  <v-card-subtitle class="text-center"> YES24 </v-card-subtitle>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="5" sm="6" md="4" lg="2">
              <v-card
                variant="outlined"
                :href="`https://www.amazon.com/s?k=${
                  post.isbn || post.title
                }&i=stripbooks&linkCode=qs`"
                target="_blank"
              >
                <v-card-text class="text-center">
                  <v-avatar size="40" class="mb-4">
                    <v-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt0-ykzLKIz1DSA5dDvSfrVy21kgN08CfsUw&usqp=CAU"
                      alt="amazon"
                    />
                  </v-avatar>
                  <v-card-subtitle class="text-center">
                    아마존
                  </v-card-subtitle>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="5" sm="6" md="4" lg="2">
              <v-card
                variant="outlined"
                :href="`https://search.kyobobook.co.kr/search?keyword=${
                  post.isbn || post.title
                }&collection=kyobo_new`"
                target="_blank"
              >
                <v-card-text class="text-center">
                  <v-avatar size="40" class="mb-4">
                    <v-img
                      src="https://contents.kyobobook.co.kr/resources/fo/images/common/ink/favicon/apple-touch-icon-144x144-precomposed.png"
                      alt="kyobo"
                    />
                  </v-avatar>
                  <v-card-subtitle class="text-center">
                    교보문고
                  </v-card-subtitle>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col cols="5" sm="6" md="4" lg="2">
              <v-card
                variant="outlined"
                :href="`https://books.google.co.kr/books?id=${otherInfo?.id}`"
                target="_blank"
              >
                <v-card-text class="text-center">
                  <v-avatar size="40" class="mb-4">
                    <v-img
                      src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
                      alt="google"
                    />
                  </v-avatar>
                  <v-card-subtitle class="text-center"> 구글 </v-card-subtitle>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-card>
      </v-bottom-sheet>
    </v-img>

    <v-card-subtitle v-if="!mobile" class="text-center">
      by
      <NuxtLink :to="`/user/${post.uid}`">
        {{ post.displayName }}
      </NuxtLink>
    </v-card-subtitle>
  </div>
</template>

<script setup>
import { VBottomSheet } from 'vuetify/labs/VBottomSheet'
import { useDisplay } from 'vuetify'

const { mobile } = useDisplay()

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

const sheet = ref(false)
</script>

<style scoped>
.pointer {
  cursor: pointer;
}
</style>

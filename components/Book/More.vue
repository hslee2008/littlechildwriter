<template>
  <v-btn size="small" class="mx-1" variant="tonal" icon>
    <v-icon>mdi-dots-vertical</v-icon>

    <v-menu offset-y activator="parent">
      <v-card>
        <v-btn
          v-if="post.isbn"
          rounded="lg"
          variant="plain"
          prepend-icon="mdi-file-find"
          @click="showiframe"
        >
          미리보기
        </v-btn>

        <v-btn rounded="lg" variant="plain" text prepend-icon="mdi-shape">
          카테고리

          <v-dialog v-if="post.categories" width="700" activator="parent">
            <v-card>
              <v-card-title class="text-center">
                {{ post.title }} 카테고리
              </v-card-title>

              <v-card-text>
                <v-chip
                  v-for="tag in post.categories"
                  :key="tag"
                  label
                  class="ma-2 d-block text-center pa-1"
                >
                  #{{ tag }}
                </v-chip>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-btn>

        <v-btn
          rounded="lg"
          variant="plain"
          text
          prepend-icon="mdi-book-information-variant"
        >
          정보

          <v-dialog v-if="post.isbn" width="700" activator="parent">
            <v-card>
              <v-card-title>
                {{ post.title }}
              </v-card-title>
              <v-card-subtitle>
                {{ (otherInfo.volumeInfo?.authors || []).join(', ') }}
              </v-card-subtitle>

              <v-card-text>
                <v-table>
                  <template #default>
                    <thead>
                      <tr>
                        <th class="text-left">카테고리</th>
                        <th class="text-left">정보</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>ISBN 13</td>
                        <td>{{ post.isbn }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.industryIdentifiers">
                        <td>ISBN 10</td>
                        <td>
                          {{
                            otherInfo.volumeInfo.industryIdentifiers[1]
                              .identifier
                          }}
                        </td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo?.publishedDate">
                        <td>출판된 날짜</td>
                        <td>{{ otherInfo.volumeInfo?.publishedDate }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.publisher">
                        <td>출판사</td>
                        <td>{{ otherInfo.volumeInfo.publisher }}</td>
                      </tr>
                      <tr v-if="otherInfo.GBid">
                        <td>Google Books ID</td>
                        <td>{{ otherInfo.GBid }}</td>
                      </tr>
                      <tr v-if="otherInfo.volumeInfo.averageRating">
                        <td>평균 별점 (구글)</td>
                        <td>{{ otherInfo.volumeInfo.averageRating }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-table>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-btn>
      </v-card>
    </v-menu>
  </v-btn>
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
  },
  showiframe: {
    type: Function,
    required: true
  }
})
</script>

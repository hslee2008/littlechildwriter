<template>
  <div class="my-auto ml-3">
    <v-img :src="post.image" width="200" class="ml-5 my-5 rounded-lg pointer">
      <v-menu v-model="sheet" inset location="bottom" activator="parent">
        <v-list nav expand>
          <v-list-item
            target="_blank"
            :href="`https://aladin.co.kr/${
              post.isbn
                ? 'shop/wproduct.aspx?isbn=' + post.isbn
                : 'search/wsearchresult.aspx?SearchTarget=All&SearchWord=' +
                  post.title
            }`"
          >
            <template #prepend>
              <v-avatar size="30">
                <v-img
                  src="https://play-lh.googleusercontent.com/R83BmEu0bafVZ4lNC4dNnJ8Xxt9Cn5ZbS7m96SBaCgsxuTYaWINSgexcuSq8jhAvRkU"
                  alt="aladdin"
                />
              </v-avatar>
            </template>
            <v-list-item-title>알라딘</v-list-item-title>
          </v-list-item>

          <v-list-item
            target="_blank"
            :href="`https://www.yes24.com/product/search?query=${
              post.isbn || post.title
            }&domain=all`"
          >
            <template #prepend>
              <v-avatar size="30">
                <v-img
                  src="https://image.yes24.com/sysimage/renew/gnb/yes24.ico"
                  alt="yes24"
                />
              </v-avatar>
            </template>
            <v-list-item-title>YES24</v-list-item-title>
          </v-list-item>

          <v-list-item
            target="_blank"
            :href="`https://www.amazon.com/s?k=${
              post.isbn || post.title
            }&i=stripbooks&linkCode=qs`"
          >
            <template #prepend>
              <v-avatar size="30">
                <v-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTt0-ykzLKIz1DSA5dDvSfrVy21kgN08CfsUw&usqp=CAU"
                  alt="amazon"
                />
              </v-avatar>
            </template>
            <v-list-item-title>아마존</v-list-item-title>
          </v-list-item>

          <v-list-item
            target="_blank"
            :href="`https://search.kyobobook.co.kr/search?keyword=${
              post.isbn || post.title
            }&collection=kyobo_new`"
          >
            <template #prepend>
              <v-avatar size="30">
                <v-img
                  src="https://contents.kyobobook.co.kr/resources/fo/images/common/ink/favicon/apple-touch-icon-144x144-precomposed.png"
                  alt="kyobo"
                />
              </v-avatar>
            </template>
            <v-list-item-title>교보문고</v-list-item-title>
          </v-list-item>

          <v-list-item
            target="_blank"
            :href="`https://books.google.co.kr/books?id=${otherInfo?.id}`"
          >
            <template #prepend>
              <v-avatar size="30">
                <v-img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjzC2JyZDZ_RaWf0qp11K0lcvB6b6kYNMoqtZAQ9hiPZ4cTIOB"
                  alt="google"
                />
              </v-avatar>
            </template>
            <v-list-item-title>구글</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
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

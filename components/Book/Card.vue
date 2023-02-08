<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-lazy
    :options="{
      threshold: 0.5
    }"
    transition="fade-transition"
  >
    <v-row
      class="row d-flex justify-center"
      :style="`margin: ${mobile ? 0 : 2.5}px`"
    >
      <v-card
        v-for="(item, i) in items"
        :key="i"
        :width="mobile ? 150 : 200"
        :class="`my-4 ${mobile ? 'mx-auto' : 'mx-4'}`"
      >
        <v-card :to="`/book/content/${item.time}`">
          <v-img
            :src="item.image"
            :lazy-src="item.image"
            class="rounded book-image"
            cover
          >
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-card-title
            v-if="item.title.length < 10"
            class="text-primary font-weight-black"
          >
            {{ item.title }}
          </v-card-title>
          <v-card-text v-else class="text-primary font-weight-black">
            {{ item.title }}
          </v-card-text>

          <v-card-subtitle>
            <NuxtLink :to="`/user/${item.uid}`">
              {{ item.displayName }}
            </NuxtLink>
          </v-card-subtitle>

          <v-card-text>
            <span class="text--disabled">
              {{ formatter(item.views) }} views ·
              {{ DateFormatter(new Date(parseInt(item.time)).getTime()) }}
            </span>
          </v-card-text>
        </v-card>

        <v-card v-show="!simple">
          <v-card-actions v-if="userInfo.loggedIn">
            <v-btn
              rounded="lg"
              icon
              color="primary"
              @click="Bookmark(item.time, i)"
            >
              <v-icon>
                mdi-bookmark{{ bookmarked(i) ? '-check' : '-outline' }}
              </v-icon>
            </v-btn>
            <v-btn
              rounded="lg"
              icon
              :color="(item?.liked ?? {})[userInfo.uid] ? 'primary' : 'grey'"
              class="mr-2"
              @click="Like(item)"
            >
              <v-icon> mdi-thumb-up </v-icon>
            </v-btn>
            <span class="subheading" v-text="item?.likes" />

            <v-spacer />

            <v-btn
              v-if="
                item?.comments?.length ||
                Object.keys(item?.comments ?? {}).length
              "
              rounded="lg"
              disabled
              icon
              color="grey"
            >
              <v-icon size="small">mdi-comment-bookmark</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>

      <v-snackbar v-model="bookmarkSnackbar">
        책갈피가 추가되었습니다.

        <template #action="{ attrs }">
          <v-btn
            rounded="lg"
            color="pink"
            text
            v-bind="attrs"
            @click="bookmarkSnackbar = false"
          >
            닫기
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="bookmarkSnackbarDel">
        책갈피가 삭제되었습니다.

        <template #action="{ attrs }">
          <v-btn
            rounded="lg"
            color="pink"
            text
            v-bind="attrs"
            @click="bookmarkSnackbarDel = false"
          >
            닫기
          </v-btn>
        </template>
      </v-snackbar>
    </v-row>
  </v-lazy>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { $db } = useNuxtApp()
const { mobile } = useDisplay()

const userInfo = User()
const route = useRoute()

const props = defineProps({
  items: {
    type: Array as unknown as any[],
    required: true
  },
  simple: {
    type: Boolean,
    default: false
  }
})
const bookmarkSnackbar = ref<boolean>(false)
const bookmarkSnackbarDel = ref<boolean>(false)
const bookmarked = (i: number) => {
  return Object.keys(props.items[i].bookmarks ?? {}).includes(userInfo.uid)
}

onKeyStroke('l', () => {
  if (route.path === '/list') {
    for (let i = 0; i < props.items.length; i++) {
      if (!props.items[i].liked[userInfo.uid]) Like(props.items[i])
    }
  }
})

const Like = (item: any) => {
  if (item.liked[userInfo.uid]) {
    item.likes--
    item.liked[userInfo.uid] = false

    $db.ref(`/contents/${item.time}/liked/${userInfo.uid}`).set(false)
    $db.ref(`/contents/${item.time}/likes`).set(item.likes)

    Libris(userInfo.uid, -0.1)
    Libris(item.uid, -0.1)
  } else {
    item.likes++

    try {
      item.liked[userInfo.uid] = true
    } catch (e) {
      alert(e)
    }

    $db.ref(`/contents/${item.time}/liked/${userInfo.uid}`).set(true)
    $db.ref(`/contents/${item.time}/likes`).set(item.likes)

    Libris(userInfo.uid, 0.1)
    Libris(item.uid, 0.1)
  }
}

const Bookmark = (time: string, i: number) => {
  if (bookmarked(i)) {
    bookmarkSnackbar.value = false
    bookmarkSnackbarDel.value = true

    $db.ref(`/users/${userInfo.uid}/bookmarks/${time}`).remove()
    $db.ref(`/contents/${time}/bookmarks/${userInfo.uid}`).remove()

    // eslint-disable-next-line vue/no-mutating-props
    props.items[i].bookmarks = Object.fromEntries(
      Object.entries(props.items[i].bookmarks ?? {}).filter(
        ([key]) => key !== userInfo.uid
      )
    )
  } else {
    const { title, image } = props.items[i]

    bookmarkSnackbarDel.value = false
    bookmarkSnackbar.value = true

    $db.ref(`/users/${userInfo.uid}/bookmarks/${time}`).set({
      title,
      image,
      time
    })
    $db.ref(`/contents/${time}/bookmarks/${userInfo.uid}`).set(true)

    // eslint-disable-next-line vue/no-mutating-props
    props.items[i] = {
      ...props.items[i],
      bookmarks: {
        ...props.items[i].bookmarks,
        [userInfo.uid]: true
      }
    }
    Libris(userInfo.uid, 0.1)
    navigateTo('/bookmarks')
  }
}
</script>

<style scoped>
.row {
  margin-top: 5px;
  gap: 3px;
  margin: 5px;
}

.book-image {
  filter: blur(0.5px);
}

.book-image:hover {
  filter: blur(0px);
}
</style>
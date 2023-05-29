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
        v-show="item.time"
        :key="item.time"
        :width="mobile ? 150 : 200"
        :class="`my-4 ${mobile ? 'mx-auto' : 'mx-4'}`"
      >
        <v-card :to="`/book/content/${item.time}`">
          <v-img
            :src="item.image"
            :lazy-src="item.image"
            class="rounded"
            cover
          />

          <div v-if="!imageonly">
            <v-card-title class="text-primary text-center">
              {{ ReduceTitle(item.title) }}
            </v-card-title>

            <v-card-text class="text-center">
              {{ formatter(item.views) }} views ·
              {{ DateFormatter(new Date(parseInt(item.time)).getTime()) }}
            </v-card-text>

            <v-card-subtitle class="text-center">
              <NuxtLink :to="`/user/${item.uid}`">
                {{ item.displayName }}
              </NuxtLink>
            </v-card-subtitle>
          </div>
        </v-card>

        <v-card v-if="!simple && !imageonly">
          <v-card-actions
            v-if="userInfo.loggedIn"
            class="d-flex justify-center"
          >
            <v-btn
              rounded="lg"
              :icon="`mdi-bookmark${bookmarked(i) ? '-check' : '-outline'}`"
              color="primary"
              @click="Bookmark(item.time, i)"
            />
            <v-btn
              rounded="lg"
              icon="mdi-thumb-up"
              :color="(item.liked ?? {})[userInfo.uid] ? 'primary' : 'grey'"
              class="mr-1"
              @click="Like(item)"
            />
            <span class="subheading" v-text="Keys(item.liked ?? {}).length" />
          </v-card-actions>
        </v-card>
      </v-card>

      <v-snackbar v-model="bookmarkSnackbar" color="white">
        추가되었습니다.

        <template #actions>
          <v-btn color="red" variant="text" to="/user/bookmarks">
            확인하기
          </v-btn>
        </template>
      </v-snackbar>
      <v-snackbar v-model="bookmarkSnackbarDel" color="white">
        삭제되었습니다.

        <template #actions>
          <v-btn
            color="red"
            variant="text"
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
  },
  imageonly: {
    type: Boolean,
    default: false
  }
})
const bookmarkSnackbar = ref<boolean>(false)
const bookmarkSnackbarDel = ref<boolean>(false)
const bookmarked = (i: number) => {
  return Keys(props.items[i].bookmarks ?? {}).includes(userInfo.uid)
}

onKeyStroke('l', () => {
  if (route.path === '/book/list') {
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

    Libris(userInfo.uid, -1)
    Libris(item.uid, -1)
  } else {
    item.likes++

    try {
      item.liked[userInfo.uid] = true
    } catch (e) {
      alert(e)
    }

    $db.ref(`/contents/${item.time}/liked/${userInfo.uid}`).set(true)
    $db.ref(`/contents/${item.time}/likes`).set(item.likes)

    Libris(userInfo.uid, 1)
    Libris(item.uid, 1)
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
    props.items[i].bookmarks = {
      ...props.items[i].bookmarks,
      [userInfo.uid]: true
    }
    Libris(userInfo.uid, 1)
  }
}
</script>

<style scoped>
.row {
  margin-top: 5px;
  gap: 3px;
  margin: 5px;
}
</style>

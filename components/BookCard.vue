<!-- eslint-disable vue/html-indent -->
<!-- eslint-disable vue/no-use-v-if-with-v-for -->
<template>
  <v-lazy>
    <v-row class="row">
      <v-card
        v-for="(item, i) in items"
        :key="i"
        :width="$vuetify.breakpoint.mobile ? 150 : 200"
        class="mx-auto my-5 transparent"
      >
        <v-card :to="`/book/content/${item.time}`" class="transparent">
          <v-img :src="item.image" :lazy-src="item.image" class="rounded-lg">
            <template #placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5" />
              </v-row>
            </template>
          </v-img>

          <v-card-title class="primary--text">{{ item.title }}</v-card-title>

          <v-card-subtitle>
            <NLink :to="`/user/${item.uid}`">{{ item.displayName }}</NLink>
          </v-card-subtitle>

          <v-card-text>
            <span class="text--disabled">
              {{ formatter.format(item.views) }} views ·
              {{ new Date(parseInt(item.time)).toLocaleDateString() }}
            </span>
          </v-card-text>
        </v-card>

        <v-card v-show="!simple" class="transparent">
          <v-card-actions v-if="userInfo.uid">
            <v-btn icon color="primary" @click="Bookmark(item.time, i)">
              <v-icon>
                mdi-bookmark{{ bookmarked(i) ? '-check' : '-outline' }}
              </v-icon>
            </v-btn>
            <v-btn
              icon
              :color="item.liked[userInfo.uid] ? 'primary' : 'grey'"
              class="mr-2"
              @click="Like(item)"
            >
              <v-icon> mdi-thumb-up </v-icon>
            </v-btn>
            <span class="subheading" v-text="item.likes" />

            <v-spacer />

            <v-btn
              v-if="
                item?.comments?.length ||
                Object.keys(item?.comments ?? {}).length
              "
              disabled
              icon
              color="grey"
            >
              <v-icon small>mdi-comment</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>

      <v-snackbar v-model="bookmarkSnackbar">
        북마크가 추가되었습니다.

        <template #action="{ attrs }">
          <v-btn
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
        북마크가 삭제되었습니다.

        <template #action="{ attrs }">
          <v-btn
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
import { db } from '@/plugins/firebase'
import { formatter, User } from '@/plugins/global'

const userInfo = User()
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
  return Object.keys(props.items[i].bookmarks ?? {}).includes(
    userInfo.value.uid
  )
}

const Like = (item: any) => {
  if (item.liked[userInfo.value.uid]) {
    item.likes--
    item.liked[userInfo.value.uid] = false

    db.ref(`/contents/${item.time}/liked/${userInfo.value.uid}`).set(false)
    db.ref(`/contents/${item.time}/likes`).set(item.likes)

    Libris(userInfo.value.uid, -0.1)
    Libris(item.uid, -0.1)
  } else {
    item.likes++

    try {
      item.liked[userInfo.value.uid] = true
    } catch (e) {
      console.log(e)
    }

    db.ref(`/contents/${item.time}/liked/${userInfo.value.uid}`).set(true)
    db.ref(`/contents/${item.time}/likes`).set(item.likes)

    Libris(userInfo.value.uid, 0.1)
    Libris(item.uid, 0.1)
  }
}

const Bookmark = (time: string, i: number) => {
  if (bookmarked(i)) {
    bookmarkSnackbar.value = false
    bookmarkSnackbarDel.value = true

    db.ref(`/users/${userInfo.value.uid}/bookmarks/${time}`).remove()
    db.ref(`/contents/${time}/bookmarks/${userInfo.value.uid}`).remove()

    // eslint-disable-next-line vue/no-mutating-props
    props.items[i].bookmarks = Object.fromEntries(
      Object.entries(props.items[i].bookmarks ?? {}).filter(
        ([key]) => key !== userInfo.value.uid
      )
    )
  } else {
    const { title, image } = props.items[i]

    bookmarkSnackbarDel.value = false
    bookmarkSnackbar.value = true

    db.ref(`/users/${userInfo.value.uid}/bookmarks/${time}`).set({
      title,
      image,
      time
    })
    db.ref(`/contents/${time}/bookmarks/${userInfo.value.uid}`).set(true)

    // eslint-disable-next-line vue/no-mutating-props
    props.items[i] = {
      ...props.items[i],
      bookmarks: {
        ...props.items[i].bookmarks,
        [userInfo.value.uid]: true
      }
    }
    Libris(userInfo.value.uid, 0.1)
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

<template>
  <div>
    <v-text-field
      v-if="userInfo"
      v-model="comment"
      :disabled="!userInfo.loggedIn"
      variant="outlined"
      flat
      hide-details
      label="댓글 달기"
      append-inner-icon="mdi-send-variant"
      @keydown.enter="Comment"
      @click:append-inner="Comment"
    />

    <v-list v-if="comments.length > 0">
      <v-list-item
        v-for="(message, i) in comments"
        :key="message.time"
        class="my-3 d-inline"
      >
        <v-card rounded width="100%" class="d-flex mr-5 rounded-lg">
          <v-avatar size="50" class="ma-auto ml-2">
            <UserPhoto :size="50" :src="message?.photoURL" />
          </v-avatar>

          <div>
            <v-card-title>{{ message.displayName }}</v-card-title>
            <v-card-text>
              {{ message.content }}
            </v-card-text>
          </div>

          <v-spacer />

          <v-card-actions>
            <v-btn
              rounded="lg"
              variant="tonal"
              icon
              :color="message.love?.includes(userInfo.uid) ? 'red' : 'grey'"
              @click="Love(i)"
            >
              <v-icon>mdi-heart</v-icon>
              <span v-text="message.love?.length" />
            </v-btn>

            <v-btn v-if="userInfo.is(message.uid)" icon rounded="lg" cols="1">
              <v-icon>mdi-dots-vertical</v-icon>

              <v-menu offset-y activator="parent">
                <v-list>
                  <v-list-item @click="Delete(i)">
                    <v-list-item-title>
                      <v-icon start> mdi-trash-can </v-icon> 삭제
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <div v-else>
      <v-card class="text-center text-grey">
        <v-card-text>댓글이 없습니다.</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const userInfo = User()
const props = defineProps({
  link: {
    type: String,
    required: true
  },
  dbr: {
    type: String,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  cb: {
    type: Function,
    default: () => {}
  }
})
const comment = ref<string>('')
const comments = ref<any>([])

onBeforeMount(() =>
  $db
    .ref(props.dbr)
    .on('child_added', async (s: any) =>
      comments.value.push({ ...(await s.val()), id: s.key })
    )
)

const Delete = (i: number) => {
  $db.ref(props.dbr).child(comments.value[i].id).remove()
  comments.value.splice(i, 1)
}

const Love = (i: number) => {
  const cmt = $db.ref(props.dbr)
  const love = comments.value[i].love
  if (love) {
    if (love.includes(userInfo.uid)) {
      love.splice(love.indexOf(userInfo.uid), 1)
    } else {
      love.push(userInfo.uid)

      Notify(
        comments.value[i].uid,
        userInfo.photoURL,
        `${userInfo.displayName}님이 좋아요를 눌렀습니다`,
        props.link
      )
    }
  } else {
    comments.value[i].love = [userInfo.uid]
  }
  cmt.set(comments.value)
  comments.value = [...comments.value]
}

const Comment = () => {
  if (comment.value.length > 0) {
    const { displayName, photoURL, uid } = userInfo
    const content = comment.value

    $db.ref(props.dbr).push({
      uid,
      photoURL,
      displayName,
      time: Date.now(),
      content
    })

    $db.ref(`${props.dbr.replace('/comments', '')}/joined`).update({
      [uid]: {
        displayName,
        photoURL
      }
    })

    $db
      .ref(`${props.dbr.replace('/comments', '')}/joined`)
      .once('value', async (s: any) => {
        const joined = Keys(await s.val())

        for (const user in joined) {
          if (userInfo.is(joined[user])) continue
          Notify(joined[user], userInfo.photoURL, content, props.link)
        }
      })

    Notify(props.uid, userInfo.photoURL, content, props.link)

    if (comments.value.length > 5) Libris(userInfo.uid, 5)

    props.cb()
    comment.value = ''
  }
}
</script>

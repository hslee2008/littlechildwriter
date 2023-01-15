<template>
  <div>
    <v-text-field
      v-if="userInfo && !nofield"
      v-model="comment"
      flat
      variant="outlined"
      single-line
      hide-details
      label="댓글 달기"
      append-inner-icon="mdi-send"
      @keydown.enter="Comment"
      @click:append-inner="Comment"
    />

    <v-list v-if="comments.length > 0" dense clipped nav bg-color="#23262e">
      <v-list-item
        v-for="(message, i) in comments"
        :key="message.time"
        class="my-3 d-inline"
        bg-color="#23262e"
      >
        <v-card
          rounded
          width="100%"
          class="d-flex mr-5 rounded-lg"
          color="#23262e"
        >
          <NuxtLink :to="`/user/${message.uid}`" class="ma-auto ml-2">
            <v-avatar size="40">
              <UserPhoto :src="message.photoURL" />
            </v-avatar>
          </NuxtLink>

          <div v-if="!message.edit">
            <v-card-title>{{ message.displayName }}</v-card-title>
            <v-card-subtitle>
              {{ message.content }}
            </v-card-subtitle>
          </div>
          <v-text-field
            v-else
            :model-value="updatedcomment"
            flat
            single-line
            variant="outlined"
            class="ml-2 mt-3"
            @keydown.enter="Update(i)"
          >
            <template #append>
              <v-btn
                variant="tonal"
                color="error"
                text
                depressed
                class="mr-3"
                @click=";(message.edit = false), (comments = [...comments])"
              >
                취소
              </v-btn>
              <v-btn variant="tonal" color="primary" text @click="Update(i)"> 저장 </v-btn>
            </template>
          </v-text-field>

          <v-spacer />

          <v-card-actions v-if="!message.edit">
            <v-btn
              v-if="(message.love || []).length > 0"
              variant="tonal"
              icon
              depressed
              disabled
              :color="message.love?.includes(userInfo.uid) ? 'red' : 'grey'"
              @click="Love(i)"
            >
              <v-icon>mdi-heart</v-icon>
              <span v-text="message.love?.length" />
            </v-btn>
            <v-menu offset-y>
              <template #activator="{ props }">
                <v-btn variant="tonal" icon v-bind="props" cols="1">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <template v-if="userInfo.displayName === message.displayName">
                  <v-list-item @click="Edit(i)">
                    <v-list-item-title>
                      <v-icon start> mdi-pencil </v-icon>
                      {{ comments[i].edit ? '취소' : '수정' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="Delete(i)">
                    <v-list-item-title>
                      <v-icon start> mdi-trash-can </v-icon> 삭제
                    </v-list-item-title>
                  </v-list-item>
                </template>

                <v-list-item v-if="message.uid !== userInfo.uid">
                  <v-col cols="2">
                    <v-btn
                      variant="tonal"
                      icon
                      :color="
                        message.love?.includes(userInfo.uid) ? 'red' : 'grey'
                      "
                      @click="Love(i)"
                    >
                      <v-icon> mdi-heart </v-icon>
                    </v-btn>
                  </v-col>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-list-item>
    </v-list>
    <div v-else>
      <v-card
        v-if="comments.length === 0 && !parent"
        class="text-center"
        color="#23262e"
        flat
      >
        <v-card-text>댓글이 없습니다.</v-card-text>
      </v-card>
    </div>

    <v-snackbar :model-value="snackbarBadWord">
      AI가 긴장감을 {{ Math.round(toxcity * 1000) / 10 }}% 감지했습니다. 댓글을
      수정해주세요.

      <template #action="{ props }">
        <v-btn
          variant="tonal"
          color="pink"
          text
          v-bind="props"
          @click="snackbarBadWord = false"
        >
          닫기
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup lang="ts">
import Perspective from 'perspective-api-client'

const { $db } = useNuxtApp()

const perspective = new Perspective({
  apiKey: 'AIzaSyDvYhT2fhpVhaPf3TMSQITmcl3Qh_OGd4U'
})

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
  nofield: {
    type: Boolean,
    default: false
  },
  cb: {
    type: Function,
    default: () => {}
  },
  parent: {
    type: Boolean,
    default: false
  }
})
const comment = ref<string>('')
const updatedcomment = ref<string>('')
const comments = ref<any>([])
const snackbarBadWord = ref(false)
const toxcity = ref(0)

onBeforeMount(() =>
  $db
    .ref(props.dbr)
    .on('child_added', async (s: any) =>
      comments.value.push({ ...(await s.val()), id: s.key })
    )
)

const Edit = (i: number) => {
  comments.value[i].edit = true
  updatedcomment.value = comments.value[i].content
  comments.value = [...comments.value]
}

const Update = (i: number) => {
  comments.value[i].edit = false
  $db.ref(`${props.dbr}/${Object.keys(comments.value)[i]}`).update({
    ...comments.value[i],
    content: updatedcomment.value
  })
  comments.value = [...comments.value]
}

const Delete = (i: number) => {
  $db.ref(props.dbr).child(comments.value[i].id).remove()
  comments.value.splice(i, 1)
}

const Love = (i: number) => {
  const cmt = $db.ref(props.dbr)
  const love = comments.value[i].love
  if (love) {
    if (love.includes(userInfo.value.uid)) {
      love.splice(love.indexOf(userInfo.value.uid), 1)
    } else {
      love.push(userInfo.value.uid)

      Notify(
        comments.value[i].uid,
        userInfo.value.photoURL,
        `${userInfo.value.displayName}님이 좋아요를 눌렀습니다`,
        props.link
      )
    }
  } else {
    comments.value[i].love = [userInfo.value.uid]
  }
  cmt.set(comments.value)
  comments.value = [...comments.value]
}

const Comment = async () => {
  let result: any = {}
  let score: number = 0
  let mostProbable: string = ''

  try {
    result = await perspective.analyze(comment.value, {
      attributes: ['TOXICITY']
    })
    score = result.attributeScores.TOXICITY.summaryScore.value || 'good'
    mostProbable = Object.keys(result.attributeScores).reduce((a, b) =>
      result.attributeScores[a].summaryScore.value >
      result.attributeScores[b].summaryScore.value
        ? a
        : b
    )
  } catch (e) {
    console.log(e)
  }

  if (score > 0.6) {
    snackbarBadWord.value = true
    toxcity.value = score
    Libris(userInfo.value.uid, -score * 10)
    return
  }

  if (comment.value.length > 0) {
    const { displayName, photoURL, uid } = userInfo.value
    const badWord = score > 0.6
    const content = comment.value

    $db.ref(props.dbr).push({
      uid,
      photoURL,
      displayName,
      time: Date.now(),
      probably: badWord ? mostProbable : 'good',
      content,
      score
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
        const joined = Object.keys(await s.val())

        for (const user in joined) {
          if (joined[user] === userInfo.value.uid) continue
          Notify(joined[user], userInfo.value.photoURL, content, props.link)
        }
      })

    Notify(props.uid, userInfo.value.photoURL, content, props.link)
    Libris(userInfo.value.uid, 5)

    props.cb()
    comment.value = ''
  }
}
</script>

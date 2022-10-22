<template>
  <div>
    <v-text-field
      v-if="userInfo && !nofield"
      v-model="comment"
      flat
      solo
      hide-details
      label="댓글 달기"
      @keydown.enter="Comment"
    >
      <template #append>
        <v-btn icon depressed @click="Comment">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-timeline v-if="comments.length > 0" dense clipped>
      <v-slide-y-transition group>
        <v-timeline-item v-for="(message, i) in comments" :key="message.time">
          <template #icon>
            <v-tooltip left>
              <template #activator="{ on, attrs }">
                <v-avatar
                  v-bind="attrs"
                  size="40"
                  :color="message.badWord ? 'red' : '#23262E'"
                  v-on="on"
                >
                  <v-img :src="message.photoURL" />
                </v-avatar>
              </template>
              <span v-text="message.displayName" />
            </v-tooltip>
          </template>

          <v-row>
            <v-card
              rounded
              width="100%"
              class="d-flex mr-5"
              :color="message.badWord ? 'red' : '#23262E'"
            >
              <v-card-subtitle v-if="!message.edit">
                {{ message.content }}
              </v-card-subtitle>
              <v-text-field
                v-else
                v-model="updatedcomment"
                flat
                @keydown.enter="Update(i)"
              >
                <template #append>
                  <v-btn
                    color="error"
                    text
                    depressed
                    @click="message.edit = false"
                  >
                    취소
                  </v-btn>
                  <v-btn
                    color="primary"
                    text
                    :disabled="message.content === updatedcomment"
                    @click="Update(i)"
                  >
                    저장
                  </v-btn>
                </template>
              </v-text-field>

              <v-spacer />

              <v-card-actions v-if="!message.edit">
                <v-btn
                  v-if="(message.love || []).length > 0"
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
                  <template #activator="{ on, attrs }">
                    <v-btn icon v-bind="attrs" cols="1" v-on="on">
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <template
                      v-if="userInfo.displayName === message.displayName"
                    >
                      <v-list-item v-if="!message.badWord" @click="Edit(i)">
                        <v-list-item-title>
                          <v-icon left> mdi-pencil </v-icon>
                          {{ comments[i].edit ? '취소' : '수정' }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="Delete(i)">
                        <v-list-item-title>
                          <v-icon left> mdi-trash-can </v-icon> 삭제
                        </v-list-item-title>
                      </v-list-item>
                    </template>

                    <v-list-item
                      v-if="!parent && !message.badWord"
                      @click="Reply(i)"
                    >
                      <v-list-item-title>
                        <v-icon left> mdi-reply </v-icon> 답장
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="message.uid !== userInfo.uid">
                      <v-col cols="2">
                        <v-btn
                          icon
                          :color="
                            message.love?.includes(userInfo.uid)
                              ? 'red'
                              : 'grey'
                          "
                          @click="Love(i)"
                        >
                          <v-icon> mdi-heart </v-icon>
                        </v-btn>
                      </v-col>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <template v-if="message.badWord">
                  <v-tooltip bottom>
                    <template #activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on"> mdi-alert </v-icon>
                    </template>
                    <span>
                      {{ message.probably }}:
                      {{ Math.round(message.score * 1000) / 10 }}%
                    </span>
                  </v-tooltip>
                </template>
              </v-card-actions>
            </v-card>
          </v-row>

          <LazyCommentComponent
            v-if="!parent"
            :link="link"
            :dbr="`${dbr}/${message.id}/reply`"
            :uid="userInfo.uid"
            :nofield="replying !== i"
            :cb="() => (replying = -1)"
            :parent="true"
          />
        </v-timeline-item>
      </v-slide-y-transition>
    </v-timeline>
    <div v-else>
      <v-card
        v-if="comments.length === 0 && !parent"
        class="text-center transparent"
        flat
      >
        <v-card-text>댓글이 없습니다.</v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { db } from '@/plugins/firebase'
import { Libris, Notify, User } from '@/plugins/global'

const Perspective = require('perspective-api-client')
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
const replying = ref<number>(-1)

onBeforeMount(() =>
  db
    .ref(props.dbr)
    .on('child_added', async s =>
      comments.value.push({ ...(await s.val()), id: s.key })
    )
)

const Edit = (i: number) => {
  comments.value[i].edit = true
  updatedcomment.value = comments.value[i].content
  comments.value = [...comments.value]
}

const Reply = (i: number) => (replying.value = i)

const Update = (i: number) => {
  comments.value[Object.keys(comments.value)[i]] = {
    ...comments.value[i],
    content: updatedcomment.value,
    edited: true,
    time: Date.now()
  }

  delete comments.value[i].edit
  db.ref(props.dbr).set(comments.value)
}

const Delete = (i: number) => {
  db.ref(props.dbr).child(comments.value[i].id).remove()
  comments.value.splice(i, 1)
}

const Love = (i: number) => {
  const cmt = db.ref(props.dbr)
  const love = comments.value[i].love
  if (love) {
    if (love.includes(userInfo.value.uid)) {
      love.splice(love.indexOf(userInfo.value.uid), 1)
    } else {
      love.push(userInfo.value.uid)

      Notify(
        comments.value[i].uid,
        userInfo.value.photoURL,
        '좋아요 ❤️',
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
  const result = await perspective.analyze(comment.value, {
    attributes: ['TOXICITY']
  })
  const score = result.attributeScores.TOXICITY.summaryScore.value || 'good'
  const mostProbable = Object.keys(result.attributeScores).reduce((a, b) =>
    result.attributeScores[a].summaryScore.value >
    result.attributeScores[b].summaryScore.value
      ? a
      : b
  )

  if (comment.value.length > 0) {
    const { displayName, photoURL, uid } = userInfo.value
    const badWord = score > 0.6
    const content = comment.value

    db.ref(props.dbr).push({
      uid,
      photoURL,
      displayName,
      time: Date.now(),
      probably: badWord ? mostProbable : 'good',
      content,
      badWord,
      score
    })

    db.ref(`${props.dbr.replace('/comments', '')}/joined`).update({
      [uid]: {
        displayName,
        photoURL
      }
    })

    db.ref(`${props.dbr.replace('/comments', '')}/joined`).once(
      'value',
      async s => {
        const joined = Object.keys(await s.val())

        for (const user in joined) {
          if (joined[user] === userInfo.value.uid) continue
          Notify(joined[user], userInfo.value.photoURL, content, props.link)
        }
      }
    )

    Libris(userInfo.value.uid, 0.1)

    props.cb()
    comment.value = ''
  }
}
</script>

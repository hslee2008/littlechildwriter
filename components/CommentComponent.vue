<template>
  <div>
    <v-text-field
      v-if="userInfo.uid && !nofield"
      v-model="comment"
      flat
      solo
      hide-details
      label="댓글 달기"
      @keydown.enter="commentpost"
    >
      <template #append>
        <v-btn icon depressed @click="commentpost">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-timeline v-if="!nocomments && comments.length > 0" dense clipped>
      <v-slide-x-transition group>
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
              <v-card-subtitle v-if="!message.edit" v-text="message.content" />
              <v-text-field
                v-else
                v-model="updatedcomment"
                flat
                @keydown.enter="updatecomment(i)"
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
                    @click="updatecomment(i)"
                  >
                    저장
                  </v-btn>
                </template>
              </v-text-field>

              <v-spacer />

              <v-card-actions v-if="!message.edit">
                <v-menu offset-y>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      v-if="userInfo.displayName === message.displayName"
                      icon
                      v-bind="attrs"
                      cols="1"
                      v-on="on"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item
                      v-if="!message.badWord"
                      @click="editcomment(i)"
                    >
                      <v-list-item-title>
                        <v-icon left> mdi-pencil </v-icon>
                        {{ comments[i].edit ? '취소' : '수정' }}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="delcomment(i)">
                      <v-list-item-title>
                        <v-icon left> mdi-trash-can </v-icon> 삭제
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="!parent" @click="replycomment(i)">
                      <v-list-item-title>
                        <v-icon left> mdi-reply </v-icon> 답장
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
                <template v-if="message.badWord">
                  <v-icon>mdi-alert-circle</v-icon>
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
      </v-slide-x-transition>
    </v-timeline>
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'
import * as filter from 'leo-profanity'

export default {
  props: {
    link: {
      type: String,
      required: true
    },
    uid: {
      type: String,
      required: true
    },
    dbr: {
      type: String,
      required: true
    },
    nocomments: {
      type: Boolean,
      default: false
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
  },
  data() {
    return {
      comment: '',
      updatedcomment: '',
      reply: '',
      replying: -1,
      comments: []
    }
  },
  created() {
    db.ref(this.dbr).on('child_added', async s =>
      this.comments.push({ ...(await s.val()), id: s.key })
    )
  },
  methods: {
    editcomment(i) {
      this.comments[i].edit = !this.comments[i].edit
      this.updatedcomment = this.comments[i].content
      this.$forceUpdate()
    },
    replycomment(i) {
      this.replying = i
      this.$forceUpdate()
    },
    replycommentpost(i) {
      if (this.reply) {
        db.ref(`${this.dbr}/${i}/reply`).push({
          displayName: this.userInfo.displayName,
          photoURL: this.userInfo.photoURL,
          content: this.reply,
          time: Date.now()
        })
      }
    },
    updatecomment(i) {
      this.comments[Object.keys(this.comments)[i]] = {
        ...this.comments[i],
        content: this.updatedcomment,
        edited: true,
        time: Date.now()
      }

      delete this.comments[i].edit
      this.$forceUpdate()
      db.ref(this.dbr).set(this.comments)
    },
    delcomment(i) {
      const cmt = db.ref(this.dbr)
      this.comments.splice(i, 1)
      cmt.set(this.comments)
      this.$forceUpdate()
    },
    commentpost() {
      filter.loadDictionary('en-us')

      if (this.comment.length > 0) {
        const comments = db.ref(this.dbr)
        const { displayName, photoURL, uid } = this.userInfo

        comments.push({
          uid,
          photoURL,
          displayName,
          time: Date.now(),
          content: filter.clean(this.comment),
          badWord: filter.check(this.comment)
        })

        this.notify(this.uid, this.comment, this.link)
        this.updateLibris(this.userInfo.uid, 0.1)
        this.cb()

        this.comment = ''

        if (filter.check(this.comment)) {
          this.updateLibris(this.userInfo.uid, -5)
          this.notify(this.uid, `나쁜 말을 사용했습니다. -5점`, this.link)
        }
      }
    }
  }
}
</script>

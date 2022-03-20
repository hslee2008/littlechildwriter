<template>
  <div>
    <v-text-field
      flat
      solo
      hide-details
      label="댓글 달기"
      :disabled="disabled"
      v-model="comment"
      @keydown.enter="commentpost"
    >
      <template v-slot:append>
        <v-btn icon depressed @click="commentpost" :disabled="disabled">
          <v-icon>mdi-send</v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-timeline dense clipped>
      <v-slide-x-transition group>
        <v-timeline-item
          v-for="(message, index) in comments"
          :key="message.time + index"
          class="mb-4 mr-3"
          small
          :color="userInfo.username.includes(message.username) ? 'blue' : 'red'"
          :icon="message.badWord ? 'mdi-alert' : ''"
        >
          <template v-slot:icon>
            <v-avatar size="30">
              <img :src="message.photo" />
            </v-avatar>
          </template>
          <v-alert dense outlined dense v-if="message.badWord">
            <v-row>
              <v-col class="my-auto">
                <h3>{{ message.content }} (필터됨)</h3>
              </v-col>

              <v-col class="text-right">
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      v-if="userInfo.username.includes(message.username)"
                      cols="1"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title @click="editcomment(index)"
                        ><v-icon left>mdi-pencil</v-icon>편집</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="delcomment(message, index)"
                        ><v-icon color="error" left>mdi-delete</v-icon
                        >삭제</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-alert>

          <v-row v-else>
            <v-card border outlined prominent rounded style="display: flex">
              <div>
                <v-card-title
                  >{{ message.username }}
                  <v-spacer class="mx-5"></v-spacer>
                  <span
                    class="font-italic text-right text--disabled"
                    style="font-size: 0.8rem"
                    >({{ new Date(message.time).toLocaleDateString() }})</span
                  ></v-card-title
                >
                <v-card-subtitle v-if="!message.edit">{{
                  message.content
                }}</v-card-subtitle>
                <v-card-subtitle v-else>
                  <v-text-field
                    v-model="updatedcomment"
                    hide-details
                    flat
                    label="댓글 변경"
                    solo
                    @keydown.enter="updatecomment(index)"
                  >
                    <template v-slot:append>
                      <v-btn
                        class="mx-0"
                        icon
                        depressed
                        @click="updatecomment(index)"
                      >
                        <v-icon>mdi-send</v-icon>
                      </v-btn>
                    </template>
                  </v-text-field>
                </v-card-subtitle>
              </div>

              <v-spacer></v-spacer>

              <v-card-actions>
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      icon
                      v-bind="attrs"
                      v-on="on"
                      v-if="userInfo.username.includes(message.username)"
                      cols="1"
                    >
                      <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item>
                      <v-list-item-title @click="editcomment(index)"
                        ><v-icon left>mdi-pencil</v-icon>편집</v-list-item-title
                      >
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="delcomment(message, index)"
                        ><v-icon color="error" left>mdi-delete</v-icon
                        >삭제</v-list-item-title
                      >
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-card-actions>
            </v-card>
          </v-row>
        </v-timeline-item>
      </v-slide-x-transition>
    </v-timeline>
  </div>
</template>

<script>
import { auth, db } from '../../plugins/firebase.js';
import * as filter from 'leo-profanity';

export default {
  props: ['databaseReference', 'id'],
  data() {
    return {
      comment: '',
      updatedcomment: '',
      comments: [],

      disabled: false,

      userInfo: {
        uid: '',
        username: '',
        isuser: false,
        photo: '',
      },
    };
  },
  methods: {
    async getUser() {
      auth.onAuthStateChanged(async (user) => {
        if (user)
          this.userInfo = {
            uid: user.uid,
            username: user.displayName,
            isuser: this.uid === user.uid,
            photo: user.photoURL,
          };
        else this.disabled = true;
      });
    },
    async editcomment(index) {
      this.comments[index]['edit'] = true;
      this.$forceUpdate();
    },
    async updatecomment(index) {
      this.comments[Object.keys(this.comments)[index]] = {
        ...this.comments[index],
        content: this.updatedcomment,
        edited: true,
        time: Date.now(),
      };

      delete this.comments[index].edit;

      this.$forceUpdate();

      const comments = db.ref(this.databaseReference);

      comments.set(this.comments);
    },
    async getComments() {
      this.comments = Object.values(
        await db
          .ref(this.databaseReference)
          .once('value')
          .then((s) => s.val() ?? [])
      );
    },
    async delcomment(message, index) {
      const comments = db.ref(this.databaseReference);

      comments.once('value', (s) =>
        s.forEach((c) => {
          if (
            c.val().uid === this.userInfo.uid &&
            c.val().time === message.time
          )
            comments.child(c.key).remove();
        })
      );

      delete this.comments[index];

      this.getComments();
    },
    async updateLibris(useruid) {
      await auth.onAuthStateChanged(async (user) => {
        if (user)
          db.ref(`users/${user.uid}/libris`)
            .once('value')
            .then((s) =>
              db.ref(`users/${user.uid}/libris`).set(parseInt(s.val()) + 0.5)
            );
      });
    },
    async commentpost() {
      if (this.comment.length > 0) {
        const timestamp = Date.now();

        const comments = await db.ref(this.databaseReference);

        filter.loadDictionary('en-us');
        filter.loadDictionary('ko-kr');

        await auth.onAuthStateChanged(async (user) => {
          if (user)
            comments.push({
              username: this.userInfo.username,
              content: filter.clean(this.comment),
              time: timestamp,
              uid: user.uid,
              badWord: filter.check(this.comment),
              photo: this.userInfo.photo,
            });
        });

        this.notify();
        this.updateLibris(this.uid);

        this.comment = '';

        this.getComments();
      }
    },
    async notify() {
      await db.ref(`users/${this.uid}/notification`).push({
        title: `${this.userInfo.username}님이 댓글를 작성했습니다.`,
        time: Date.now(),
        link: this.id,
      });
    },
  },
  created() {
    this.getComments();
    this.getUser();
  },
};
</script>

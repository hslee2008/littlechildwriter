<template>
  <v-data-iterator :items="classes" hide-default-footer>
    <template #header>
      <v-dialog v-model="dialog" width="500">
        <template #activator="{ on, attrs }">
          <v-btn color="primary" v-bind="attrs" v-on="on">
            <v-icon left> mdi-google-classroom </v-icon> 만들기
          </v-btn>
        </template>

        <v-stepper v-model="steps" flat rounded>
          <v-stepper-header>
            <v-stepper-step :complete="steps > 0" step="1">
              기본 정보
            </v-stepper-step>

            <v-stepper-step step="2"> 이미지 업로드 </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card-title> 클래스 기본 정보 </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="classInfo.name"
                  label="클래스 이름"
                  required
                />

                <v-text-field
                  v-model="classInfo.description"
                  label="클래스 설명"
                  required
                />

                <v-checkbox v-model="classInfo.public" label="공개" />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn
                  :disabled="!classInfo.name"
                  color="primary"
                  text
                  @click="steps = 2"
                >
                  👌 OK
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card-title> 클래스 고급 정보 </v-card-title>

              <v-card-text>
                <v-text-field
                  v-model="classInfo.image"
                  label="클래스 사진 URL"
                />
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn text @click="makeAClass">
                  <v-icon left> mdi-check </v-icon> 만들기
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-dialog>
    </template>

    <template #default="props">
      <v-row class="mt-5 ma-1 g-10">
        <v-card
          v-for="item in props.items"
          :key="item.creator + item.name"
          class="my-3 transparent"
        >
          <v-card
            v-if="item.public || item.uid === userInfo.uid || exists"
            class="transparent"
            :to="`/class/${item.id}`"
          >
            <v-img :src="item.image" width="50vh" class="ma-auto rounded-lg">
              <v-avatar class="ma-3">
                <v-img :src="item.photoURL" />
              </v-avatar>
            </v-img>

            <v-card-title class="primary--text">
              {{ item.name }} ({{ item.public ? '공개' : '비공개' }})
            </v-card-title>
            <v-card-subtitle>{{ item.creator }}</v-card-subtitle>
            <v-card-text>{{ item.description }}</v-card-text>
          </v-card>
        </v-card>
      </v-row>
    </template>
  </v-data-iterator>
</template>

<script>
// todo to typescript
import Vue from 'vue'
import { db } from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      classes: [],

      classInfo: {
        name: '',
        description: '',
        image: '',
        creator: '',
        id: '',
        uid: '',
        photoURL: '',
        public: true,
        users: []
      },

      dialog: false,
      steps: 1
    }
  },
  computed() {
    return {
      exists() {
        return (
          Object.values(this.item.users).filter(e => e.uid === userInfo.uid)
            .length > 0
        )
      }
    }
  },
  created() {
    db.ref('classes').on('child_added', async s =>
      this.classes.push(await s.val())
    )
  },
  methods: {
    makeAClass() {
      this.dialog = false

      const { displayName, uid, photoURL } = this.userInfo
      const { name } = this.classInfo

      this.classInfo = {
        ...this.classInfo,
        creator: displayName,
        id: uid + name,
        uid,
        photoURL
      }

      db.ref('classes')
        .child(uid + name)
        .set(this.classInfo)

      this.classInfo = {
        name: '',
        description: '',
        image: '',
        creator: '',
        id: '',
        uid: '',
        photoURL: '',
        public: true,
        users: []
      }
      this.dialog = false
      this.steps = 1
    }
  }
})
</script>

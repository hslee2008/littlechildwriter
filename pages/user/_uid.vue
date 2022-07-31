<template>
  <div>
    <v-row class="ma-auto">
      <v-avatar size="80">
        <v-img :src="targetUser.photoURL" />
      </v-avatar>

      <div class="d-flex align-center">
        <div>
          <h2 class="my-auto mx-5 zmax" v-text="targetUser.displayName" />
          <p class="grey--text ml-5">구독자 {{ subscriberNumber }}명</p>
        </div>
      </div>

      <v-btn
        v-if="userInfo.uid !== uid"
        class="ml-auto my-auto float-right"
        color="red"
        @click="subscribe"
        v-text="subscribed ? '취소' : '구독'"
      />
      <v-btn
        v-else
        class="ml-auto my-auto"
        color="primary"
        to="/account/account"
      >
        편집 <v-icon right> mdi-pencil </v-icon>
      </v-btn>
    </v-row>

    <br />

    <v-tabs v-model="tab" show-arrows center-active grow class="transparent">
      <v-tab> 게시물 </v-tab>
      <v-tab> 구독자 </v-tab>
      <v-tab> 커뮤니티 </v-tab>
      <v-tab> 정보 </v-tab>

      <v-tabs-items v-model="tab" class="py-5 transparent">
        <v-tab-item>
          <v-select
            v-model="rating"
            :items="['모두', 5, 4, 3, 2, 1]"
            label="평점 선택"
            outlined
          />
          <LazyBookCard
            :items="
              rating === '모두' ? books : books.filter(i => i.rating === rating)
            "
            :simple="true"
          />
        </v-tab-item>

        <v-tab-item>
          <v-list class="transparent">
            <v-list-item
              v-for="item in Object.keys(subscription)"
              :key="item"
              :to="`/user/${item}`"
            >
              <v-list-item-content>
                <v-list-item-title v-text="subscription[item]" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>

        <v-tab-item>
          <LazyCommentComponent
            :id="`/user/${uid}`"
            :dbr="`users/${uid}/chat`"
            :uid="this.uid"
          />
        </v-tab-item>

        <v-tab-item>
          <div v-if="targetUser.bio">
            <v-card-title v-text="targetUser.bio" />
            <v-divider class="my-10" />
          </div>

          <v-list flat class="rounded-lg">
            <v-subheader>통계</v-subheader>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-library</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="Math.round(targetUser.libris)" />
              </v-list-item-content>
            </v-list-item>

            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-book-open</v-icon>
              </v-list-item-icon>

              <v-list-item-content>
                <v-list-item-title v-text="books.length" />
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>

    <br /><br />
  </div>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  asyncData({ params }) {
    const uid = params.uid
    return { uid }
  },
  data() {
    return {
      rating: '모두',
      tab: 0,

      targetUser: {
        libris: '',
        username: '',
        photoURL: '',
        bio: ''
      },

      subscription: [],
      subscribed: false,
      subscriberNumber: 0,
      books: []
    }
  },
  created() {
    this.fetchContent()
    this.getTargetUserInfo()
  },
  methods: {
    fetchContent() {
      db.ref('/contents/').on('child_added', async s => {
        const data = await s.val()
        data.uid === this.uid && this.books.unshift(data)
      })
    },
    getTargetUserInfo() {
      db.ref(`/users/${this.uid}/`)
        .once('value')
        .then(res => res.val())
        .then(({ libris, displayName, photoURL, bio, subscriber }) => {
          this.targetUser = {
            libris,
            displayName,
            photoURL,
            bio
          }

          this.subscription = subscriber ?? []
          this.subscriberNumber = Object.keys(subscriber).length
          this.subscribed = Object.keys(subscriber).includes(this.userInfo.uid)
        })
    },
    subscribe() {
      if (this.subscribed) {
        db.ref(`/users/${this.userInfo.uid}/subscribe/${this.uid}`).remove()
        db.ref(`/users/${this.uid}/subscriber/${this.userInfo.uid}`).remove()

        delete this.subscription[this.userInfo.uid]
        this.subscribed = false
        this.subscriberNumber--
        this.targetUser.libris -= 10

        this.updateLibris(this.uid, -10)
      } else {
        db.ref(`/users/${this.userInfo.uid}/subscribe/${this.uid}`).set(
          this.targetUser.displayName
        )
        db.ref(`/users/${this.uid}/subscriber/${this.userInfo.uid}`).set(
          this.userInfo.displayName
        )

        this.subscription[this.userInfo.uid] = this.userInfo.displayName
        this.subscribed = true
        this.subscriberNumber++
        this.targetUser.libris += 10

        this.updateLibris(this.uid, 10)
      }
    }
  }
}
</script>

<style scoped>
.imgback {
  position: absolute;
  top: 0;
  left: 0;
}
</style>

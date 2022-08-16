<template>
  <v-tabs v-model="tab">
    <v-tab>홈</v-tab>
    <v-tab>멤버</v-tab>
    <v-tab>소통 공간</v-tab>
    <v-tab>책</v-tab>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item>
        <v-card class="transparent">
          <v-card-title class="primary--text">
            {{ team.name }}
          </v-card-title>
          <v-card-subtitle>
            {{ new Date(team.createdAt).toLocaleDateString() }} ·
            {{ team.members.length }}명
          </v-card-subtitle>
          <v-card-text>
            {{ team.description }}
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <v-card class="transparent">
          <v-card-text>
            <v-list class="transparent">
              <v-list-item
                v-for="member in team.members"
                :key="member.uid"
                :to="`/user/${member.uid}`"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="member.displayName" />
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <LazyCommentComponent
          :link="`/book/content/${time}`"
          :dbr="`/teams/${this.name}/comments`"
          :nofield="userInfo.uid"
        />
      </v-tab-item>

      <v-tab-item>
        <v-card-subtitle>{{ Math.round(team.points) }}점</v-card-subtitle>
        <LazyBookCard :items="book" :simple="true" />
      </v-tab-item>
    </v-tabs-items>
  </v-tabs>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  asyncData({ params }) {
    const name = params.name
    return {
      name
    }
  },
  data() {
    return {
      tab: 0,
      team: {},
      book: []
    }
  },
  created() {
    this.getTeams()
    this.getBookList()
  },
  methods: {
    async getTeams() {
      await db.ref(`teams/${this.name}`).once('value', snapshot => {
        this.team = snapshot.val()
      })
    },
    getBookList() {
      db.ref(`contents/`).once('value', snapshot => {
        for (let key in snapshot.val()) {
          for (let i in this.team.members) {
            this.team.members[i].uid === snapshot.val()[key].uid &&
              this.book.push(snapshot.val()[key])
          }
        }
      })
    }
  }
}
</script>

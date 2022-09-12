<template>
  <v-tabs v-model="tab" show-arrows center-active grow class="transparent">
    <v-tab>홈</v-tab>
    <v-tab>멤버</v-tab>
    <v-tab>소통 공간</v-tab>
    <v-tab>책</v-tab>

    <v-tabs-items v-model="tab" class="transparent">
      <v-tab-item>
        <v-card class="transparent">
          <v-card-title class="primary--text">{{ team.name }}</v-card-title>
          <v-card-subtitle>
            {{ new Date(team.createdAt).toLocaleDateString() }} ·
            {{ team.members.length }}명
          </v-card-subtitle>
          <v-card-text>{{ team.description }}</v-card-text>
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
                  <v-list-item-title>
                    {{ member.displayName }}
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-tab-item>

      <v-tab-item>
        <LazyCommentComponent
          :link="`/team/about/${team.name}`"
          :dbr="`/teams/${name}/comments`"
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

<script lang="ts">
import Vue from 'vue'
import { db } from '@/plugins/firebase'

export default Vue.extend({
  asyncData({ params }) {
    const name = params.name
    return {
      name
    }
  },
  data() {
    return {
      tab: 0,
      name: '',
      team: {} as any,
      book: [] as any[]
    }
  },
  async created() {
    await db
      .ref(`teams/${this.name}`)
      .once('value', (s) => (this.team = s.val()))

    db.ref('contents/').once('value', (s) => {
      for (const key in s.val()) {
        for (const i in this.team.members) {
          this.team.members[i].uid === s.val()[key].uid &&
            this.book.push(s.val()[key])
        }
      }
    })
  }
})
</script>

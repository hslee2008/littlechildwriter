<template>
  <v-card class="transparent">
    <v-card-title v-if="!noTitle">
      <span class="headline">팀 목록</span>
    </v-card-title>
    <v-card-text>
      <v-list two-line>
        <v-list-item
          v-for="(team, i) in teams"
          :key="team.id"
          :to="`/team/about/${team.name}`"
        >
          <v-list-item-avatar v-if="i < 2">
            <v-icon> mdi-{{ i === 0 ? 'alpha-i' : 'roman-numeral-2' }} </v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="primary--text">
              {{ team.name }} ({{ team.members.length }}명)
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ Math.round(team.points) }}점
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn
              v-if="
                team.manager.uid !== userInfo.uid &&
                team.members.filter(member => member.uid === userInfo.uid)
                  .length === 0 &&
                !Object.keys(team.waiting ?? {}).includes(userInfo.uid)
              "
              icon
              @click="joinWaitingList(team.name, i)"
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<script>
import { db } from '@/plugins/firebase'

export default {
  props: {
    noTitle: {
      type: Boolean
    }
  },
  data() {
    return {
      teams: []
    }
  },
  created() {
    db.ref('teams').on('child_added', s => this.teams.push(s.val()))
  },
  mounted() {
    this.teams = this.teams.sort((a, b) => b.points - a.points)
    this.$forceUpdate()
  },
  methods: {
    joinWaitingList(name, i) {
      this.teams[i].waiting = {
        ...this.teams[i].waiting,
        [this.userInfo.uid]: this.userInfo.uid
      }
      const { uid, displayName, photoURL } = this.userInfo
      const createdAt = Date.now()

      db.ref(`teams/${name}/waiting/${uid}`).set(uid)
      db.ref(`teams/${name}/notifications/${createdAt}`).set({
        type: 'join',
        uid,
        displayName,
        photoURL,
        createdAt
      })

      this.$forceUpdate()
    }
  }
}
</script>

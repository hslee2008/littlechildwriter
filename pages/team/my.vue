<template>
  <div>
    <v-card>
      <v-card-title>
        <span class="headline">내 팀 목록</span>
      </v-card-title>
      <v-card-text>
        <v-list two-line>
          <v-list-item
            v-for="(team, i) in teams.filter(
              t => t.manager.uid === userInfo.uid
            )"
            :key="team.id"
            :to="`/team/about/${team.name}`"
          >
            <v-list-item-content>
              <v-list-item-title>{{ team.name }}</v-list-item-title>
              <v-list-item-subtitle>
                <v-icon>mdi-account-group</v-icon>
                {{ team.members.length }}명
              </v-list-item-subtitle>
            </v-list-item-content>

            <div v-for="notif in team.notifications" :key="notif.createdAt">
              <v-list>
                <v-list-item>
                  <v-tooltip left>
                    <template #activator="{ on, attrs }">
                      <v-list-item-avatar v-bind="attrs" v-on="on">
                        <v-img :src="notif.photoURL" alt="avatar" />
                      </v-list-item-avatar>
                    </template>
                    <span v-text="notif.displayName" />
                  </v-tooltip>
                  <v-list-item-content>
                    <v-list-item-title>
                      {{
                        notif.type === 'join'
                          ? '새로운 팀원을 추가하겠습니다'
                          : 'unkown'
                      }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                      {{ new Date(notif.createdAt).toLocaleDateString() }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-btn
                      icon
                      color="error"
                      @click="
                        removeNotification(
                          team.name,
                          notif.createdAt,
                          notif.uid,
                          i
                        )
                      "
                    >
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      color="success"
                      @click="
                        acceptNotification(
                          team.name,
                          notif.createdAt,
                          notif.uid,
                          notif.displayName,
                          i
                        )
                      "
                    >
                      <v-icon>mdi-check</v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </div>
          </v-list-item>
        </v-list>
      </v-card-text>
    </v-card>

    <br />

    <v-btn text to="/team/teams"> 모든 팀 확인하기 </v-btn>
    <v-btn color="primary" text to="/team/new"> 팀 만들기 </v-btn>

    <br /><br />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { db } from '@/plugins/firebase'

export default Vue.extend({
  data() {
    return {
      teams: [] as any[]
    }
  },
  created() {
    this.getTeams()
  },
  methods: {
    removeNotification(
      name: string,
      createdAt: string,
      uid: string,
      i: number
    ) {
      db.ref(`teams/${name}/notifications/${createdAt}`).remove()
      db.ref(`teams/${name}/waiting/${uid}`).remove()
      delete this.teams[i].notifications[createdAt]
      this.$forceUpdate()
    },
    async acceptNotification(
      name: string,
      createdAt: string,
      uid: string,
      displayName: string,
      i: number
    ) {
      const libris = await db
        .ref(`users/${uid}/libris`)
        .once('value')
        .then(s => s.val())

      db.ref(`teams/${name}/notifications/${createdAt}`).remove()
      db.ref(`teams/${name}/waiting/${uid}`).remove()
      db.ref(`teams/${name}/members/${this.teams[i].members.length}`).set({
        uid,
        displayName
      })
      db.ref(`teams/${name}/points`).transaction(points => points + libris)
      db.ref(`users/${uid}/joined`).push(name)

      this.teams[i].members[this.teams[i].members.length] = { uid, displayName }
      delete this.teams[i].notifications[createdAt]
      this.$forceUpdate()
    },
    getTeams() {
      db.ref('teams').on('child_added', s => this.teams.push(s.val()))
    }
  }
})
</script>

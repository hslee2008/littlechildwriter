<template>
  <v-card>
    <v-card-title>
      <span class="headline">새 팀 생성</span>
    </v-card-title>
    <v-card-text>
      <v-text-field v-model="teamName" label="팀 이름" required />
      <v-textarea v-model="teamDescription" label="팀 설명" required />
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" @click="createTeam"> 생성 </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script>
// todo: to typescript
import { db } from '@/plugins/firebase'
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      teamName: '',
      teamDescription: ''
    }
  },
  methods: {
    async createTeam() {
      const libris = await db
        .ref(`users/${this.userInfo.uid}/libris`)
        .once('value')
        .then(s => s.val())

      const { uid, displayName } = this.userInfo
      db.ref(`users/${uid}/joined`).push(this.teamName)

      if (this.teamName)
        db.ref(`teams/${this.teamName.trim()}`).set({
          name: this.teamName,
          description: this.teamDescription,
          members: [{ uid, displayName }],
          manager: { uid, displayName },
          createdAt: Date.now(),
          points: libris,
          notifications: []
        })

      this.teamName = ''
      this.teamDescription = ''

      this.$router.push(`/team/about/${this.teamName}`)
    }
  }
})
</script>

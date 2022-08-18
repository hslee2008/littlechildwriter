import { auth, db } from '@/plugins/firebase'
import Vue from 'vue'

Vue.mixin({
  data: () => ({
    userInfo: {
      displayName: '',
      photoURL: '',
      uid: '',
      email: '',
      libris: 0
    }
  }),
  created() {
    auth.onAuthStateChanged(async u => {
      if (u) {
        const { displayName, photoURL, uid, email } = u

        this.userInfo = {
          ...this.userInfo,
          displayName,
          photoURL,
          email,
          uid
        }
      }
    })
  },
  methods: {
    updateLibris(uid, val) {
      db.ref(`users/${uid}/libris`).transaction(cv => cv + val)
      db.ref(`users/${uid}/joined`).once('value', async snapshot => {
        Object.values(await snapshot.val()).forEach(async team => {
          db.ref(`teams/${team}/libris`).transaction(cv => cv + val)
        })
      })
    },
    notify(uid, title, link) {
      const time = new Date().toLocaleDateString()

      db.ref(`users/${uid}/notification`).push({
        title,
        time,
        link,
        photoURL: this.userInfo.photoURL
      })
    }
  }
})

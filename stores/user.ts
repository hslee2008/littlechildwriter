import { defineStore } from 'pinia'
import { auth } from '@/plugins/firebase'

export const User = defineStore('User', {
  state: () => ({
    FBuid: '',
    FBemail: '',
    FBdisplayName: '',
    FBphotoURL: '',
    FBloggedIn: false,
  }),
  getters: {
    uid() {
      return this.FBuid
    },

    email() {
      return this.FBemail
    },

    displayName() {
      return this.FBdisplayName
    },

    photoURL() {
      return this.FBphotoURL
    },

    loggedIn() {
      return this.FBloggedIn
    },

    userInfo() {
      return {
        uid: this.FBuid,
        email: this.FBemail,
        displayName: this.FBdisplayName,
        photoURL: this.FBphotoURL,
        loggedIn: this.FBloggedIn,
      }
    },
  },
  actions: {
    setUserInfo(userInfo: any) {
      this.FBuid = userInfo.uid
      this.FBemail = userInfo.email
      this.FBdisplayName = userInfo.displayName
      this.FBphotoURL = userInfo.photoURL
      this.FBloggedIn = userInfo.loggedIn
    },

    logout() {
      auth.signOut()
      this.FBuid = ''
      this.FBemail = ''
      this.FBdisplayName = ''
      this.FBphotoURL = ''
      this.FBloggedIn = false
    },

    initUserInfo() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setUserInfo({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            loggedIn: true,
          })
        }
      })
    },
  },
})

import { defineStore } from 'pinia'
import { auth } from '@/plugins/firebase'

export const User = defineStore('User', {
  state: () => ({
    FBuid: '',
    FBemail: '',
    FBdisplayName: '',
    FBphotoURL: '',
    FBloggedIn: false
  }),
  getters: {
    uid(): string {
      return this.FBuid
    },

    email(): string {
      return this.FBemail
    },

    displayName(): string {
      return this.FBdisplayName
    },

    photoURL(): string {
      return this.FBphotoURL
    },

    loggedIn(): boolean {
      return this.FBloggedIn
    },

    userInfo(): object {
      return {
        uid: this.FBuid,
        email: this.FBemail,
        displayName: this.FBdisplayName,
        photoURL: this.FBphotoURL,
        loggedIn: this.FBloggedIn
      }
    }
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

    is(uid: string) {
      return this.FBuid === uid
    },

    initUserInfo() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.setUserInfo({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
            loggedIn: true
          })
        }
      })
    }
  }
})

import Vue from 'vue'

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}

declare module 'vue/types/vue' {
  interface Vue {
    userInfo: {
      displayName: string
      email: string
      uid: string
      photoURL: string
      libris: number
    }

    updateLibris: (uid: string, val: number) => void
    handleError: (err: any) => void
    notify: (uid: string, title: string, link: string) => void

    navigator: {
      languages: string[]
    }
  }
}

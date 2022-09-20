import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

declare module 'badwords-ko'
declare module 'leo-profanity'

declare module 'vue/types/vue' {
  interface Vue {

  BarcodeDetector: any
    navigator: {
      languages: string[]
    }
  }
}

declare global {
  interface Window {
    BarcodeDetector: any
    webkitSpeechRecognition: any
  }
}

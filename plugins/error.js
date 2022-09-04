import Vue from 'vue'

Vue.mixin({
  methods: {
    checkError(message) {
      console.log(message)

      switch (message.toString()) {
        case "Cannot read properties of undefined (reading 'thumbnail')":
          this.$toast.error('이미지를 찾을 수 없습니다. 사진을 업로드해주세요.')
          break
        case '[object SpeechRecognitionErrorEvent]':
          this.$toast.error('음성인식을 할 수 없습니다. 크롬을 사용해주세요.')
          break
        case "Cannot read properties of undefined (reading '0')":
          this.$toast.error('책을 찾을 수 없습니다.')
          break
        default:
          this.$toast.error(`알 수 없는 에러: ${message}`)
          break
      }
    }
  }
})

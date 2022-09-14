import Vue from 'vue'

Vue.mixin({
  methods: {
    handleError(message) {
      // eslint-disable-next-line no-console
      console.log(`%c[LCW Error] ${message}`, 'color: red')

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
        case 'BarcodeDetector is not supported':
          this.$toast.error(
            '바코드를 인식할 수 없습니다. 모바일에서 크롬을 사용해주세요.'
          )
          break
        case 'Firebase: This operation has been cancelled due to another conflicting popup being opened. (auth/cancelled-popup-request).':
        case 'Firebase: The popup has been closed by the user before finalizing the operation. (auth/popup-closed-by-user).':
          this.$toast('로그인 창을 닫았습니다. 다시 시도해주세요.')
          break
        case 'Firebase: The email address is badly formatted. (auth/invalid-email).':
          this.$toast.error('이메일 형식이 올바르지 않습니다.')
          break
        case 'Firebase: The password is invalid or the user does not have a password. (auth/wrong-password).':
          this.$toast.error('비밀번호가 올바르지 않습니다.')
          break
        default:
          this.$toast.error(`알 수 없는 에러: ${message}`)
          break
      }
    }
  }
})

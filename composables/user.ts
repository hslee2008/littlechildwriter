import { auth } from '../plugins/firebase'

export const User = () => {
  const userInfo = ref<UserInfo>({
    uid: '',
    email: '',
    displayName: '',
    photoURL: ''
  })
  auth.onAuthStateChanged(u =>
    u
      ? (userInfo.value = {
          uid: u.uid || '',
          email: u.email || '',
          displayName: u.displayName || '',
          photoURL: u.photoURL || ''
        })
      : (userInfo.value = {
          uid: '',
          email: '',
          displayName: '',
          photoURL: ''
        })
  )
  return userInfo
}

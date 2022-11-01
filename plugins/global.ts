import Vue from 'vue'
import { auth, db } from 'plugins/firebase'

Vue.prototype.navigator = navigator

interface UserInfo {
  uid: string
  email: string
  displayName: string
  photoURL: string
}

interface Book {
  categories: string[]
  bookmarks: string[]
  content: string
  displayName: string
  image: string
  isPublic: boolean
  isbn: string
  liked: any
  pageCount: number
  rating: number
  time: number
  title: string
  uid: string
  views: number
}

export function User() {
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

export function Notify(
  uid: string,
  photoURL: string,
  title: string,
  link: string
) {
  const time = new Date().toLocaleDateString()

  db.ref(`users/${uid}/notification`).push({
    title,
    time,
    link,
    photoURL
  })
}

const formatter = (number: number) =>
  new Intl.NumberFormat(navigator.language || 'ko-kr', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumFractionDigits: 1
  }).format(number)

export { UserInfo, Book, formatter }

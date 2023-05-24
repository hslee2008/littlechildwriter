import firebase from 'firebase/compat/app'
import { getPerformance } from 'firebase/performance'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

let app

try {
  app = firebase.initializeApp({
    apiKey: 'AIzaSyDI6kfyE4xQlPqD7Dem3OxiI9lhA4IxQ-I',
    authDomain: 'littlechildwriter.firebaseapp.com',
    projectId: 'littlechildwriter',
    storageBucket: 'littlechildwriter.appspot.com',
    messagingSenderId: '986081147205',
    appId: '1:986081147205:web:fadaee26490f1f173d662c',
    measurementId: 'G-F7Z7BLCQDQ'
  })
} catch (err) {
  firebase.app()
}

getPerformance(app)

const db = firebase.database()
const firestore = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()
const login = firebase.auth

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.$firebase = firebase
  nuxtApp.$db = db
  nuxtApp.$firestore = firestore
  nuxtApp.$auth = auth
  nuxtApp.$storage = storage
  nuxtApp.$login = login
})

export { db, firestore, auth, storage, login }

import firebase from 'firebase/compat/app'
import { getPerformance } from 'firebase/performance'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import 'firebase/compat/storage'

let app

if (!firebase.apps.length) {
  app = firebase.initializeApp({
    apiKey: "AIzaSyAaaA5iVUBHBQFS4hjtIVLW62HltaCqn0Y",
    authDomain: "littlechildwriter-database.firebaseapp.com",
    databaseURL: "https://littlechildwriter-database-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "littlechildwriter-database",
    storageBucket: "littlechildwriter-database.appspot.com",
    messagingSenderId: "402782474279",
    appId: "1:402782474279:web:bf8b27056445af1002be02",
    measurementId: "G-F7Z7BLCQDQ"
  })
  getPerformance(app)
}

const db = firebase.database()
const auth = firebase.auth()
const storage = firebase.storage()
const login = firebase.auth

export { db, auth, login, storage }

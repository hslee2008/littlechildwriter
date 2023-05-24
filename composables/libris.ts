import { db, firestore } from '../plugins/firebase'

export const Libris = (uid: string | string[], incrementBy: number) => {
  PureLibris(uid, incrementBy)
  LibrisHistory(uid, incrementBy)
}

export const PureLibris = (uid: string | string[], incrementBy: number) => {
  const currentLibris = db.ref(`users/${uid}/libris`).once('value')

  currentLibris.then(snapshot => {
    const currentLibris = snapshot.val()
    const newLibris = Math.round(currentLibris + incrementBy)
    db.ref(`users/${uid}/libris`).set(newLibris)
  })
}

export const LibrisHistory = (uid: string | string[], incrementBy: number) => {
  // format date into YYYY-MM-DD
  const time = Date.now()
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const formattedDate = `${year}-${month}-${day}`

  firestore.collection('libris').doc(`${uid}-${formattedDate}-${time}`).set({
    uid,
    date: formattedDate,
    rawDate: time,
    incrementBy
  })
}

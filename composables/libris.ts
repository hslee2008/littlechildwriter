import { db } from '../plugins/firebase'

export const Libris = (uid: string | string[], incrementBy: number) => {
  const currentLibris = db.ref(`users/${uid}/libris`).once('value')

  currentLibris.then(snapshot => {
    const currentLibris = snapshot.val()
    const newLibris = Math.round(currentLibris + incrementBy)
    db.ref(`users/${uid}/libris`).set(newLibris)
  })
}

import { db } from '../plugins/firebase'

export const Notify = (
  uid: string | string[],
  photoURL: string,
  title: string,
  link: string
) => {
  const time = new Date().toLocaleDateString()
  db.ref(`users/${uid}/notification`).push({
    title,
    time,
    link,
    photoURL,
  })
}

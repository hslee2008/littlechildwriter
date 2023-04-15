import { db } from '../plugins/firebase'

export const Libris = (uid: string | string[], incrementBy: number) =>
  db.ref(`users/${uid}/libris`).transaction(v => v + incrementBy)

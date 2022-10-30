import { db } from '@/plugins/firebase'

export const Libris = async (uid: string, incrementBy: number) =>
  (await db.ref(`users/${uid}/libris`)).transaction(v => v + incrementBy)
/* eslint-disable @typescript-eslint/no-var-requires */
export async function getRoutes() {
  const admin = require('firebase-admin')
  const serviceAccount = require('./onlyreadaccess.json')

  const routes = [] as string[]

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://littlechildwriter-default-rtdb.firebaseio.com'
  })

  const db = admin.database()

  const books = (await db.ref('contents').once('value')).val()
  const classes = (await db.ref('classes').once('value')).val()
  const teams = (await db.ref('teams').once('value')).val()
  const users = (await db.ref('users').once('value')).val()
  const debate = (await db.ref('debate').once('value')).val()
  const blog = (await db.ref('blog').once('value')).val()

  for (const r in books) routes.push(`/book/content/${r}`)
  for (const r in classes) routes.push(`/class/${r}`)
  for (const r in teams) routes.push(`/team/about/${r}`)
  for (const r in users) routes.push(`/user/${r}`)
  for (const r in debate) routes.push(`/debate/topic/${r}`)
  for (const r in blog) routes.push(`/blog/content/${r}`)

  return routes
}

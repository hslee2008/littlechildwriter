import { User } from '../stores/user'

export default defineNuxtRouteMiddleware((to, _) => {
  const userInfo = User()

  if (userInfo.loggedIn === true) {
    return navigateTo(to)
  }
})

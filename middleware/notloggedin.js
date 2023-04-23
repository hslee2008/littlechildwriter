import { User } from '../stores/user'

export default defineNuxtRouteMiddleware((_, __) => {
  const userInfo = User()

  if (userInfo.loggedIn === false) {
    return navigateTo('/account/login')
  }
})

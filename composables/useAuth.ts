import { onMounted } from 'vue'

export const useAuth = (mounted: Function) => {
  const { $auth } = useNuxtApp()

  onMounted(() => {
    $auth.onAuthStateChanged((user: object) => {
      if (!user) return

      mounted(user)
    })
  })
}

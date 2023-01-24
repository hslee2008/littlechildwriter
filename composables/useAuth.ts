import { onMounted } from 'vue'

export const useAuth = (mounted) => {
  const { $auth } = useNuxtApp()

  onMounted(() => {
    $auth.onAuthStateChanged((user) => {
      if (!user) return

      mounted(user)
    })
  })
}

import { useTheme } from 'vuetify'

export const isDark = () => {
  const theme = useTheme()
  return theme.global.current.value.dark
}

export const themeColor = () => {
  return isDark() ? '#23262E' : 'white'
}

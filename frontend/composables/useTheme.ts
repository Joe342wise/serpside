export const useTheme = () => {
  const theme = ref('dark')

  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  watch(theme, (val) => {
    document.documentElement.setAttribute('data-theme', val)
    localStorage.setItem('serpside-theme', val)
  })

  onMounted(() => {
    const saved = localStorage.getItem('serpside-theme')
    if (saved) {
      theme.value = saved
    } else {
      theme.value = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
    }
    document.documentElement.setAttribute('data-theme', theme.value)
  })

  return { theme, toggle }
}

import { ref } from 'vue'

type Theme = 'light' | 'dark' | 'system'

const theme = ref<Theme>((localStorage.getItem('theme') as Theme) || 'dark')

function applyTheme(t: Theme) {
  const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', isDark)
}

applyTheme(theme.value)

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (theme.value === 'system') applyTheme('system')
})

export function useTheme() {
  function setTheme(t: Theme) {
    theme.value = t
    localStorage.setItem('theme', t)
    applyTheme(t)
  }

  return { theme, setTheme }
}

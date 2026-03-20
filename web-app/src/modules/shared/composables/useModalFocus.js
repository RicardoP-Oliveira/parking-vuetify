import { nextTick } from "vue"

export function useModalFocus(buttonRef) {
  const setFocus = (forceButton = false) => {
    nextTick(() => {
      setTimeout(() => {
        const activeEl = document.activeElement
        const isInputFocused = ['INPUT', 'SELECT', 'TEXTAREA'].includes(activeEl?.tagName)

        if (isInputFocused && !forceButton) return

        const button = buttonRef.value?.$el || buttonRef.value
        if (button?.focus) {
          button.focus()
        }
      }, 300);
    })
  }
  return { setFocus }
}
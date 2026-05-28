import { useEffect } from 'react'

export const useEscapeKey = (handler, active = true) => {
  useEffect(() => {
    if (!active) return
    const onKey = (e) => {
      if (e.key === 'Escape') handler?.()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handler, active])
}

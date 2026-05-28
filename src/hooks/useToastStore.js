import { create } from 'zustand'

let nextId = 0
const DEFAULT_DURATION = 3500

export const useToastStore = create((set, get) => ({
  items: [],

  add: ({ message, type = 'info', duration = DEFAULT_DURATION }) => {
    const id = ++nextId
    set((s) => ({ items: [...s.items, { id, message, type }] }))
    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration)
    }
    return id
  },

  dismiss: (id) =>
    set((s) => ({ items: s.items.filter((t) => t.id !== id) })),
}))

export const toast = {
  success: (message) => useToastStore.getState().add({ message, type: 'success' }),
  error: (message) => useToastStore.getState().add({ message, type: 'error' }),
  info: (message) => useToastStore.getState().add({ message, type: 'info' }),
}

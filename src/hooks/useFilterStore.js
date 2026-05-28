import { create } from 'zustand'

export const useFilterStore = create((set) => ({
  // Shared
  searchQuery: '',

  // Scripts page
  gameFilter: 'all',
  keyFilter: 'all', // 'all' | 'nokey' | 'haskey'

  // Hubs page
  hubStatusFilter: 'all', // 'all' | 'online' | 'updating' | 'offline'

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setGameFilter: (gameFilter) => set({ gameFilter }),
  setKeyFilter: (keyFilter) => set({ keyFilter }),
  setHubStatusFilter: (hubStatusFilter) => set({ hubStatusFilter }),
  resetFilters: () =>
    set({
      searchQuery: '',
      gameFilter: 'all',
      keyFilter: 'all',
      hubStatusFilter: 'all',
    }),
}))

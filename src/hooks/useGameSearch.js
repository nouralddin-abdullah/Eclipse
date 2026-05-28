import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { searchGamesWithIcons } from '../lib/roblox'

/**
 * Debounced Roblox game search hook.
 * Queries the Roblox omni-search API with a 400ms debounce
 * and fetches game icons in parallel.
 */
export const useGameSearch = (enabled = true) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedTerm, setDebouncedTerm] = useState('')

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm)
    }, 400)
    return () => clearTimeout(timer)
  }, [searchTerm])

  const query = useQuery({
    queryKey: ['roblox-game-search', debouncedTerm],
    queryFn: () => searchGamesWithIcons(debouncedTerm),
    enabled: enabled && debouncedTerm.length >= 2,
    staleTime: 60 * 1000, // Cache search results for 1 minute
    gcTime: 5 * 60 * 1000,
  })

  return {
    searchTerm,
    setSearchTerm,
    results: query.data || [],
    isSearching: query.isFetching,
    isError: query.isError,
  }
}

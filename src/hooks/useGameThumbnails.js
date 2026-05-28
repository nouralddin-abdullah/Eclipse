import { useQuery } from '@tanstack/react-query'
import { fetchGameThumbnails, fetchGameIcons } from '../lib/roblox'
import gamesData from '../data/games.json'

/**
 * Hook that loads the games registry and fetches both
 * wide thumbnails (for cards) and square icons (for tags)
 * from the Roblox thumbnails API.
 *
 * Returns a Map<gameName, { universeId, thumbnailUrl, iconUrl }>.
 */
export const useGameThumbnails = () => {
  return useQuery({
    queryKey: ['game-thumbnails'],
    queryFn: async () => {
      const universeIds = gamesData
        .map((g) => g.universeId)
        .filter(Boolean)

      // Fetch both thumbnails and icons in parallel
      const [thumbnailMap, iconMap] = await Promise.all([
        fetchGameThumbnails(universeIds),
        fetchGameIcons(universeIds),
      ])

      // Build a name → data map for easy lookup
      const gameMap = new Map()
      for (const game of gamesData) {
        gameMap.set(game.name, {
          universeId: game.universeId,
          thumbnailUrl: game.universeId
            ? thumbnailMap.get(game.universeId) || null
            : null,
          iconUrl: game.universeId
            ? iconMap.get(game.universeId) || null
            : null,
        })
      }

      return gameMap
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { fetchGameIcons, fetchGameThumbnails } from '../lib/roblox'

/**
 * Fetch icon + wide thumbnail for a single Roblox universeId.
 * Preferred over useGameThumbnails for any view that already knows the
 * gameId (e.g. script detail / cards). Avoids the brittle name match
 * against the static games.json registry.
 */
export const useGameAssets = (gameId) => {
  const id = gameId ? String(gameId) : null
  return useQuery({
    queryKey: ['game-assets', id],
    enabled: !!id,
    queryFn: async () => {
      const [icons, thumbnails] = await Promise.all([
        fetchGameIcons([id]),
        fetchGameThumbnails([id]),
      ])
      const numericId = Number(id)
      return {
        iconUrl: icons.get(numericId) || null,
        thumbnailUrl: thumbnails.get(numericId) || null,
      }
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

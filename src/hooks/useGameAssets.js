import { useQuery } from '@tanstack/react-query'
import { fetchGameIcons, fetchGameThumbnails } from '../lib/roblox'

/**
 * Fetch icon + wide thumbnail for a single Roblox universeId.
 * Used by views that know the gameId (e.g. script detail).
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

/**
 * Batch variant — fetches icons + thumbnails for many universeIds in
 * one round-trip and returns a Map<gameId(number), { iconUrl, thumbnailUrl }>.
 * Used by listing pages (Scripts, Profile, HubDetail).
 */
export const useGameAssetsBatch = (gameIds = []) => {
  // De-dupe + stable string key so identical id-sets share a cache entry.
  const uniqueIds = Array.from(
    new Set(gameIds.filter(Boolean).map((id) => String(id)))
  ).sort()
  const cacheKey = uniqueIds.join(',')

  return useQuery({
    queryKey: ['game-assets-batch', cacheKey],
    enabled: uniqueIds.length > 0,
    queryFn: async () => {
      const [icons, thumbnails] = await Promise.all([
        fetchGameIcons(uniqueIds),
        fetchGameThumbnails(uniqueIds),
      ])
      const map = new Map()
      for (const id of uniqueIds) {
        const numericId = Number(id)
        map.set(numericId, {
          iconUrl: icons.get(numericId) || null,
          thumbnailUrl: thumbnails.get(numericId) || null,
        })
      }
      return map
    },
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
  })
}

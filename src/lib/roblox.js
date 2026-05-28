/**
 * Roblox API integration for game search and thumbnails.
 *
 * Uses Roblox's omni-search for game lookup and the thumbnails API
 * for game icons. Requests are proxied through Vite dev server
 * to avoid CORS issues.
 *
 * Production: These proxy paths (/roblox-api, /roblox-thumbnails)
 * must be handled by your backend/reverse proxy (e.g., Nginx, Cloudflare Workers).
 */

import axios from 'axios'

const searchClient = axios.create({
  baseURL: '/roblox-api',
  timeout: 8000,
})

const thumbnailClient = axios.create({
  baseURL: '/roblox-thumbnails',
  timeout: 8000,
})

/**
 * Search Roblox games by name using the omni-search endpoint.
 * Returns an array of game objects with universeId, name, playerCount, etc.
 */
export const searchRobloxGames = async (query) => {
  if (!query || query.trim().length < 2) return []

  try {
    const { data } = await searchClient.get('/search-api/omni-search', {
      params: {
        searchQuery: query.trim(),
        pageToken: '',
        sessionId: crypto.randomUUID(),
        pageType: 'all',
      },
    })

    // Extract game results from the nested structure
    const games = []
    for (const group of data.searchResults || []) {
      if (group.contentGroupType === 'Game') {
        for (const game of group.contents || []) {
          if (game.contentType === 'Game') {
            games.push({
              universeId: game.universeId,
              name: game.name,
              placeId: game.rootPlaceId,
              playerCount: game.playerCount || 0,
              upVotes: game.totalUpVotes || 0,
              downVotes: game.totalDownVotes || 0,
              iconUrl: null, // Fetched separately via thumbnails API
            })
          }
        }
      }
    }

    return games
  } catch (error) {
    console.error('Roblox game search failed:', error.message)
    return []
  }
}

/**
 * Fetch game icon URLs for one or more universe IDs.
 * Accepts a single ID or an array. Returns a Map<universeId, iconUrl>.
 */
export const fetchGameIcons = async (universeIds) => {
  const ids = Array.isArray(universeIds) ? universeIds : [universeIds]
  if (ids.length === 0) return new Map()

  try {
    const { data } = await thumbnailClient.get('/v1/games/icons', {
      params: {
        universeIds: ids.join(','),
        returnPolicy: 'PlaceHolder',
        size: '150x150',
        format: 'Png',
        isCircular: false,
      },
    })

    const iconMap = new Map()
    for (const item of data.data || []) {
      if (item.state === 'Completed' && item.imageUrl) {
        iconMap.set(item.targetId, item.imageUrl)
      }
    }

    return iconMap
  } catch (error) {
    console.error('Roblox thumbnail fetch failed:', error.message)
    return new Map()
  }
}

/**
 * Search games AND fetch their icons in one call.
 * Returns games with iconUrl populated.
 */
export const searchGamesWithIcons = async (query) => {
  const games = await searchRobloxGames(query)
  if (games.length === 0) return []

  const universeIds = games.map((g) => g.universeId)
  const icons = await fetchGameIcons(universeIds)

  return games.map((game) => ({
    ...game,
    iconUrl: icons.get(game.universeId) || null,
  }))
}

/**
 * Fetch wide game thumbnail URLs for one or more universe IDs.
 * Returns a Map<universeId, thumbnailUrl>.
 * These are the promotional images (768x432) shown on Roblox discover.
 */
export const fetchGameThumbnails = async (universeIds) => {
  const ids = Array.isArray(universeIds) ? universeIds : [universeIds]
  const validIds = ids.filter(Boolean)
  if (validIds.length === 0) return new Map()

  try {
    const { data } = await thumbnailClient.get(
      '/v1/games/multiget/thumbnails',
      {
        params: {
          universeIds: validIds.join(','),
          countPerUniverse: 1,
          defaults: true,
          size: '768x432',
          format: 'Png',
          isCircular: false,
        },
      }
    )

    const thumbnailMap = new Map()
    for (const item of data.data || []) {
      const thumb = item.thumbnails?.[0]
      if (thumb?.state === 'Completed' && thumb?.imageUrl) {
        thumbnailMap.set(item.universeId, thumb.imageUrl)
      }
    }

    return thumbnailMap
  } catch (error) {
    console.error('Roblox game thumbnails fetch failed:', error.message)
    return new Map()
  }
}

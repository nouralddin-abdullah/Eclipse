import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchScripts,
  fetchScriptById,
  createScript,
  updateScript,
  deleteScript,
  incrementScriptView,
  reactToScript,
  saveScript,
} from '../lib/api'
import { useAuthStore } from './useAuthStore'

const scriptsKey = (params = {}) => ['scripts', params]

// Returns the items array — back-compat for callers that just need the list
export const useScripts = (params = {}, options = {}) =>
  useQuery({
    queryKey: scriptsKey(params),
    queryFn: () => fetchScripts(params),
    select: (r) => r.items ?? [],
    placeholderData: (prev) => prev,
    ...options,
  })

// Returns the full envelope { items, total, page, limit, hasMore } for paginated UI
export const useScriptsPaged = (params = {}, options = {}) =>
  useQuery({
    queryKey: scriptsKey(params),
    queryFn: () => fetchScripts(params),
    placeholderData: (prev) => prev,
    ...options,
  })

export const useScript = (id) =>
  useQuery({
    queryKey: ['scripts', id],
    queryFn: () => fetchScriptById(id),
    enabled: !!id,
  })

export const useCreateScript = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createScript,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scripts'] }),
  })
}

export const useUpdateScript = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateScript(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['scripts'] })
      qc.invalidateQueries({ queryKey: ['scripts', id] })
    },
  })
}

export const useDeleteScript = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteScript,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['scripts'] }),
  })
}

export const useIncrementScriptView = () =>
  useMutation({ mutationFn: incrementScriptView })

const patchScriptInList = (cache, id, patch) => {
  if (!cache?.items) return cache
  const idx = cache.items.findIndex((s) => s.id === id)
  if (idx === -1) return cache
  const items = [...cache.items]
  items[idx] = { ...items[idx], ...patch }
  return { ...cache, items }
}

export const useReactToScript = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, type }) => reactToScript(id, type),
    onSuccess: (data, { id }) => {
      const patch = {
        likes: data.likes,
        dislikes: data.dislikes,
        userReaction: data.userReaction,
      }
      qc.setQueryData(['scripts', id], (old) => (old ? { ...old, ...patch } : old))
      qc.setQueriesData({ queryKey: ['scripts'] }, (old) =>
        patchScriptInList(old, id, patch)
      )
    },
  })
}

export const useSaveScript = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: saveScript,
    onSuccess: (data, scriptId) => {
      const { savedScripts, setSavedScripts } = useAuthStore.getState()
      const next = data.saved
        ? Array.from(new Set([...savedScripts, scriptId]))
        : savedScripts.filter((id) => id !== scriptId)
      setSavedScripts(next)

      qc.setQueryData(['scripts', scriptId], (old) =>
        old ? { ...old, isSaved: data.saved } : old
      )
      qc.setQueriesData({ queryKey: ['scripts'] }, (old) =>
        patchScriptInList(old, scriptId, { isSaved: data.saved })
      )
    },
  })
}

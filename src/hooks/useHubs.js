import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchHubs,
  fetchHubById,
  createHub,
  updateHub,
  deleteHub,
  followHub,
} from '../lib/api'
import { useAuthStore } from './useAuthStore'

const hubsKey = (params = {}) => ['hubs', params]

export const useHubs = (params = {}, options = {}) =>
  useQuery({
    queryKey: hubsKey(params),
    queryFn: () => fetchHubs(params),
    select: (r) => r.items ?? [],
    placeholderData: (prev) => prev,
    ...options,
  })

export const useHubsPaged = (params = {}, options = {}) =>
  useQuery({
    queryKey: hubsKey(params),
    queryFn: () => fetchHubs(params),
    placeholderData: (prev) => prev,
    ...options,
  })

export const useHub = (id) =>
  useQuery({
    queryKey: ['hubs', id],
    queryFn: () => fetchHubById(id),
    enabled: !!id,
  })

export const useCreateHub = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createHub,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hubs'] }),
  })
}

export const useUpdateHub = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateHub(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['hubs'] })
      qc.invalidateQueries({ queryKey: ['hubs', id] })
    },
  })
}

export const useDeleteHub = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteHub,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['hubs'] }),
  })
}

const patchHubInList = (cache, id, patch) => {
  if (!cache?.items) return cache
  const idx = cache.items.findIndex((h) => h.id === id)
  if (idx === -1) return cache
  const items = [...cache.items]
  items[idx] = { ...items[idx], ...patch }
  return { ...cache, items }
}

export const useFollowHub = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: followHub,
    onSuccess: (data, hubId) => {
      const { followedHubs, setFollowedHubs } = useAuthStore.getState()
      const next = data.following
        ? Array.from(new Set([...followedHubs, hubId]))
        : followedHubs.filter((id) => id !== hubId)
      setFollowedHubs(next)

      qc.setQueriesData({ queryKey: ['hubs'] }, (old) =>
        patchHubInList(old, hubId, { followers: data.followers })
      )
      qc.setQueryData(['hubs', hubId], (old) =>
        old ? { ...old, followers: data.followers } : old
      )
    },
  })
}

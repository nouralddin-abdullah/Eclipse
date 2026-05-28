import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../lib/api'
import { useAuthStore } from './useAuthStore'

const notificationsKey = (params = {}) => ['notifications', params]

export const useNotifications = (params = {}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: notificationsKey(params),
    queryFn: () => fetchNotifications(params),
    enabled: isAuthenticated,
    select: (r) => r.items ?? [],
    placeholderData: (prev) => prev,
  })
}

export const useNotificationsPaged = (params = {}) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: notificationsKey(params),
    queryFn: () => fetchNotifications(params),
    enabled: isAuthenticated,
    placeholderData: (prev) => prev,
  })
}

const patchNotificationInCache = (cache, id, patch) => {
  if (!cache?.items) return cache
  const items = cache.items.map((n) => (n.id === id ? { ...n, ...patch } : n))
  return { ...cache, items }
}

const recomputeUnread = (qc) => {
  // Recompute from the cache of any notifications query
  const queries = qc.getQueriesData({ queryKey: ['notifications'] })
  for (const [, value] of queries) {
    if (value?.items) {
      const unread = value.items.filter((n) => !n.read).length
      useAuthStore.getState().setUnreadCount(unread)
      return
    }
  }
}

export const useMarkNotificationRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_data, id) => {
      qc.setQueriesData({ queryKey: ['notifications'] }, (old) =>
        patchNotificationInCache(old, id, { read: true })
      )
      recomputeUnread(qc)
    },
  })
}

export const useMarkAllNotificationsRead = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      qc.setQueriesData({ queryKey: ['notifications'] }, (old) => {
        if (!old?.items) return old
        return {
          ...old,
          items: old.items.map((n) => ({ ...n, read: true })),
          unread: 0,
        }
      })
      useAuthStore.getState().setUnreadCount(0)
    },
  })
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchShowcases,
  fetchShowcaseById,
  createShowcase,
  updateShowcase,
  deleteShowcase,
} from '../lib/api'

const showcasesKey = (params = {}) => ['showcases', params]

export const useShowcases = (params = {}, options = {}) =>
  useQuery({
    queryKey: showcasesKey(params),
    queryFn: () => fetchShowcases(params),
    select: (r) => r.items ?? [],
    placeholderData: (prev) => prev,
    ...options,
  })

export const useShowcasesPaged = (params = {}, options = {}) =>
  useQuery({
    queryKey: showcasesKey(params),
    queryFn: () => fetchShowcases(params),
    placeholderData: (prev) => prev,
    ...options,
  })

export const useShowcase = (id) =>
  useQuery({
    queryKey: ['showcases', id],
    queryFn: () => fetchShowcaseById(id),
    enabled: !!id,
  })

export const useCreateShowcase = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createShowcase,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['showcases'] }),
  })
}

export const useUpdateShowcase = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => updateShowcase(id, data),
    onSuccess: (_data, { id }) => {
      qc.invalidateQueries({ queryKey: ['showcases'] })
      qc.invalidateQueries({ queryKey: ['showcases', id] })
    },
  })
}

export const useDeleteShowcase = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteShowcase,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['showcases'] }),
  })
}

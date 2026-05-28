import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  fetchComments,
  createComment,
  deleteComment,
  reactToComment,
} from '../lib/api'

export const useComments = (scriptId, params = {}) =>
  useQuery({
    queryKey: ['comments', scriptId, params],
    queryFn: () => fetchComments(scriptId, params),
    enabled: !!scriptId,
    select: (r) => r.items ?? [],
  })

export const useCreateComment = (scriptId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ text, parentId } = {}) =>
      createComment(scriptId, { text, parentId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', scriptId] }),
  })
}

export const useDeleteComment = (scriptId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', scriptId] }),
  })
}

export const useReactToComment = (scriptId) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, type }) => reactToComment(id, type),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['comments', scriptId] }),
  })
}

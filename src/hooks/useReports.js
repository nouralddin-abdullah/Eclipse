import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReport, fetchReports, resolveReport } from '../lib/api'
import { useAuthStore } from './useAuthStore'

export const useReports = ({ status = 'open', type, page = 1, limit = 25 } = {}) => {
  const isAdmin = useAuthStore((s) => s.isAdmin())
  return useQuery({
    queryKey: ['reports', { status, type, page, limit }],
    queryFn: () => fetchReports({ status, type, page, limit }),
    enabled: isAdmin,
    keepPreviousData: true,
  })
}

export const useCreateReport = () =>
  useMutation({ mutationFn: createReport })

export const useResolveReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status, resolutionNote }) =>
      resolveReport(id, { status, resolutionNote }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })
}

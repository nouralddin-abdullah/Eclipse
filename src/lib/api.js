import api, { apiOrigin } from './axios'

const unwrap = (p) => p.then((r) => r.data)

// ─── Auth ───

export const fetchMe = () => unwrap(api.get('/auth/me'))
export const patchMe = (data) => unwrap(api.patch('/auth/me', data))
export const completeOnboarding = (data) =>
  unwrap(api.post('/auth/onboarding', data))
export const deleteMe = () => unwrap(api.delete('/auth/me'))
export const exportMyData = () =>
  api.get('/auth/me/export', { responseType: 'blob' }).then((r) => r.data)

export const googleLoginUrl = () => `${apiOrigin}/api/auth/google`

// ─── Hubs ───
// fetchHubs accepts { page, limit, q, sort, order, status } and returns
// { items, total, page, limit, hasMore }.
export const fetchHubs = (params = {}) =>
  unwrap(api.get('/hubs', { params }))
export const fetchHubById = (id) => unwrap(api.get(`/hubs/${id}`))
export const createHub = (data) => unwrap(api.post('/hubs', data))
export const updateHub = (id, data) => unwrap(api.patch(`/hubs/${id}`, data))
export const deleteHub = (id) => unwrap(api.delete(`/hubs/${id}`))
export const followHub = (id) => unwrap(api.post(`/hubs/${id}/follow`))

// ─── Scripts ───
// fetchScripts accepts { page, limit, q, sort, order, hubId, game } and
// returns { items, total, page, limit, hasMore }.
export const fetchScripts = (params = {}) =>
  unwrap(api.get('/scripts', { params }))
export const fetchScriptById = (id) => unwrap(api.get(`/scripts/${id}`))
export const createScript = (data) => unwrap(api.post('/scripts', data))
export const updateScript = (id, data) =>
  unwrap(api.patch(`/scripts/${id}`, data))
export const deleteScript = (id) => unwrap(api.delete(`/scripts/${id}`))
export const incrementScriptView = (id) =>
  unwrap(api.post(`/scripts/${id}/view`))
export const reactToScript = (id, type) =>
  unwrap(api.post(`/scripts/${id}/reaction`, { type }))
export const saveScript = (id) => unwrap(api.post(`/scripts/${id}/save`))

// ─── Showcases ───
// fetchShowcases accepts { page, limit, q, sort, order, hubId } and returns
// { items, total, page, limit, hasMore }.
export const fetchShowcases = (params = {}) =>
  unwrap(api.get('/showcases', { params }))
export const fetchShowcaseById = (id) => unwrap(api.get(`/showcases/${id}`))
export const createShowcase = (data) => unwrap(api.post('/showcases', data))
export const updateShowcase = (id, data) =>
  unwrap(api.patch(`/showcases/${id}`, data))
export const deleteShowcase = (id) => unwrap(api.delete(`/showcases/${id}`))

// ─── Comments ───
// fetchComments accepts (scriptId, { page, limit, sort, order }) and returns
// { items, total, page, limit, hasMore }.
export const fetchComments = (scriptId, params = {}) =>
  unwrap(api.get(`/scripts/${scriptId}/comments`, { params }))
export const createComment = (scriptId, { text, parentId } = {}) =>
  unwrap(api.post(`/scripts/${scriptId}/comments`, { text, parentId }))
export const deleteComment = (id) => unwrap(api.delete(`/comments/${id}`))
export const reactToComment = (id, type) =>
  unwrap(api.post(`/comments/${id}/reaction`, { type }))

// ─── Reports ───
// targetType: 'script' | 'comment' | 'hub' | 'user'
// reason:     'spam' | 'harassment' | 'inappropriate' | 'malicious_code' | 'copyright' | 'other'

export const createReport = ({ targetType, targetId, reason, details } = {}) =>
  unwrap(api.post('/reports', { targetType, targetId, reason, details }))

export const fetchReports = ({ status = 'open', type, page = 1, limit = 25 } = {}) =>
  unwrap(
    api.get('/reports', {
      params: { status, ...(type && { type }), page, limit },
    })
  )

export const resolveReport = (id, { status, resolutionNote } = {}) =>
  unwrap(api.patch(`/reports/${id}`, { status, resolutionNote }))

// ─── Notifications ───
// fetchNotifications accepts { page, limit } and returns
// { items, total, page, limit, hasMore, unread }.
export const fetchNotifications = (params = {}) =>
  unwrap(api.get('/notifications', { params }))
export const markNotificationRead = (id) =>
  unwrap(api.post(`/notifications/${id}/read`))
export const markAllNotificationsRead = () =>
  unwrap(api.post('/notifications/read-all'))

// ─── Upload ───
// Accepts either { file: File } (multipart) or { url: string } (server-side fetch).
// Optional folder pins the R2 prefix ('hubs' | 'scripts' | 'showcases' | 'avatars' | 'misc').
// Returns { key, url } where key is the R2 object key and url is the public URL.
export const uploadImage = async ({ file, url, folder } = {}) => {
  if (file) {
    const form = new FormData()
    form.append('file', file)
    if (folder) form.append('folder', folder)
    return unwrap(
      api.post('/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
    )
  }
  if (url) return unwrap(api.post('/upload', { url, ...(folder && { folder }) }))
  throw new Error('uploadImage requires either { file } or { url }')
}

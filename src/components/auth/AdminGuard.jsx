import { Navigate, Outlet } from 'react-router'
import { useAuthStore } from '../../hooks/useAuthStore'

/**
 * Route guard that restricts access to admin/moderator users.
 * Wrap admin routes with this component in the router config.
 *
 * - Not authenticated → redirect to /
 * - Authenticated but not admin/moderator → redirect to /
 * - Admin/moderator → render child routes via <Outlet />
 */
export default function AdminGuard() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const isAdmin = useAuthStore((s) => s.isAdmin)

  if (!isAuthenticated) return <Navigate to="/" replace />
  if (!isAdmin()) return <Navigate to="/" replace />

  return <Outlet />
}

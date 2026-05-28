import { Suspense, useState } from 'react'
import { Outlet } from 'react-router'
import { Loader2 } from 'lucide-react'
import { useAuthStore } from '../../hooks/useAuthStore'
import DashboardSidebar from './DashboardSidebar'

const LoadingFallback = () => (
  <div className="flex items-center justify-center h-64">
    <Loader2 className="w-6 h-6 animate-spin text-muted" />
  </div>
)

const DashboardLayout = () => {
  const user = useAuthStore((s) => s.user)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-ground flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 md:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-ground/80 backdrop-blur-md border-b border-edge h-14 flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-sm hover:bg-surface text-muted"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            </button>
            <h1 className="text-sm font-semibold text-foreground">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              ← Back to site
            </a>
            {user && (
              <span className="text-xs text-muted">
                {user.nickname || user.name}
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout

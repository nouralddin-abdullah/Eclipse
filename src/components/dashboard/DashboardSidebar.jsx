import { NavLink } from 'react-router'
import { LayoutDashboard, Box, Code2, Play, Flag, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview', end: true },
  { to: '/dashboard/hubs', icon: Box, label: 'Hubs' },
  { to: '/dashboard/scripts', icon: Code2, label: 'Scripts' },
  { to: '/dashboard/showcases', icon: Play, label: 'Showcases' },
  { to: '/dashboard/reports', icon: Flag, label: 'Reports' },
]

const DashboardSidebar = ({ open, onClose }) => {
  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-medium transition-colors ${
      isActive
        ? 'bg-white/10 text-foreground'
        : 'text-muted hover:text-foreground hover:bg-white/5'
    }`

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-60 bg-surface border-r border-edge flex flex-col transition-transform duration-200 md:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-edge shrink-0">
        <div className="flex items-center gap-2.5">
          <img
            src="/eclipse-logo.png"
            alt="Eclipse"
            className="h-6 w-auto"
          />
          <span className="text-sm font-bold tracking-wider text-foreground">
            ECLIPSE
          </span>
        </div>
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-sm hover:bg-white/10 text-muted"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={linkClasses}
            onClick={onClose}
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-edge">
        <p className="text-[11px] text-muted/60">Eclipse Admin v1.0</p>
      </div>
    </aside>
  )
}

export default DashboardSidebar

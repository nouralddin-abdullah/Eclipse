import { NavLink } from 'react-router'
import { Home, Play, Box, Code2 } from 'lucide-react'
import { SiDiscord } from '../ui/BrandIcons'

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/showcases', label: 'Showcases', icon: Play },
  { to: '/hubs', label: 'Hubs', icon: Box },
  { to: '/scripts', label: 'Scripts', icon: Code2 },
]

/**
 * Fixed bottom navigation bar for mobile screens.
 * Shows icon + label for each nav item with active state highlighting.
 */
const MobileNav = () => {
  return (
    <nav
      id="mobile-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-ground/95 backdrop-blur-md border-t border-edge"
    >
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 rounded-md transition-colors duration-200 ${
                isActive
                  ? 'text-foreground'
                  : 'text-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors duration-200 ${
                    isActive ? 'bg-white/10' : ''
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
                </div>
                <span className="text-[10px] font-medium leading-tight">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* Discord — external link */}
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center justify-center gap-0.5 flex-1 py-1.5 text-muted"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-lg">
            <SiDiscord size={20} />
          </div>
          <span className="text-[10px] font-medium leading-tight">Discord</span>
        </a>
      </div>

      {/* Safe area padding for iOS */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  )
}

export default MobileNav

import { Link, NavLink } from 'react-router'
import { SiDiscord } from '../ui/BrandIcons'
import AuthButton from '../auth/AuthButton'
import NotificationBell from '../NotificationBell'

const navLinks = [
  { to: '/showcases', label: 'Showcases' },
  { to: '/hubs', label: 'Hubs' },
  { to: '/scripts', label: 'Scripts' },
]

const Navbar = () => {
  const linkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors duration-200 ${
      isActive ? 'text-foreground' : 'text-muted hover:text-foreground'
    }`

  return (
    <header
      id="navbar"
      className="fixed top-0 left-0 right-0 z-50 bg-ground/80 backdrop-blur-md border-b border-edge"
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img
            src="/eclipse-logo.png"
            alt="Eclipse"
            className="h-8 w-auto"
          />
          <span className="text-lg font-bold tracking-wider text-foreground">
            ECLIPSE
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={linkClasses}
            >
              {link.label}
            </NavLink>
          ))}
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-foreground transition-colors duration-200"
          >
            <SiDiscord size={16} />
            Discord
          </a>
        </div>

        {/* Right — Notifications + Auth */}
        <div className="flex items-center gap-2">
          <NotificationBell />
          <AuthButton />
        </div>
      </nav>
    </header>
  )
}

export default Navbar

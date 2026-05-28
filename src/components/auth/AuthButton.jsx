import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { User as UserIcon, LogOut, Bookmark, Settings } from 'lucide-react'
import { useAuthStore } from '../../hooks/useAuthStore'

/**
 * Auth button — shows "Sign in" or user avatar with dropdown menu.
 */
const AuthButton = () => {
  const { user, isAuthenticated, signIn, signOut } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const navigate = useNavigate()

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isAuthenticated) {
    return (
      <button
        onClick={signIn}
        className="flex items-center gap-2 text-sm font-medium bg-white text-black px-4 py-2 rounded-sm hover:bg-white/90 transition-all duration-200"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in
      </button>
    )
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent hover:border-edge-hover transition-all duration-200"
      >
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-surface flex items-center justify-center">
            <UserIcon size={16} className="text-muted" />
          </div>
        )}
      </button>

      {/* Dropdown */}
      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-edge rounded-md shadow-lg z-50 overflow-hidden">
          {/* User info */}
          <div className="px-4 py-3 border-b border-edge">
            <p className="text-sm font-semibold text-foreground truncate">
              {user.nickname || user.name}
            </p>
            <p className="text-xs text-muted truncate">
              @{user.username || user.email?.split('@')[0]}
            </p>
          </div>

          {/* Menu items */}
          <div className="py-1">
            <button
              onClick={() => {
                navigate('/profile')
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-ground transition-colors duration-200"
            >
              <Settings size={15} />
              Profile
            </button>
            <button
              onClick={() => {
                navigate('/profile?tab=saved')
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-muted hover:text-foreground hover:bg-ground transition-colors duration-200"
            >
              <Bookmark size={15} />
              Saved Scripts
            </button>
          </div>

          {/* Sign out */}
          <div className="border-t border-edge py-1">
            <button
              onClick={() => {
                signOut()
                setMenuOpen(false)
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-ground transition-colors duration-200"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default AuthButton

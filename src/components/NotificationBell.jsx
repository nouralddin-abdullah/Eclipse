import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router'
import {
  Bell,
  MessageSquare,
  ThumbsUp,
  Flag,
  UserPlus,
  Check,
} from 'lucide-react'
import { useAuthStore } from '../hooks/useAuthStore'
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
} from '../hooks/useNotifications'

const typeIcons = {
  reply: MessageSquare,
  comment: MessageSquare,
  reaction: ThumbsUp,
  follow: UserPlus,
  report_resolved: Flag,
  report_dismissed: Flag,
}

const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'now'
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

const NotificationBell = () => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAllRead = useMarkAllNotificationsRead()

  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const navigate = useNavigate()

  const count = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (!isAuthenticated) return null

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-muted hover:text-foreground transition-colors duration-200"
      >
        <Bell size={20} />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? '9+' : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-surface border border-edge rounded-md shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
            <h3 className="text-sm font-semibold text-foreground">
              Notifications
            </h3>
            {count > 0 && (
              <button
                onClick={() => markAllRead.mutate()}
                className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors"
              >
                <Check size={12} />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => {
                const Icon = typeIcons[notif.type] || Bell
                const actor = notif.actor
                return (
                  <button
                    key={notif.id}
                    onClick={() => {
                      if (!notif.read) markRead.mutate(notif.id)
                      if (notif.link) navigate(notif.link)
                      setOpen(false)
                    }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left transition-colors duration-100 hover:bg-ground ${
                      !notif.read ? 'bg-ground/50' : ''
                    }`}
                  >
                    {actor?.photoURL ? (
                      <img
                        src={actor.photoURL}
                        alt={actor.nickname || actor.username || 'user'}
                        className="w-8 h-8 rounded-full object-cover border border-edge shrink-0"
                      />
                    ) : (
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                          !notif.read
                            ? 'bg-white/10 text-foreground'
                            : 'bg-ground text-muted'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-tight ${
                          !notif.read ? 'text-foreground' : 'text-muted'
                        }`}
                      >
                        {notif.title}
                      </p>
                      {notif.message && (
                        <p className="text-xs text-muted mt-0.5 line-clamp-2">
                          {notif.message}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-muted">
                        {timeAgo(notif.createdAt)}
                      </span>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-blue-400" />
                      )}
                    </div>
                  </button>
                )
              })
            ) : (
              <div className="py-8 text-center text-sm text-muted">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NotificationBell

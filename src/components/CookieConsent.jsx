import { useState } from 'react'
import { Link } from 'react-router'
import { X } from 'lucide-react'

const STORAGE_KEY = 'eclipse-cookie-consent'

const CookieConsent = () => {
  const [visible, setVisible] = useState(
    () => localStorage.getItem(STORAGE_KEY) !== 'accepted'
  )

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-50">
      <div className="bg-surface border border-edge rounded-md shadow-lg p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-foreground">
            Cookies &amp; storage
          </h3>
          <button
            onClick={accept}
            aria-label="Dismiss"
            className="text-muted hover:text-foreground transition-colors duration-200"
          >
            <X size={16} />
          </button>
        </div>
        <p className="text-xs text-muted leading-relaxed mb-4">
          Eclipse uses localStorage to keep you signed in and remember your
          preferences. We don't use tracking or advertising cookies. See our{' '}
          <Link
            to="/privacy"
            className="text-foreground underline underline-offset-2"
          >
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <button
          onClick={accept}
          className="w-full bg-white text-black text-sm font-medium px-4 py-2 rounded-sm hover:bg-white/90 transition-all duration-200"
        >
          Got it
        </button>
      </div>
    </div>
  )
}

export default CookieConsent

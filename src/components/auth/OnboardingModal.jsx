import { useState } from 'react'
import { useAuthStore } from '../../hooks/useAuthStore'
import AvatarUpload from '../AvatarUpload'

const OnboardingModal = () => {
  const { user, needsOnboarding, completeOnboarding } = useAuthStore()
  const [username, setUsername] = useState(
    user?.email?.split('@')[0]?.replace(/[^a-zA-Z0-9_]/g, '') || ''
  )
  const [nickname, setNickname] = useState(user?.name || '')
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!needsOnboarding) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim()) {
      setError('Username is required')
      return
    }
    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }
    setSubmitting(true)
    try {
      await completeOnboarding({
        username: username.trim(),
        nickname: nickname.trim() || username.trim(),
        photoURL: photoURL || null,
      })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to complete onboarding'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="bg-surface border border-edge rounded-lg w-full max-w-md p-6 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AvatarUpload
              value={photoURL}
              onChange={setPhotoURL}
              size={72}
            />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Welcome to Eclipse
          </h2>
          <p className="text-sm text-muted mt-1">
            Set up your profile to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label
              htmlFor="onboard-username"
              className="block text-xs font-medium text-muted mb-1.5"
            >
              Username *
            </label>
            <div className="flex items-center bg-ground border border-edge rounded-sm overflow-hidden focus-within:border-edge-hover transition-colors">
              <span className="text-sm text-muted pl-3">@</span>
              <input
                id="onboard-username"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value)
                  setError('')
                }}
                placeholder="your_username"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 px-2 py-2.5 outline-none"
                maxLength={20}
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-red-400 mt-1">{error}</p>
            )}
          </div>

          {/* Nickname */}
          <div>
            <label
              htmlFor="onboard-nickname"
              className="block text-xs font-medium text-muted mb-1.5"
            >
              Display Name
            </label>
            <input
              id="onboard-nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="How should we call you?"
              className="w-full bg-ground border border-edge rounded-sm text-sm text-foreground placeholder:text-muted/50 px-3 py-2.5 outline-none focus:border-edge-hover transition-colors"
              maxLength={30}
            />
          </div>

          {/* Email (read-only) */}
          <div>
            <label className="block text-xs font-medium text-muted mb-1.5">
              Email
            </label>
            <div className="w-full bg-ground/50 border border-edge rounded-sm text-sm text-muted px-3 py-2.5">
              {user?.email}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-white text-black font-semibold text-sm py-3 rounded-sm hover:bg-white/90 disabled:opacity-50 transition-all duration-200 mt-2"
          >
            {submitting ? 'Setting up…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default OnboardingModal

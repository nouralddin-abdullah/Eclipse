import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router'
import { motion } from 'motion/react'
import { Save, Bookmark, Box, Download, Trash2 } from 'lucide-react'
import { SiDiscord } from '../components/ui/BrandIcons'
import { useAuthStore } from '../hooks/useAuthStore'
import { useScripts } from '../hooks/useScripts'
import { useHubs } from '../hooks/useHubs'
import { useGameThumbnails } from '../hooks/useGameThumbnails'
import { useFilterStore } from '../hooks/useFilterStore'
import { deleteMe, exportMyData } from '../lib/api'
import { toast } from '../hooks/useToastStore'
import AvatarUpload from '../components/AvatarUpload'
import ScriptCard from '../components/ScriptCard'
import HubCard from '../components/HubCard'
import SEO from '../components/SEO'

const Profile = () => {
  const {
    user,
    isAuthenticated,
    savedScripts: savedIds,
    followedHubs: followedIds,
    updateProfile,
    signOut,
  } = useAuthStore()

  const { data: savedScriptsList = [] } = useScripts(
    { ids: savedIds.join(','), limit: 100 },
    { enabled: savedIds.length > 0 }
  )
  const { data: followedHubsList = [] } = useHubs(
    { ids: followedIds.join(','), limit: 100 },
    { enabled: followedIds.length > 0 }
  )
  const { data: gameThumbnails } = useGameThumbnails()
  const { setGameFilter } = useFilterStore()

  const [searchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'profile'
  const [activeTab, setActiveTab] = useState(initialTab)

  // Editable fields
  const [username, setUsername] = useState(user?.username || '')
  const [nickname, setNickname] = useState(user?.nickname || '')
  const [discord, setDiscord] = useState(user?.discordUsername || '')
  const [saved, setSaved] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [exporting, setExporting] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Redirect if not logged in
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSaveProfile = async () => {
    setSaveError('')
    try {
      await updateProfile({
        username: username.trim(),
        nickname: nickname.trim(),
        discordUsername: discord.trim(),
      })
      setSaved(true)
      toast.success('Profile updated')
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update profile'
      setSaveError(msg)
      toast.error(msg)
    }
  }

  const handleAvatarChange = async (url) => {
    setSaveError('')
    try {
      await updateProfile({ photoURL: url })
      toast.success('Photo updated')
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to update photo'
      setSaveError(msg)
      toast.error(msg)
    }
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const blob = await exportMyData()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `eclipse-data-${user.id}.json`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      toast.success('Data downloaded')
    } catch {
      toast.error('Export failed. Try again.')
    } finally {
      setExporting(false)
    }
  }

  const handleDelete = async () => {
    const confirmText = window.prompt(
      'This permanently deletes your account, comments, saves, follows, and reports. Type DELETE to confirm.'
    )
    if (confirmText !== 'DELETE') return
    setDeleting(true)
    try {
      await deleteMe()
      signOut()
      window.location.href = '/'
    } catch {
      setDeleting(false)
      toast.error('Account deletion failed. Try again.')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'saved', label: `Saved (${savedIds.length})` },
    { id: 'following', label: `Following (${followedIds.length})` },
    { id: 'account', label: 'Account' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-4xl mx-auto px-6 py-24">
        <SEO
          title="Profile"
          description="Manage your Eclipse profile, saved scripts, and followed hubs."
          path="/profile"
          noIndex
        />
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <AvatarUpload
            value={user.photoURL}
            onChange={handleAvatarChange}
            size={64}
          />
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {user.nickname || user.name}
            </h1>
            <p className="text-sm text-muted">
              @{user.username || user.email?.split('@')[0]}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-edge mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors duration-200 border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'text-foreground border-white'
                  : 'text-muted border-transparent hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === 'profile' && (
          <div className="max-w-md space-y-5">
            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Username
              </label>
              <div className="flex items-center bg-surface border border-edge rounded-sm overflow-hidden focus-within:border-edge-hover transition-colors">
                <span className="text-sm text-muted pl-3">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground px-2 py-2.5 outline-none"
                  maxLength={20}
                />
              </div>
            </div>

            {/* Nickname */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-surface border border-edge rounded-sm text-sm text-foreground px-3 py-2.5 outline-none focus:border-edge-hover transition-colors"
                maxLength={30}
              />
            </div>

            {/* Email (read-only) */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Email
              </label>
              <div className="w-full bg-surface/50 border border-edge rounded-sm text-sm text-muted px-3 py-2.5">
                {user.email}
              </div>
            </div>

            {/* Discord */}
            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">
                Discord
              </label>
              <div className="flex items-center bg-surface border border-edge rounded-sm overflow-hidden focus-within:border-edge-hover transition-colors">
                <span className="pl-3 text-muted">
                  <SiDiscord size={16} />
                </span>
                <input
                  type="text"
                  value={discord}
                  onChange={(e) => setDiscord(e.target.value)}
                  placeholder="username"
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 px-2 py-2.5 outline-none"
                  maxLength={40}
                />
              </div>
            </div>

            {/* Save */}
            <button
              onClick={handleSaveProfile}
              className="flex items-center gap-2 bg-white text-black font-semibold text-sm px-6 py-2.5 rounded-sm hover:bg-white/90 transition-all duration-200"
            >
              <Save size={15} />
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
            {saveError && (
              <p className="text-xs text-red-400">{saveError}</p>
            )}
          </div>
        )}

        {activeTab === 'saved' && (
          <div>
            {savedScriptsList.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {savedScriptsList.map((script) => (
                  <ScriptCard
                    key={script.id}
                    script={script}
                    hubs={followedHubsList}
                    gameData={gameThumbnails?.get(script.targetGame)}
                    onGameFilter={setGameFilter}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Bookmark size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-muted">No saved scripts yet</p>
                <p className="text-sm text-muted/70 mt-1">
                  Bookmark scripts to find them here
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'following' && (
          <div>
            {followedHubsList.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {followedHubsList.map((hub) => (
                  <HubCard
                    key={hub.id}
                    hub={hub}
                    scriptCount={hub.scriptCount ?? 0}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Box size={32} className="text-muted/30 mx-auto mb-3" />
                <p className="text-muted">Not following any hubs yet</p>
                <p className="text-sm text-muted/70 mt-1">
                  Follow hubs to stay updated
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'account' && (
          <div className="max-w-md space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-1">
                Export your data
              </h2>
              <p className="text-xs text-muted mb-3">
                Download a JSON archive of your profile, comments, saves,
                follows, reactions, and reports.
              </p>
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-2 bg-surface border border-edge text-foreground text-sm font-medium px-4 py-2.5 rounded-sm hover:border-edge-hover disabled:opacity-50 transition-all duration-200"
              >
                <Download size={15} />
                {exporting ? 'Preparing…' : 'Download data'}
              </button>
            </div>

            <div className="pt-6 border-t border-edge">
              <h2 className="text-sm font-semibold text-red-400 mb-1">
                Delete account
              </h2>
              <p className="text-xs text-muted mb-3">
                Permanently removes your account and all associated content.
                This cannot be undone.
              </p>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-red-500/20 disabled:opacity-50 transition-all duration-200"
              >
                <Trash2 size={15} />
                {deleting ? 'Deleting…' : 'Delete account'}
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Profile

import { useEffect, useRef, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion } from 'motion/react'
import {
  ThumbsUp,
  ThumbsDown,
  Gamepad2,
  Key,
  Eye,
  Share2,
  Flag,
  Bookmark,
  Copy,
  Check,
  UserPlus,
  UserCheck,
} from 'lucide-react'
import {
  useScript,
  useReactToScript,
  useSaveScript,
  useIncrementScriptView,
} from '../hooks/useScripts'
import { useHub, useFollowHub } from '../hooks/useHubs'
import { useGameThumbnails } from '../hooks/useGameThumbnails'
import { useAuthStore } from '../hooks/useAuthStore'
import Skeleton from '../components/ui/Skeleton'
import CodeBlock from '../components/CodeBlock'
import CommentSection from '../components/CommentSection'
import SEO from '../components/SEO'
import ReportModal from '../components/ReportModal'

const ScriptDetail = () => {
  const { scriptId } = useParams()
  const navigate = useNavigate()
  const { data: script, isLoading } = useScript(scriptId)
  const { data: hub } = useHub(script?.hubId)
  const { data: gameThumbnails } = useGameThumbnails()

  const {
    isAuthenticated,
    signIn,
    isScriptSaved,
    isHubFollowed,
  } = useAuthStore()

  const reactMutation = useReactToScript()
  const saveMutation = useSaveScript()
  const followMutation = useFollowHub()
  const viewMutation = useIncrementScriptView()

  const [shared, setShared] = useState(false)
  const [copied, setCopied] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)

  const bookmarked = isScriptSaved(scriptId)
  const following = script ? isHubFollowed(script.hubId) : false

  const gameData = gameThumbnails?.get(script?.targetGame)

  const currentLikes = script?.likes ?? 0
  const currentDislikes = script?.dislikes ?? 0
  const userVote = script?.userReaction ?? null

  // Track view once per script per page-load
  const viewedRef = useRef(null)
  useEffect(() => {
    if (!script?.id) return
    if (viewedRef.current === script.id) return
    viewedRef.current = script.id
    viewMutation.mutate(script.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [script?.id])

  const handleVote = (type) => {
    if (!isAuthenticated) return signIn()
    reactMutation.mutate({ id: scriptId, type })
  }

  const handleSave = () => {
    if (!isAuthenticated) return signIn()
    saveMutation.mutate(scriptId)
  }

  const handleFollow = () => {
    if (!isAuthenticated || !hub) return signIn()
    followMutation.mutate(hub.id)
  }

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    } catch {
      setShared(false)
    }
  }

  const handleCopyScript = async () => {
    try {
      await navigator.clipboard.writeText(script.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const timeAgo = (dateStr) => {
    if (!dateStr) return ''
    const diff = Date.now() - new Date(dateStr).getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return 'today'
    if (days === 1) return 'yesterday'
    if (days < 7) return `${days}d ago`
    if (days < 30) return `${Math.floor(days / 7)}w ago`
    if (days < 365) return `${Math.floor(days / 30)}mo ago`
    const years = Math.floor(days / 365)
    const months = Math.floor((days % 365) / 30)
    return months > 0 ? `${years}y ${months}mo ago` : `${years}y ago`
  }

  const formatViews = (n) => {
    if (!n) return '0'
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toLocaleString()
  }

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24">
        <Skeleton className="h-6 w-64 mb-6" />
        <Skeleton className="h-12 w-full mb-4" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          <Skeleton className="lg:col-span-3 aspect-video rounded-md" />
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-20 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
            <Skeleton className="h-12 rounded-md" />
          </div>
        </div>
      </div>
    )
  }

  if (!script) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-24 text-center">
        <h1 className="text-2xl font-bold text-foreground">Script Not Found</h1>
        <p className="text-muted mt-2">
          The script you're looking for doesn't exist.
        </p>
        <Link
          to="/scripts"
          className="inline-block mt-6 text-sm font-medium text-foreground underline underline-offset-4 hover:text-muted transition-colors"
        >
          Browse all scripts
        </Link>
      </div>
    )
  }

  const imageUrl = script.imageUrl || gameData?.thumbnailUrl

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={`${script.title} — ${script.targetGame}`}
        description={script.description}
        path={`/scripts/${script.id}`}
        image={imageUrl ? (imageUrl.startsWith('http') ? imageUrl : `https://eclipserblx.com${imageUrl}`) : undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: script.title,
          description: script.description,
          applicationCategory: 'GameApplication',
          operatingSystem: 'Roblox',
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: Math.round((currentLikes / (currentLikes + currentDislikes || 1)) * 5 * 10) / 10,
            ratingCount: currentLikes + currentDislikes,
            bestRating: 5,
          },
          interactionStatistic: {
            '@type': 'InteractionCounter',
            interactionType: 'https://schema.org/ViewAction',
            userInteractionCount: script.views || 0,
          },
        }}
      />
      <div className="max-w-5xl mx-auto px-6 py-24">
        {/* ========== TOP BAR ========== */}
        <div className="flex items-start gap-4 pb-5 border-b border-edge">
          {/* Game thumbnail (small) */}
          <div className="w-12 h-12 rounded-md overflow-hidden bg-surface border border-edge shrink-0">
            {gameData?.iconUrl ? (
              <img
                src={gameData.iconUrl}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Gamepad2 size={18} className="text-muted/40" />
              </div>
            )}
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-semibold text-foreground leading-tight truncate">
              {script.title}
              <span className="text-muted font-normal"> | </span>
              <span className="text-muted font-normal">{script.targetGame}</span>
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-muted">
                {timeAgo(script.createdAt)}
              </span>
              <button
                onClick={handleShare}
                className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors duration-200"
                title="Share"
              >
                {shared ? <Check size={13} /> : <Share2 size={13} />}
                {shared ? 'Copied' : ''}
              </button>
              <button
                onClick={() => setReportOpen(true)}
                className="text-muted hover:text-foreground transition-colors duration-200"
                title="Report"
              >
                <Flag size={13} />
              </button>
            </div>
          </div>

          {/* Views */}
          <div className="flex items-center gap-1.5 text-sm text-muted shrink-0">
            <Eye size={15} />
            <span className="font-medium">{formatViews(script.views)}</span>
            <span className="hidden sm:inline">views</span>
          </div>
        </div>

        {/* ========== MAIN CONTENT (2 columns) ========== */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mt-6">
          {/* LEFT — Script Image */}
          <div className="lg:col-span-3">
            <div className="relative aspect-video bg-ground border border-edge rounded-md overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={script.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Gamepad2 size={48} className="text-muted/20" />
                </div>
              )}

              {/* Key badge */}
              {script.hasKey && (
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-ground/80 backdrop-blur-sm border border-edge rounded-sm px-2.5 py-1 text-xs font-medium text-muted">
                  <Key size={11} />
                  Key System
                </div>
              )}
            </div>

            {/* Description (below image) */}
            {script.description && (
              <p className="mt-4 text-sm text-foreground/70 leading-relaxed">
                {script.description}
              </p>
            )}
          </div>

          {/* RIGHT — Hub info + Actions */}
          <div className="lg:col-span-2 space-y-4">
            {/* Hub Card */}
            {hub && (
              <div className="bg-surface border border-edge rounded-md p-4">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigate(`/hubs/${hub.id}`)}
                    className="flex items-center gap-3 group"
                  >
                    {hub.imageUrl ? (
                      <img
                        src={hub.imageUrl}
                        alt={hub.name}
                        className="w-10 h-10 rounded-full object-cover border border-edge"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-ground border border-edge" />
                    )}
                    <div>
                      <p className="text-sm font-semibold text-foreground group-hover:underline">
                        {hub.name}
                      </p>
                      <p className="text-xs text-muted">
                        {formatViews(hub.followers)} followers
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handleFollow}
                    disabled={followMutation.isPending}
                    className={`flex items-center gap-1.5 text-xs font-medium px-3.5 py-2 rounded-sm transition-all duration-200 disabled:opacity-50 ${
                      following
                        ? 'bg-surface border border-edge text-muted hover:text-foreground'
                        : 'bg-white text-black hover:bg-white/90'
                    }`}
                  >
                    {following ? (
                      <>
                        <UserCheck size={13} />
                        Following
                      </>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        Follow
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Vote + Bookmark */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-surface border border-edge rounded-md p-1 flex-1">
                <button
                  onClick={() => handleVote('like')}
                  className={`flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2 rounded-sm transition-all duration-200 flex-1 ${
                    userVote === 'like'
                      ? 'bg-white text-black'
                      : 'text-muted hover:text-foreground hover:bg-ground'
                  }`}
                >
                  <ThumbsUp size={15} />
                  {currentLikes}
                </button>
                <div className="w-px h-6 bg-edge" />
                <button
                  onClick={() => handleVote('dislike')}
                  className={`flex items-center justify-center gap-1.5 text-sm font-medium px-4 py-2 rounded-sm transition-all duration-200 flex-1 ${
                    userVote === 'dislike'
                      ? 'bg-white text-black'
                      : 'text-muted hover:text-foreground hover:bg-ground'
                  }`}
                >
                  <ThumbsDown size={15} />
                  {currentDislikes}
                </button>
              </div>

              <button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className={`p-2.5 rounded-md border transition-all duration-200 disabled:opacity-50 ${
                  bookmarked
                    ? 'bg-white text-black border-white'
                    : 'bg-surface border-edge text-muted hover:text-foreground hover:border-edge-hover'
                }`}
                title={bookmarked ? 'Saved' : 'Save'}
              >
                <Bookmark
                  size={18}
                  className={bookmarked ? 'fill-current' : ''}
                />
              </button>
            </div>

            {/* Copy Script Button */}
            <button
              onClick={handleCopyScript}
              className="w-full flex items-center justify-center gap-2 bg-white text-black font-semibold text-sm py-3 rounded-md hover:bg-white/90 transition-all duration-200"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied!
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy Script
                </>
              )}
            </button>
          </div>
        </div>

        {/* ========== CODE BLOCK ========== */}
        <section className="mt-8">
          <CodeBlock code={script.code} language="lua" />
        </section>

        {/* ========== COMMENTS ========== */}
        <hr className="border-edge my-12" />
        <CommentSection scriptId={scriptId} />
      </div>

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        targetType="script"
        targetId={script.id}
        targetLabel={script.title}
      />
    </motion.div>
  )
}

export default ScriptDetail

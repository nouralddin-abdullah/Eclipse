import { useParams, Link } from 'react-router'
import { motion } from 'motion/react'
import { Globe, ChevronRight, UserPlus, UserCheck } from 'lucide-react'
import { SiDiscord } from '../components/ui/BrandIcons'
import { useHub, useFollowHub } from '../hooks/useHubs'
import { useScripts } from '../hooks/useScripts'
import { useShowcases } from '../hooks/useShowcases'
import { useGameThumbnails } from '../hooks/useGameThumbnails'
import { useAuthStore } from '../hooks/useAuthStore'
import Button from '../components/ui/Button'
import StatusDot from '../components/ui/StatusDot'
import Skeleton from '../components/ui/Skeleton'
import ScriptCard from '../components/ScriptCard'
import YouTubeEmbed from '../components/YouTubeEmbed'
import SEO from '../components/SEO'

const HubDetail = () => {
  const { hubId } = useParams()
  const { data: hub, isLoading: hubLoading } = useHub(hubId)
  const { data: hubScripts = [] } = useScripts({ hubId, limit: 100 })
  const { data: hubShowcases = [] } = useShowcases({ hubId, limit: 100 })
  const { data: gameThumbnails } = useGameThumbnails()

  const { isAuthenticated, signIn, isHubFollowed } = useAuthStore()
  const followMutation = useFollowHub()
  const following = isHubFollowed(hubId)

  const handleFollow = () => {
    if (!isAuthenticated) return signIn()
    followMutation.mutate(hubId)
  }

  if (hubLoading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24">
        <Skeleton className="h-8 w-48 mb-8" />
        <Skeleton className="h-12 w-80 mb-4" />
        <Skeleton className="h-6 w-64 mb-6" />
        <Skeleton className="h-24 w-full max-w-3xl" />
      </div>
    )
  }

  if (!hub) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-24 text-center">
        <h1 className="text-3xl font-bold text-foreground">Hub Not Found</h1>
        <p className="mt-4 text-muted">The hub you're looking for doesn't exist.</p>
        <Button variant="primary" to="/hubs" className="mt-8">
          Back to Hubs
        </Button>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title={hub.name}
        description={hub.description}
        path={`/hubs/${hub.id}`}
        image={hub.imageUrl ? `https://eclipserblx.com${hub.imageUrl}` : undefined}
      />
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted mb-8">
          <Link
            to="/hubs"
            className="hover:text-foreground transition-colors duration-200"
          >
            Hubs
          </Link>
          <ChevronRight size={14} />
          <span className="text-foreground">{hub.name}</span>
        </nav>

        {/* Hub Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            {hub.imageUrl && (
              <img
                src={hub.imageUrl}
                alt={`${hub.name} logo`}
                className="w-14 h-14 rounded-md object-cover shrink-0"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{hub.name}</h1>
              <div className="flex items-center gap-3 mt-3 flex-wrap">
                <StatusDot status={hub.status} />
                <span className="text-sm text-muted capitalize">{hub.status}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleFollow}
              disabled={followMutation.isPending}
              className={`flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-sm transition-all duration-200 disabled:opacity-50 ${
                following
                  ? 'bg-surface border border-edge text-muted hover:text-foreground'
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {following ? (
                <>
                  <UserCheck size={15} />
                  Following
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Follow
                </>
              )}
            </button>
            {hub.discordUrl && (
              <Button variant="outline" href={hub.discordUrl}>
                <SiDiscord size={16} />
                Discord
              </Button>
            )}
            {hub.websiteUrl && (
              <Button variant="outline" href={hub.websiteUrl}>
                <Globe size={16} />
                Website
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="mt-6 text-muted max-w-3xl leading-relaxed">
          {hub.description}
        </p>

        {/* Included Scripts */}
        {hubScripts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Included Scripts
              <span className="text-sm font-normal text-muted ml-2">
                ({hubScripts.length})
              </span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {hubScripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  hubs={hub ? [hub] : []}
                  gameData={gameThumbnails?.get(script.targetGame)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Related Showcases */}
        {hubShowcases.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-foreground mb-6">
              Showcases
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {hubShowcases.map((showcase) => (
                <div key={showcase.id} className="space-y-3">
                  <YouTubeEmbed
                    youtubeId={showcase.youtubeId}
                    title={showcase.title}
                  />
                  <p className="text-sm font-medium text-foreground">
                    {showcase.title}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </motion.div>
  )
}

export default HubDetail

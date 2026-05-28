import { Link } from 'react-router'
import { motion } from 'motion/react'
import { Play } from 'lucide-react'
import { SiDiscord } from '../components/ui/BrandIcons'
import { useHubs } from '../hooks/useHubs'
import { useShowcases } from '../hooks/useShowcases'
import Button from '../components/ui/Button'
import Skeleton from '../components/ui/Skeleton'
import HubCard from '../components/HubCard'
import StatusBanner from '../components/StatusBanner'
import YouTubeEmbed from '../components/YouTubeEmbed'
import SEO from '../components/SEO'

const Home = () => {
  const { data: hubs, isLoading: hubsLoading } = useHubs({ limit: 100 })
  const { data: showcases, isLoading: showcasesLoading } = useShowcases({ limit: 1 })

  const latestShowcase = showcases?.[0]
  const featuredHubs = hubs?.slice(0, 6) ?? []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Eclipse',
          url: 'https://eclipserblx.com',
          description: 'Premium destination for high-quality Roblox scripts and hubs. Browse, discover, and execute scripts across all your favorite games.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://eclipserblx.com/scripts?q={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
      />
      {/* ─── Hero Section ─── */}
      <section id="hero" className="max-w-6xl mx-auto px-6 py-24 text-center">
        <img
          src="/eclipse-logo.png"
          alt="Eclipse"
          className="mx-auto mb-8 w-24 h-24 object-contain opacity-80"
        />
        <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight leading-tight">
          Premium Scripts.
          <br />
          Zero Compromise.
        </h1>
        <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
          Join thousands of users who trust Eclipse for reliable, undetected
          scripts. Built by the community, for the community.
        </p>
        <div className="flex justify-center gap-4 mt-10 flex-wrap">
          <Button variant="outline" href="#">
            <SiDiscord size={18} />
            Join Discord
          </Button>
          <Button variant="primary" to="/showcases">
            <Play size={18} />
            Watch Latest
          </Button>
        </div>
      </section>

      {/* ─── Latest Showcase ─── */}
      <section id="latest-showcase" className="mt-8 max-w-4xl mx-auto px-6">
        <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">
          Latest Showcase
        </h2>
        {showcasesLoading ? (
          <Skeleton className="w-full aspect-video rounded-md" />
        ) : latestShowcase ? (
          <>
            <YouTubeEmbed
              youtubeId={latestShowcase.youtubeId}
              title={latestShowcase.title}
            />
            <div className="mt-4 text-center">
              <p className="font-medium text-foreground">
                {latestShowcase.title}
              </p>
              <p className="text-sm text-muted mt-1">
                {new Date(latestShowcase.publishDate).toLocaleDateString(
                  'en-US',
                  { year: 'numeric', month: 'short', day: 'numeric' }
                )}
              </p>
            </div>
          </>
        ) : null}
      </section>

      {/* ─── Featured Hubs ─── */}
      <section id="featured-hubs" className="mt-24 max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-foreground">
            Featured Hubs
          </h2>
          <Link
            to="/hubs"
            className="text-sm text-muted hover:text-foreground transition-colors duration-200"
          >
            View All →
          </Link>
        </div>

        {hubsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-md" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredHubs.map((hub) => (
              <HubCard key={hub.id} hub={hub} scriptCount={hub.scriptCount ?? 0} />
            ))}
          </div>
        )}
      </section>

      {/* ─── Status Banner ─── */}
      <section id="status-banner" className="mt-24">
        {hubsLoading ? (
          <Skeleton className="h-14 w-full" />
        ) : (
          <StatusBanner hubs={hubs || []} />
        )}
      </section>
    </motion.div>
  )
}

export default Home

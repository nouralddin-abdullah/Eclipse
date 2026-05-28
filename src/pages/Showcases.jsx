import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { X } from 'lucide-react'
import { useShowcasesPaged } from '../hooks/useShowcases'
import { useScripts } from '../hooks/useScripts'
import { useFilterStore } from '../hooks/useFilterStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import SearchInput from '../components/ui/SearchInput'
import Pagination from '../components/ui/Pagination'
import Skeleton from '../components/ui/Skeleton'
import ShowcaseCard from '../components/ShowcaseCard'
import YouTubeEmbed from '../components/YouTubeEmbed'
import SEO from '../components/SEO'

const PAGE_SIZE = 12

const Showcases = () => {
  const { searchQuery, setSearchQuery } = useFilterStore()
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(searchQuery, 300)
  const [activeShowcase, setActiveShowcase] = useState(null)

  const onSearch = (q) => {
    setSearchQuery(q)
    setPage(1)
  }

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(debouncedQuery && { q: debouncedQuery }),
  }

  const { data: env, isLoading } = useShowcasesPaged(params)
  const showcases = useMemo(() => env?.items ?? [], [env])
  const total = env?.total ?? 0

  // Fetch only the scripts referenced by visible showcases
  const referencedScriptIds = useMemo(() => {
    const set = new Set()
    for (const sc of showcases) {
      for (const id of sc.scriptIds || []) set.add(id)
    }
    return [...set]
  }, [showcases])

  const { data: relatedScripts = [] } = useScripts(
    { ids: referencedScriptIds.join(','), limit: 100 },
    { enabled: referencedScriptIds.length > 0 }
  )
  const scriptsById = useMemo(
    () => new Map(relatedScripts.map((s) => [s.id, s])),
    [relatedScripts]
  )
  const getScripts = (ids) =>
    (ids || []).map((id) => scriptsById.get(id)).filter(Boolean)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24">
        <SEO
          title="Showcases"
          description="Watch live demonstrations and video showcases of Eclipse scripts and hubs in action. See features, performance, and real gameplay footage."
          path="/showcases"
        />
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Showcases</h1>
        <p className="mt-2 text-muted">
          Watch our latest script demonstrations and feature showcases
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8">
          <SearchInput
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search showcases..."
            className="w-full md:w-72"
          />
        </div>

        {/* Active Player */}
        {activeShowcase && (
          <div className="mt-8 bg-surface border border-edge rounded-md p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-foreground">
                {activeShowcase.title}
              </h2>
              <button
                onClick={() => setActiveShowcase(null)}
                className="text-muted hover:text-foreground transition-colors duration-200 p-1"
                aria-label="Close player"
              >
                <X size={20} />
              </button>
            </div>
            <YouTubeEmbed
              youtubeId={activeShowcase.youtubeId}
              title={activeShowcase.title}
            />
            <p className="text-sm text-muted mt-3">
              {new Date(activeShowcase.publishDate).toLocaleDateString(
                'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </p>
          </div>
        )}

        {/* Grid */}
        {isLoading && !env ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-video rounded-md" />
            ))}
          </div>
        ) : showcases.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {showcases.map((showcase) => (
                <ShowcaseCard
                  key={showcase.id}
                  showcase={showcase}
                  scripts={getScripts(showcase.scriptIds)}
                  onClick={setActiveShowcase}
                />
              ))}
            </div>
            <Pagination
              page={page}
              limit={PAGE_SIZE}
              total={total}
              onChange={setPage}
              className="mt-10"
            />
          </>
        ) : (
          <div className="mt-16 text-center">
            <p className="text-muted text-lg">No showcases found</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Showcases

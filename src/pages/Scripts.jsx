import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { useScriptsPaged } from '../hooks/useScripts'
import { useHubs } from '../hooks/useHubs'
import { useGameThumbnails } from '../hooks/useGameThumbnails'
import { useFilterStore } from '../hooks/useFilterStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import SearchInput from '../components/ui/SearchInput'
import GameSearchFilter from '../components/ui/GameSearchFilter'
import Pagination from '../components/ui/Pagination'
import Skeleton from '../components/ui/Skeleton'
import ScriptCard from '../components/ScriptCard'
import SEO from '../components/SEO'

const PAGE_SIZE = 24

const Scripts = () => {
  const {
    searchQuery,
    gameFilter,
    keyFilter,
    setSearchQuery,
    setGameFilter,
    setKeyFilter,
  } = useFilterStore()

  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(searchQuery, 300)

  // Reset to page 1 when filters change
  const onSearch = (q) => {
    setSearchQuery(q)
    setPage(1)
  }
  const onGame = (g) => {
    setGameFilter(g)
    setPage(1)
  }
  const onKey = (k) => {
    setKeyFilter(k)
    setPage(1)
  }

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(debouncedQuery && { q: debouncedQuery }),
    ...(gameFilter !== 'all' && { game: gameFilter }),
    ...(keyFilter !== 'all' && { hasKey: keyFilter === 'haskey' ? 'true' : 'false' }),
  }

  const { data: env, isLoading: scriptsLoading } = useScriptsPaged(params)
  const { data: hubs = [], isLoading: hubsLoading } = useHubs({ limit: 100 })
  const { data: gameThumbnails } = useGameThumbnails()

  const scripts = useMemo(() => env?.items ?? [], [env])
  const total = env?.total ?? 0

  // Local games for the quick-access list — taken from the visible page
  const localGames = useMemo(() => {
    const unique = [...new Set(scripts.map((s) => s.targetGame).filter(Boolean))]
    return unique.sort((a, b) => {
      if (a === 'Universal') return -1
      if (b === 'Universal') return 1
      return a.localeCompare(b)
    })
  }, [scripts])

  const isLoading = scriptsLoading || hubsLoading

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Scripts"
        description="Browse the full Eclipse script library — auto-farm, ESP, aimbot, speed boost, and more across Blox Fruits, Arsenal, Pet Sim X, and other top Roblox games."
        path="/scripts"
      />
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Scripts</h1>
        <p className="mt-2 text-muted">
          Explore individual scripts across all supported games
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8">
          <SearchInput
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search scripts..."
            className="w-full md:w-72"
          />
          <GameSearchFilter
            value={gameFilter}
            onChange={onGame}
            localGames={localGames}
            gameIcons={gameThumbnails}
            className="w-full md:w-64"
          />
          <select
            id="script-key-filter"
            value={keyFilter}
            onChange={(e) => onKey(e.target.value)}
            className="bg-surface border border-edge rounded-sm text-foreground text-sm px-4 py-2.5 transition-colors duration-200 focus:border-edge-hover focus:outline-none cursor-pointer"
          >
            <option value="all">All Scripts</option>
            <option value="nokey">No Key System</option>
            <option value="haskey">Key System</option>
          </select>
        </div>

        {/* Grid */}
        {isLoading && !env ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-[4/3] rounded-md" />
            ))}
          </div>
        ) : scripts.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mt-8">
              {scripts.map((script) => (
                <ScriptCard
                  key={script.id}
                  script={script}
                  hubs={hubs}
                  gameData={gameThumbnails?.get(script.targetGame)}
                  onGameFilter={onGame}
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
            <p className="text-muted text-lg">No scripts found</p>
            <p className="text-sm text-muted mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Scripts

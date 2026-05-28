import { useState } from 'react'
import { motion } from 'motion/react'
import { useHubsPaged } from '../hooks/useHubs'
import { useFilterStore } from '../hooks/useFilterStore'
import { useDebouncedValue } from '../hooks/useDebouncedValue'
import SEO from '../components/SEO'
import SearchInput from '../components/ui/SearchInput'
import Pagination from '../components/ui/Pagination'
import Skeleton from '../components/ui/Skeleton'
import HubCard from '../components/HubCard'

const PAGE_SIZE = 24

const Hubs = () => {
  const { searchQuery, hubStatusFilter, setSearchQuery, setHubStatusFilter } =
    useFilterStore()

  const [page, setPage] = useState(1)
  const debouncedQuery = useDebouncedValue(searchQuery, 300)

  const onSearch = (q) => {
    setSearchQuery(q)
    setPage(1)
  }
  const onStatus = (s) => {
    setHubStatusFilter(s)
    setPage(1)
  }

  const params = {
    page,
    limit: PAGE_SIZE,
    ...(debouncedQuery && { q: debouncedQuery }),
    ...(hubStatusFilter !== 'all' && { status: hubStatusFilter }),
  }

  const { data: env, isLoading } = useHubsPaged(params)
  const hubs = env?.items ?? []
  const total = env?.total ?? 0

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <SEO
        title="Hubs"
        description="Browse all Eclipse hubs — premium Roblox script executors with auto-inject, custom UIs, and multi-game support. Find the perfect hub for your setup."
        path="/hubs"
      />
      <div className="max-w-6xl mx-auto px-6 py-24">
        {/* Header */}
        <h1 className="text-3xl font-bold text-foreground">Hubs</h1>
        <p className="mt-2 text-muted">
          Browse our collection of premium hubs
        </p>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mt-8">
          <SearchInput
            value={searchQuery}
            onChange={onSearch}
            placeholder="Search hubs..."
            className="w-full md:w-72"
          />
          <select
            id="hub-status-filter"
            value={hubStatusFilter}
            onChange={(e) => onStatus(e.target.value)}
            className="bg-surface border border-edge rounded-sm text-foreground text-sm px-4 py-2.5 transition-colors duration-200 focus:border-edge-hover focus:outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="online">Online</option>
            <option value="updating">Updating</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Grid */}
        {isLoading && !env ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-48 rounded-md" />
            ))}
          </div>
        ) : hubs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
              {hubs.map((hub) => (
                <HubCard
                  key={hub.id}
                  hub={hub}
                  scriptCount={hub.scriptCount ?? 0}
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
            <p className="text-muted text-lg">No hubs found</p>
            <p className="text-sm text-muted mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default Hubs

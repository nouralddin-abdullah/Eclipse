import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2, Gamepad2 } from 'lucide-react'
import { useGameSearch } from '../../hooks/useGameSearch'

/**
 * Searchable game filter that queries Roblox's omni-search API.
 * Shows game icons from Roblox thumbnails. Falls back to local
 * games list when search is empty.
 *
 * Props:
 *   gameIcons – Map<gameName, { iconUrl }> from useGameThumbnails
 */
const GameSearchFilter = ({
  value,
  onChange,
  localGames = [],
  gameIcons,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const { searchTerm, setSearchTerm, results, isSearching } = useGameSearch(isOpen)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (gameName) => {
    onChange(gameName)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    onChange('all')
    setSearchTerm('')
    setIsOpen(false)
  }

  // Get the icon URL for a game name from the thumbnails map
  const getIconUrl = (gameName) => gameIcons?.get(gameName)?.iconUrl || null

  const showResults = searchTerm.length >= 2
  const hasSelection = value && value !== 'all'
  const selectedIconUrl = hasSelection ? getIconUrl(value) : null

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input */}
      <div
        className="flex items-center bg-surface border border-edge rounded-sm transition-colors duration-200 focus-within:border-edge-hover cursor-pointer"
        onClick={() => {
          setIsOpen(true)
          setTimeout(() => inputRef.current?.focus(), 0)
        }}
      >
        <Search size={16} className="ml-3 text-muted shrink-0" />

        {hasSelection && !isOpen ? (
          <div className="flex items-center gap-2 px-3 py-2.5 flex-1 min-w-0">
            {selectedIconUrl ? (
              <img src={selectedIconUrl} alt="" className="w-4 h-4 rounded-xs object-cover shrink-0" />
            ) : (
              <Gamepad2 size={14} className="text-muted shrink-0" />
            )}
            <span className="text-sm text-foreground truncate">{value}</span>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="Search Roblox games..."
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted px-3 py-2.5 outline-none min-w-0"
          />
        )}

        {isSearching && (
          <Loader2 size={16} className="mr-2 text-muted animate-spin shrink-0" />
        )}

        {hasSelection && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="mr-2 p-1 text-muted hover:text-foreground transition-colors duration-200"
            aria-label="Clear game filter"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-edge rounded-md shadow-lg z-40 max-h-72 overflow-y-auto">
          {/* Local games (quick access) */}
          {!showResults && localGames.length > 0 && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted uppercase tracking-wider border-b border-edge">
                Games with Scripts
              </div>
              <button
                onClick={() => handleSelect('all')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 hover:bg-ground ${
                  value === 'all' ? 'text-foreground' : 'text-muted'
                }`}
              >
                <Gamepad2 size={16} className="shrink-0" />
                <span className="text-sm">All Games</span>
              </button>
              {localGames.map((game) => {
                const iconUrl = getIconUrl(game)
                return (
                  <button
                    key={game}
                    onClick={() => handleSelect(game)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 hover:bg-ground ${
                      value === game ? 'text-foreground' : 'text-muted'
                    }`}
                  >
                    {iconUrl ? (
                      <img
                        src={iconUrl}
                        alt=""
                        className="w-5 h-5 rounded-xs object-cover shrink-0"
                      />
                    ) : (
                      <Gamepad2 size={16} className="shrink-0" />
                    )}
                    <span className="text-sm">{game}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Roblox search results */}
          {showResults && (
            <div>
              <div className="px-3 py-2 text-xs font-medium text-muted uppercase tracking-wider border-b border-edge">
                Roblox Results
              </div>
              {isSearching && results.length === 0 ? (
                <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted">
                  <Loader2 size={16} className="animate-spin" />
                  Searching Roblox...
                </div>
              ) : results.length > 0 ? (
                results.map((game) => (
                  <button
                    key={game.universeId}
                    onClick={() => handleSelect(game.name)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors duration-100 hover:bg-ground"
                  >
                    {game.iconUrl ? (
                      <img
                        src={game.iconUrl}
                        alt=""
                        className="w-8 h-8 rounded-sm object-cover shrink-0"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-sm bg-ground shrink-0" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-foreground truncate">
                        {game.name}
                      </p>
                      <p className="text-xs text-muted">
                        {game.playerCount.toLocaleString()} playing
                      </p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="py-6 text-center text-sm text-muted">
                  No games found
                </div>
              )}
            </div>
          )}

          {/* Hint when empty */}
          {!showResults && localGames.length === 0 && (
            <div className="py-6 text-center text-sm text-muted">
              Type to search Roblox games
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GameSearchFilter

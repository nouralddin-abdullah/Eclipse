import { useState, useRef, useEffect } from 'react'
import { Search, X, Loader2, Gamepad2 } from 'lucide-react'
import { useGameSearch } from '../../hooks/useGameSearch'

/**
 * Single-select Roblox game picker for forms. Returns both the
 * display name and the universeId so callers can persist both fields.
 *
 * Props:
 *   value   – currently-selected game name (string)
 *   gameId  – currently-selected universeId (string)
 *   onChange({ name, gameId })
 */
const GameSearchPicker = ({
  value,
  gameId,
  onChange,
  placeholder = 'Search Roblox games...',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const { searchTerm, setSearchTerm, results, isSearching } = useGameSearch(isOpen)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (game) => {
    onChange({ name: game.name, gameId: String(game.universeId) })
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    onChange({ name: '', gameId: '' })
    setSearchTerm('')
    setIsOpen(false)
  }

  const showResults = searchTerm.length >= 2
  const hasSelection = !!value

  return (
    <div ref={containerRef} className="relative">
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
            <Gamepad2 size={14} className="text-muted shrink-0" />
            <span className="text-sm text-foreground truncate">{value}</span>
            {gameId && (
              <span className="text-xs text-muted shrink-0">#{gameId}</span>
            )}
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={isOpen ? searchTerm : ''}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted px-3 py-2.5 outline-none min-w-0"
          />
        )}

        {isSearching && (
          <Loader2 size={16} className="mr-2 text-muted animate-spin shrink-0" />
        )}

        {hasSelection && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleClear()
            }}
            className="mr-2 p-1 text-muted hover:text-foreground transition-colors duration-200"
            aria-label="Clear game"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-edge rounded-md shadow-lg z-40 max-h-72 overflow-y-auto">
          {showResults ? (
            isSearching && results.length === 0 ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted">
                <Loader2 size={16} className="animate-spin" />
                Searching Roblox...
              </div>
            ) : results.length > 0 ? (
              results.map((game) => (
                <button
                  key={game.universeId}
                  type="button"
                  onClick={() => handleSelect(game)}
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
                      {game.playerCount.toLocaleString()} playing · #
                      {game.universeId}
                    </p>
                  </div>
                </button>
              ))
            ) : (
              <div className="py-6 text-center text-sm text-muted">
                No games found
              </div>
            )
          ) : (
            <div className="py-6 text-center text-sm text-muted">
              Type to search Roblox games
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default GameSearchPicker

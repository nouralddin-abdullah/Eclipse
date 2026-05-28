import { useNavigate } from 'react-router'
import { Gamepad2, Key } from 'lucide-react'

/**
 * Script card with game thumbnail, game tag (with icon), title, and hub info.
 *
 * Props:
 *   script       – script object (hubId, hasKey)
 *   hubs         – full hubs array
 *   gameData     – { thumbnailUrl, iconUrl } from useGameThumbnails
 *   onGameFilter – callback(gameName) to filter by game
 */
const ScriptCard = ({ script, hubs = [], gameData, onGameFilter }) => {
  const navigate = useNavigate()
  const { title, targetGame, hubId, hasKey } = script

  const hub = hubs.find((h) => h.id === hubId)
  // Script's own image takes priority, falls back to Roblox game thumbnail
  const imageUrl = script.imageUrl || gameData?.thumbnailUrl
  const iconUrl = gameData?.iconUrl

  return (
    <div
      id={`script-card-${script.id}`}
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/scripts/${script.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/scripts/${script.id}`)}
      className="bg-surface border border-edge rounded-md overflow-hidden transition-colors duration-100 hover:border-edge-hover cursor-pointer"
    >
      {/* Game Thumbnail */}
      <div className="relative aspect-video bg-ground overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={targetGame}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Gamepad2 size={32} className="text-muted/30" />
          </div>
        )}

        {/* Key System badge — top-right corner */}
        {hasKey && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-ground/80 backdrop-blur-sm border border-edge rounded-sm px-2 py-0.5 text-xs font-medium text-muted">
            <Key size={10} />
            Key
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Game Tag — clickable, with game icon */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            onGameFilter?.(targetGame)
          }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted bg-ground border border-edge rounded-sm px-2 py-1 hover:text-foreground hover:border-edge-hover transition-colors duration-200"
        >
          {iconUrl ? (
            <img
              src={iconUrl}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-3.5 h-3.5 rounded-xs object-cover"
            />
          ) : (
            <Gamepad2 size={12} />
          )}
          {targetGame}
        </button>

        {/* Title */}
        <h3 className="text-sm font-semibold text-foreground mt-2.5 leading-snug">
          {title}
        </h3>

        {/* Hub Info — clickable, navigates to hub */}
        {hub && (
          <button
            onClick={() => navigate(`/hubs/${hub.id}`)}
            className="flex items-center gap-2 mt-3 group"
          >
            {hub.imageUrl ? (
              <img
                src={hub.imageUrl}
                alt={hub.name}
                loading="lazy"
                decoding="async"
                className="w-5 h-5 rounded-sm object-cover shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-sm bg-ground shrink-0" />
            )}
            <span className="text-xs text-muted group-hover:text-foreground transition-colors duration-200">
              {hub.name}
            </span>
          </button>
        )}
      </div>
    </div>
  )
}

export default ScriptCard

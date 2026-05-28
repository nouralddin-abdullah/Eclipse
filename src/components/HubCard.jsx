import { useNavigate } from 'react-router'
import { Globe, Code2 } from 'lucide-react'
import { SiDiscord } from './ui/BrandIcons'
import StatusDot from './ui/StatusDot'

const HubCard = ({ hub, scriptCount = 0 }) => {
  const navigate = useNavigate()
  const {
    id,
    name,
    status,
    description,
    discordUrl,
    websiteUrl,
    imageUrl,
  } = hub

  const handleCardClick = () => {
    navigate(`/hubs/${id}`)
  }

  return (
    <div
      id={`hub-card-${id}`}
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className="bg-surface border border-edge rounded-md p-5 transition-colors duration-100 hover:border-edge-hover cursor-pointer"
    >
      {/* Logo + Name */}
      <div className="flex flex-col items-center text-center gap-3">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${name} logo`}
            loading="lazy"
            decoding="async"
            className="w-12 h-12 rounded-md object-cover"
          />
        )}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <StatusDot status={status} />
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted mt-3 line-clamp-2 text-center">
        {description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-edge">
        <div className="flex items-center gap-1.5 text-xs text-muted">
          <Code2 size={14} />
          <span>{scriptCount} scripts</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href={discordUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted hover:text-foreground transition-colors duration-200"
            aria-label={`${name} Discord`}
          >
            <SiDiscord size={15} />
          </a>
          <a
            href={websiteUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-muted hover:text-foreground transition-colors duration-200"
            aria-label={`${name} Website`}
          >
            <Globe size={15} />
          </a>
        </div>
      </div>
    </div>
  )
}

export default HubCard

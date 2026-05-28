import { Play, Code2 } from 'lucide-react'
import { Link } from 'react-router'

const ShowcaseCard = ({ showcase, scripts = [], onClick }) => {
  const { title, publishDate, thumbnailUrl } = showcase

  const formattedDate = new Date(publishDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <div
      id={`showcase-card-${showcase.id}`}
      className="bg-surface border border-edge rounded-md overflow-hidden transition-colors duration-100 hover:border-edge-hover cursor-pointer flex flex-col"
      onClick={() => onClick?.(showcase)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-ground">
        <img
          src={thumbnailUrl}
          alt={title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity duration-200">
          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
            <Play size={20} className="text-black ml-0.5" fill="currentColor" />
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-foreground text-sm line-clamp-1">{title}</h3>
        <p className="text-xs text-muted mt-1">{formattedDate}</p>

        {scripts.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {scripts.map((script) => (
              <Link
                key={script.id}
                to={`/scripts/${script.id}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-sm bg-ground border border-edge text-xs text-muted hover:text-foreground hover:border-edge-hover transition-colors max-w-full"
              >
                <Code2 size={11} className="shrink-0" />
                <span className="truncate">{script.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShowcaseCard

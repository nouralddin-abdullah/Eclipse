import { ChevronLeft, ChevronRight } from 'lucide-react'

const Pagination = ({ page, limit, total, onChange, className = '' }) => {
  const pages = Math.max(1, Math.ceil(total / limit))
  if (pages <= 1) return null

  const safeChange = (next) => {
    const clamped = Math.min(Math.max(1, next), pages)
    if (clamped !== page) onChange(clamped)
  }

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  return (
    <div className={`flex items-center justify-between gap-4 ${className}`}>
      <p className="text-xs text-muted">
        Showing <span className="text-foreground font-medium">{start}–{end}</span> of{' '}
        <span className="text-foreground font-medium">{total}</span>
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => safeChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-edge rounded-sm text-xs text-muted hover:text-foreground hover:border-edge-hover transition-colors disabled:opacity-40 disabled:hover:text-muted disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} />
          Prev
        </button>
        <span className="text-xs text-muted px-2">
          Page <span className="text-foreground font-medium">{page}</span> of {pages}
        </span>
        <button
          onClick={() => safeChange(page + 1)}
          disabled={page >= pages}
          className="flex items-center gap-1 px-3 py-1.5 bg-surface border border-edge rounded-sm text-xs text-muted hover:text-foreground hover:border-edge-hover transition-colors disabled:opacity-40 disabled:hover:text-muted disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}

export default Pagination

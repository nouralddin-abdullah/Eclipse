const Badge = ({ children, variant = 'default', className = '' }) => {
  const base = 'inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-sm'

  const variants = {
    default: 'bg-surface border border-edge text-muted',
    success: 'bg-online/10 text-online border border-online/20',
    danger: 'bg-danger/10 text-danger border border-danger/20',
    game: 'bg-surface border border-edge text-foreground',
  }

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`}>
      {children}
    </span>
  )
}

export default Badge

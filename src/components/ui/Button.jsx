import { Link } from 'react-router'

const Button = ({
  variant = 'primary',
  children,
  className = '',
  href,
  to,
  onClick,
  ...rest
}) => {
  const base =
    'inline-flex items-center justify-center gap-2 font-medium rounded-sm px-5 py-2.5 transition-all duration-200 cursor-pointer'

  const variants = {
    primary: 'bg-white text-black hover:bg-[#E5E5E5] hover:-translate-y-px',
    outline:
      'bg-transparent border border-edge text-foreground hover:bg-surface hover:border-edge-hover',
  }

  const classes = `${base} ${variants[variant] || variants.primary} ${className}`

  // External link
  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('//')
    return (
      <a
        href={href}
        className={classes}
        onClick={onClick}
        {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {children}
      </a>
    )
  }

  // Internal route link
  if (to) {
    return (
      <Link to={to} className={classes} onClick={onClick} {...rest}>
        {children}
      </Link>
    )
  }

  // Plain button
  return (
    <button className={classes} onClick={onClick} {...rest}>
      {children}
    </button>
  )
}

export default Button

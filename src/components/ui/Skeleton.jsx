const Skeleton = ({ className = 'h-4 w-full' }) => {
  return <div className={`bg-surface rounded-md animate-pulse ${className}`} />
}

export default Skeleton

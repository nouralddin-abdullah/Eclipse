const statusConfig = {
  online: {
    color: '#34C759',
    glow: '0 0 8px rgba(52, 199, 89, 0.6)',
  },
  updating: {
    color: '#FF3B30',
    glow: '0 0 8px rgba(255, 59, 48, 0.6)',
  },
  offline: {
    color: '#9BA1A6',
    glow: 'none',
  },
}

const StatusDot = ({ status = 'offline' }) => {
  const config = statusConfig[status] || statusConfig.offline

  return (
    <span
      className="inline-block w-2 h-2 rounded-full shrink-0"
      style={{
        backgroundColor: config.color,
        boxShadow: config.glow,
      }}
      aria-label={`Status: ${status}`}
    />
  )
}

export default StatusDot

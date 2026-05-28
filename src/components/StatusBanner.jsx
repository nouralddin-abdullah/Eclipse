import StatusDot from './ui/StatusDot'

const StatusBanner = ({ hubs = [] }) => {
  return (
    <div className="bg-surface border-y border-edge py-4">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {hubs.map((hub) => (
            <div
              key={hub.id}
              className="flex items-center gap-2"
            >
              <StatusDot status={hub.status} />
              <span className="text-sm font-medium text-foreground">{hub.name}</span>
              <span className="text-xs text-muted capitalize">({hub.status})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatusBanner

import { Link } from 'react-router'
import { Box, Code2, Play, Wifi, Plus } from 'lucide-react'
import { useHubsPaged } from '../../hooks/useHubs'
import { useScriptsPaged } from '../../hooks/useScripts'
import { useShowcasesPaged } from '../../hooks/useShowcases'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-surface border border-edge rounded-md p-5">
    <div className="flex items-center gap-3 mb-3">
      <div
        className="p-2 rounded-sm"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
    </div>
    <p className="text-2xl font-bold text-foreground">{value}</p>
    <p className="text-xs text-muted mt-1">{label}</p>
  </div>
)

const Overview = () => {
  // Counts only; `limit: 1` keeps payloads tiny while `total` reports the true count.
  const { data: hubsEnv } = useHubsPaged({ limit: 1 })
  const { data: scriptsEnv } = useScriptsPaged({ limit: 1 })
  const { data: showcasesEnv } = useShowcasesPaged({ limit: 1 })
  const { data: onlineEnv } = useHubsPaged({ limit: 1, status: 'online' })

  const hubsTotal = hubsEnv?.total ?? 0
  const scriptsTotal = scriptsEnv?.total ?? 0
  const showcasesTotal = showcasesEnv?.total ?? 0
  const onlineHubs = onlineEnv?.total ?? 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">
          Overview
        </h2>
        <p className="text-sm text-muted">
          Quick summary of your Eclipse content.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Box}
          label="Total Hubs"
          value={hubsTotal}
          color="#8B5CF6"
        />
        <StatCard
          icon={Code2}
          label="Total Scripts"
          value={scriptsTotal}
          color="#3B82F6"
        />
        <StatCard
          icon={Play}
          label="Total Showcases"
          value={showcasesTotal}
          color="#F97316"
        />
        <StatCard
          icon={Wifi}
          label="Online Hubs"
          value={onlineHubs}
          color="#34C759"
        />
      </div>

      {/* Quick actions */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Quick Actions
        </h3>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/dashboard/hubs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-edge rounded-sm text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Plus size={16} />
            New Hub
          </Link>
          <Link
            to="/dashboard/scripts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-edge rounded-sm text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Plus size={16} />
            New Script
          </Link>
          <Link
            to="/dashboard/showcases/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface border border-edge rounded-sm text-sm font-medium text-foreground hover:bg-white/5 transition-colors"
          >
            <Plus size={16} />
            New Showcase
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Overview

import { Link } from 'react-router'
import { Plus, Pencil, Trash2, Box } from 'lucide-react'
import { useHubs, useDeleteHub } from '../../hooks/useHubs'
import StatusDot from '../../components/ui/StatusDot'
import Skeleton from '../../components/ui/Skeleton'

const HubsList = () => {
  const { data: hubs = [], isLoading } = useHubs({ limit: 100 })
  const deleteMutation = useDeleteHub()

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">Hubs</h2>
          <p className="text-sm text-muted">
            Manage your hubs and their settings.
          </p>
        </div>
        <Link
          to="/dashboard/hubs/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus size={16} />
          Add Hub
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : hubs.length === 0 ? (
        <div className="bg-surface border border-edge rounded-md p-12 text-center">
          <Box size={40} className="mx-auto mb-3 text-muted/40" />
          <p className="text-sm text-muted mb-4">No hubs yet.</p>
          <Link
            to="/dashboard/hubs/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold"
          >
            <Plus size={16} />
            Create your first hub
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-edge rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Image
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Name
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden md:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {hubs.map((hub) => (
                  <tr
                    key={hub.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      {hub.imageUrl ? (
                        <img
                          src={hub.imageUrl}
                          alt={hub.name}
                          className="w-10 h-10 rounded-sm object-cover border border-edge"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-sm bg-ground border border-edge flex items-center justify-center">
                          <Box size={16} className="text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {hub.name}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusDot status={hub.status} />
                        <span className="text-muted capitalize text-xs">
                          {hub.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted max-w-xs truncate hidden md:table-cell">
                      {hub.description}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/dashboard/hubs/${hub.id}/edit`}
                          className="p-2 rounded-sm hover:bg-white/10 text-muted hover:text-foreground transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(hub.id, hub.name)}
                          disabled={deleteMutation.isPending}
                          className="p-2 rounded-sm hover:bg-danger/10 text-muted hover:text-danger transition-colors disabled:opacity-40"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default HubsList

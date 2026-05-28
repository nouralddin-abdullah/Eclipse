import { Link } from 'react-router'
import { Plus, Pencil, Trash2, Code2 } from 'lucide-react'
import { useScripts, useDeleteScript } from '../../hooks/useScripts'
import { useHubs } from '../../hooks/useHubs'
import Badge from '../../components/ui/Badge'
import Skeleton from '../../components/ui/Skeleton'

const ScriptsList = () => {
  const { data: scripts = [], isLoading } = useScripts({ limit: 100 })
  const { data: hubs = [] } = useHubs({ limit: 100 })
  const deleteMutation = useDeleteScript()

  const getHubName = (hubId) => {
    const hub = hubs.find((h) => h.id === hubId)
    return hub?.name || hubId
  }

  const handleDelete = (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Scripts
          </h2>
          <p className="text-sm text-muted">
            Manage scripts across all hubs.
          </p>
        </div>
        <Link
          to="/dashboard/scripts/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus size={16} />
          Add Script
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : scripts.length === 0 ? (
        <div className="bg-surface border border-edge rounded-md p-12 text-center">
          <Code2 size={40} className="mx-auto mb-3 text-muted/40" />
          <p className="text-sm text-muted mb-4">No scripts yet.</p>
          <Link
            to="/dashboard/scripts/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold"
          >
            <Plus size={16} />
            Create your first script
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
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden sm:table-cell">
                    Game
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden md:table-cell">
                    Hub
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden lg:table-cell">
                    Key System
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden lg:table-cell">
                    Patched
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {scripts.map((script) => (
                  <tr
                    key={script.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      {script.imageUrl ? (
                        <img
                          src={script.imageUrl}
                          alt={script.title}
                          className="w-10 h-10 rounded-sm object-cover border border-edge"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-sm bg-ground border border-edge flex items-center justify-center">
                          <Code2 size={16} className="text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">
                      {script.title}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap hidden sm:table-cell">
                      {script.targetGame}
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap hidden md:table-cell">
                      {getHubName(script.hubId)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={script.hasKey ? 'success' : 'default'}>
                        {script.hasKey ? 'Yes' : 'No'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <Badge variant={script.isPatched ? 'danger' : 'default'}>
                        {script.isPatched ? 'Patched' : 'Working'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/dashboard/scripts/${script.id}/edit`}
                          className="p-2 rounded-sm hover:bg-white/10 text-muted hover:text-foreground transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(script.id, script.title)
                          }
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

export default ScriptsList

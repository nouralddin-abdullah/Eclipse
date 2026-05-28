import { Link } from 'react-router'
import { Plus, Pencil, Trash2, Play } from 'lucide-react'
import { useShowcases, useDeleteShowcase } from '../../hooks/useShowcases'
import { useHubs } from '../../hooks/useHubs'
import { useScripts } from '../../hooks/useScripts'
import Skeleton from '../../components/ui/Skeleton'

const ShowcasesList = () => {
  const { data: showcases = [], isLoading } = useShowcases({ limit: 100 })
  const { data: hubs = [] } = useHubs({ limit: 100 })
  const { data: scripts = [] } = useScripts({ limit: 100 })
  const deleteMutation = useDeleteShowcase()

  const getNames = (ids, collection) =>
    (ids || [])
      .map((id) => collection.find((item) => item.id === id))
      .filter(Boolean)
      .map((item) => item.name || item.title)
      .join(', ') || '—'

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
            Showcases
          </h2>
          <p className="text-sm text-muted">
            Manage YouTube showcase videos.
          </p>
        </div>
        <Link
          to="/dashboard/showcases/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold hover:bg-white/90 transition-colors"
        >
          <Plus size={16} />
          Add Showcase
        </Link>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : showcases.length === 0 ? (
        <div className="bg-surface border border-edge rounded-md p-12 text-center">
          <Play size={40} className="mx-auto mb-3 text-muted/40" />
          <p className="text-sm text-muted mb-4">No showcases yet.</p>
          <Link
            to="/dashboard/showcases/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black rounded-sm text-sm font-semibold"
          >
            <Plus size={16} />
            Create your first showcase
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-edge rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Thumbnail
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Title
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden sm:table-cell">
                    Date
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden md:table-cell">
                    Hubs
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted hidden lg:table-cell">
                    Scripts
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {showcases.map((showcase) => (
                  <tr
                    key={showcase.id}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      {showcase.thumbnailUrl ? (
                        <img
                          src={showcase.thumbnailUrl}
                          alt={showcase.title}
                          className="w-16 h-10 rounded-sm object-cover border border-edge"
                        />
                      ) : (
                        <div className="w-16 h-10 rounded-sm bg-ground border border-edge flex items-center justify-center">
                          <Play size={14} className="text-muted/40" />
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground max-w-xs">
                      <span className="line-clamp-1">{showcase.title}</span>
                    </td>
                    <td className="px-4 py-3 text-muted whitespace-nowrap hidden sm:table-cell">
                      {showcase.publishDate}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[140px] truncate hidden md:table-cell">
                      {getNames(showcase.hubIds, hubs)}
                    </td>
                    <td className="px-4 py-3 text-muted text-xs max-w-[180px] truncate hidden lg:table-cell">
                      {getNames(showcase.scriptIds, scripts)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/dashboard/showcases/${showcase.id}/edit`}
                          className="p-2 rounded-sm hover:bg-white/10 text-muted hover:text-foreground transition-colors"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(showcase.id, showcase.title)
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

export default ShowcasesList

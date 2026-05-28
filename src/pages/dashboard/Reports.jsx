import { useState } from 'react'
import { Link } from 'react-router'
import {
  Flag,
  Check,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  User,
} from 'lucide-react'
import { useReports, useResolveReport } from '../../hooks/useReports'
import Skeleton from '../../components/ui/Skeleton'

const STATUSES = ['open', 'resolved', 'dismissed']

const TYPE_LABELS = {
  script: 'Script',
  comment: 'Comment',
  hub: 'Hub',
  user: 'User',
}

const REASON_LABELS = {
  spam: 'Spam',
  harassment: 'Harassment',
  inappropriate: 'Inappropriate',
  malicious_code: 'Malicious code',
  copyright: 'Copyright',
  other: 'Other',
}

const timeAgo = (dateStr) => {
  if (!dateStr) return ''
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days}d ago`
  return `${Math.floor(days / 30)}mo ago`
}

const ReportRow = ({ report, onResolve, busy }) => {
  const reporter = report.reporter
  const reporterName =
    reporter?.nickname || reporter?.username || reporter?.name || 'Unknown'

  return (
    <tr className="hover:bg-white/[0.02] transition-colors align-top">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          {reporter?.photoURL ? (
            <img
              src={reporter.photoURL}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-edge"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-ground border border-edge flex items-center justify-center">
              <User size={13} className="text-muted" />
            </div>
          )}
          <span className="text-sm text-foreground whitespace-nowrap">
            {reporterName}
          </span>
        </div>
      </td>

      <td className="px-4 py-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] uppercase tracking-wider text-muted">
            {TYPE_LABELS[report.targetType] ?? report.targetType}
          </span>
          {report.target?.link ? (
            <Link
              to={report.target.link}
              target="_blank"
              className="text-sm text-foreground hover:underline flex items-center gap-1 max-w-xs truncate"
            >
              <span className="truncate">{report.target.label}</span>
              <ExternalLink size={11} className="shrink-0 text-muted" />
            </Link>
          ) : (
            <span className="text-sm text-muted italic max-w-xs truncate">
              {report.target?.label ?? '(deleted)'}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <span className="inline-flex items-center px-2 py-0.5 rounded-sm bg-white/5 border border-edge text-[11px] font-medium text-foreground/80 whitespace-nowrap">
          {REASON_LABELS[report.reason] ?? report.reason}
        </span>
      </td>

      <td className="px-4 py-3 max-w-sm">
        {report.details ? (
          <p className="text-xs text-muted/90 leading-relaxed line-clamp-3">
            {report.details}
          </p>
        ) : (
          <span className="text-xs text-muted/40">—</span>
        )}
      </td>

      <td className="px-4 py-3 text-xs text-muted whitespace-nowrap">
        {timeAgo(report.createdAt)}
      </td>

      <td className="px-4 py-3">
        {report.status === 'open' ? (
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => onResolve(report.id, 'resolved')}
              disabled={busy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 transition-colors disabled:opacity-40"
              title="Mark as resolved"
            >
              <Check size={12} />
              Resolve
            </button>
            <button
              onClick={() => onResolve(report.id, 'dismissed')}
              disabled={busy}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[11px] font-medium bg-white/5 text-muted hover:text-foreground hover:bg-white/10 transition-colors disabled:opacity-40"
              title="Dismiss as not actionable"
            >
              <X size={12} />
              Dismiss
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-end gap-0.5">
            <span
              className={`text-[10px] uppercase tracking-wider font-medium ${
                report.status === 'resolved'
                  ? 'text-emerald-400'
                  : 'text-muted'
              }`}
            >
              {report.status}
            </span>
            {report.resolvedBy && (
              <span className="text-[10px] text-muted/60 whitespace-nowrap">
                by{' '}
                {report.resolvedBy.nickname ||
                  report.resolvedBy.username ||
                  report.resolvedBy.name}
              </span>
            )}
          </div>
        )}
      </td>
    </tr>
  )
}

const Reports = () => {
  const [status, setStatus] = useState('open')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const limit = 25

  const { data, isLoading, isFetching } = useReports({
    status,
    type: type || undefined,
    page,
    limit,
  })

  const resolveMutation = useResolveReport()

  const handleResolve = (id, nextStatus) => {
    resolveMutation.mutate({ id, status: nextStatus })
  }

  const items = data?.items ?? []
  const counts = data?.counts ?? { open: 0, resolved: 0, dismissed: 0 }
  const total = data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / limit))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
          <Flag size={18} className="text-amber-400" />
          Reports
        </h2>
        <p className="text-sm text-muted">
          Moderate reported content from across the platform.
        </p>
      </div>

      {/* Status tabs */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1 bg-surface border border-edge rounded-sm p-1">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-sm text-xs font-medium transition-colors capitalize flex items-center gap-1.5 ${
                status === s
                  ? 'bg-white text-black'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {s}
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                  status === s
                    ? 'bg-black/10 text-black/70'
                    : 'bg-white/5 text-muted'
                }`}
              >
                {counts[s] ?? 0}
              </span>
            </button>
          ))}
        </div>

        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value)
            setPage(1)
          }}
          className="bg-surface border border-edge rounded-sm text-xs text-foreground px-3 py-2 outline-none focus:border-edge-hover transition-colors"
        >
          <option value="">All types</option>
          <option value="script">Scripts</option>
          <option value="comment">Comments</option>
          <option value="hub">Hubs</option>
          <option value="user">Users</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <Skeleton className="h-64 rounded-md" />
      ) : items.length === 0 ? (
        <div className="bg-surface border border-edge rounded-md p-12 text-center">
          <AlertTriangle size={36} className="mx-auto mb-3 text-muted/30" />
          <p className="text-sm text-muted">
            No {status} reports{type ? ` for ${TYPE_LABELS[type]?.toLowerCase()}s` : ''}.
          </p>
        </div>
      ) : (
        <div
          className={`bg-surface border border-edge rounded-md overflow-hidden transition-opacity ${
            isFetching ? 'opacity-60' : ''
          }`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-edge text-left">
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Reporter
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Target
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    Details
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted">
                    When
                  </th>
                  <th className="px-4 py-3 text-xs font-medium text-muted text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-edge">
                {items.map((report) => (
                  <ReportRow
                    key={report.id}
                    report={report}
                    onResolve={handleResolve}
                    busy={resolveMutation.isPending}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            Page {page} of {totalPages} — {total} total
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="p-2 rounded-sm bg-surface border border-edge text-muted hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="p-2 rounded-sm bg-surface border border-edge text-muted hover:text-foreground disabled:opacity-30 transition-colors"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Reports

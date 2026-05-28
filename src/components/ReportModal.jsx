import { useEffect, useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { useCreateReport } from '../hooks/useReports'
import { useAuthStore } from '../hooks/useAuthStore'
import { useEscapeKey } from '../hooks/useEscapeKey'
import { toast } from '../hooks/useToastStore'

const REASONS = [
  { value: 'spam', label: 'Spam', appliesTo: ['script', 'comment', 'hub', 'user'] },
  { value: 'harassment', label: 'Harassment or hate', appliesTo: ['comment', 'user'] },
  { value: 'inappropriate', label: 'Inappropriate / NSFW', appliesTo: ['script', 'comment', 'hub', 'user'] },
  { value: 'malicious_code', label: 'Malicious code / backdoor', appliesTo: ['script'] },
  { value: 'copyright', label: 'Copyright infringement', appliesTo: ['script', 'hub'] },
  { value: 'other', label: 'Other (describe below)', appliesTo: ['script', 'comment', 'hub', 'user'] },
]

const ReportModalBody = ({ onClose, targetType, targetId, targetLabel }) => {
  const mutation = useCreateReport()
  const [reason, setReason] = useState('spam')
  const [details, setDetails] = useState('')

  useEscapeKey(onClose)

  const handleSubmit = () => {
    mutation.mutate(
      { targetType, targetId, reason, details: details.trim() || undefined },
      {
        onSuccess: () => {
          toast.success('Report submitted. Our moderators will review it.')
          onClose?.()
        },
      }
    )
  }

  const available = REASONS.filter((r) => r.appliesTo.includes(targetType))
  const errorMessage =
    mutation.error?.response?.data?.error || mutation.error?.message

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-surface border border-edge rounded-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-edge">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-amber-400" />
            <h2 className="text-sm font-semibold text-foreground">Report</h2>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
            {targetLabel && (
              <div className="text-xs text-muted">
                Reporting:{' '}
                <span className="text-foreground/80 font-medium">
                  {targetLabel}
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Reason
              </label>
              <div className="space-y-1.5">
                {available.map((r) => (
                  <label
                    key={r.value}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-sm border cursor-pointer transition-colors ${
                      reason === r.value
                        ? 'border-edge-hover bg-white/5'
                        : 'border-edge hover:bg-white/5'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reason"
                      value={r.value}
                      checked={reason === r.value}
                      onChange={(e) => setReason(e.target.value)}
                      className="accent-white"
                    />
                    <span className="text-sm text-foreground">{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-2">
                Details{' '}
                <span className="text-muted font-normal">
                  (optional, max 1000)
                </span>
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value.slice(0, 1000))}
                rows={3}
                placeholder="Anything specific the moderators should know?"
                className="w-full bg-ground border border-edge rounded-sm text-sm text-foreground placeholder:text-muted px-3 py-2 outline-none focus:border-edge-hover transition-colors resize-none"
              />
              <div className="text-[10px] text-muted/60 mt-1 text-right">
                {details.length}/1000
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs text-red-400">{errorMessage}</p>
            )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={mutation.isPending}
              className="px-4 py-2 text-sm font-medium bg-white text-black rounded-sm hover:bg-white/90 disabled:opacity-50 transition-colors"
            >
              {mutation.isPending ? 'Submitting…' : 'Submit report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ReportModal = ({ open, onClose, targetType, targetId, targetLabel }) => {
  const { isAuthenticated, signIn } = useAuthStore()

  useEffect(() => {
    if (open && !isAuthenticated) {
      onClose?.()
      signIn()
    }
  }, [open, isAuthenticated, onClose, signIn])

  if (!open || !isAuthenticated) return null

  return (
    <ReportModalBody
      onClose={onClose}
      targetType={targetType}
      targetId={targetId}
      targetLabel={targetLabel}
    />
  )
}

export default ReportModal

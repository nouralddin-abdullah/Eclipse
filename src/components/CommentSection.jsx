import { useState } from 'react'
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Send,
  User,
  Trash2,
  Flag,
} from 'lucide-react'
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useReactToComment,
} from '../hooks/useComments'
import { useAuthStore } from '../hooks/useAuthStore'
import ReportModal from './ReportModal'

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

const Comment = ({ comment, isReply, onVote, onReply, onDelete, onReport, canDelete }) => {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')

  const submitReply = () => {
    const text = replyText.trim()
    if (!text) return
    onReply?.(comment.id, text)
    setReplyText('')
    setShowReplyInput(false)
  }

  const author =
    comment.user?.nickname ||
    comment.user?.username ||
    'Anonymous'

  return (
    <div className={isReply ? 'ml-8 pl-4 border-l border-edge/50' : ''}>
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-surface border border-edge flex items-center justify-center shrink-0">
          {comment.user?.photoURL ? (
            <img
              src={comment.user.photoURL}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={14} className="text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {author}
            </span>
            <span className="text-xs text-muted">
              {timeAgo(comment.createdAt)}
            </span>
          </div>

          <p className="text-sm text-foreground/80 mt-1 leading-relaxed whitespace-pre-wrap">
            {comment.text}
          </p>

          <div className="flex items-center gap-4 mt-2">
            <button
              onClick={() => onVote?.(comment.id, 'like')}
              className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                comment.userVote === 'like'
                  ? 'text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <ThumbsUp size={13} />
              <span>{comment.upvotes}</span>
            </button>
            <button
              onClick={() => onVote?.(comment.id, 'dislike')}
              className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                comment.userVote === 'dislike'
                  ? 'text-foreground'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              <ThumbsDown size={13} />
              <span>{comment.downvotes}</span>
            </button>
            {!isReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors duration-200"
              >
                <MessageSquare size={13} />
                Reply
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete?.(comment.id)}
                className="flex items-center gap-1 text-xs text-muted hover:text-red-400 transition-colors duration-200"
                title="Delete"
              >
                <Trash2 size={13} />
              </button>
            )}
            <button
              onClick={() => onReport?.(comment)}
              className="flex items-center gap-1 text-xs text-muted hover:text-foreground transition-colors duration-200"
              title="Report"
            >
              <Flag size={13} />
            </button>
          </div>

          {showReplyInput && (
            <div className="flex items-center gap-2 mt-3">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && submitReply()}
                placeholder="Write a reply..."
                className="flex-1 bg-surface border border-edge rounded-sm text-sm text-foreground placeholder:text-muted px-3 py-2 outline-none focus:border-edge-hover transition-colors duration-200"
                autoFocus
              />
              <button
                onClick={submitReply}
                disabled={!replyText.trim()}
                className="p-2 text-muted hover:text-foreground disabled:opacity-30 transition-colors duration-200"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const CommentSection = ({ scriptId }) => {
  const { user, isAuthenticated, signIn } = useAuthStore()
  const { data: comments = [], isLoading } = useComments(scriptId)
  const createMutation = useCreateComment(scriptId)
  const deleteMutation = useDeleteComment(scriptId)
  const reactMutation = useReactToComment(scriptId)

  const [newComment, setNewComment] = useState('')
  const [expandedReplies, setExpandedReplies] = useState(new Set())
  const [reportTarget, setReportTarget] = useState(null)

  const toggleReplies = (commentId) =>
    setExpandedReplies((prev) => {
      const next = new Set(prev)
      next.has(commentId) ? next.delete(commentId) : next.add(commentId)
      return next
    })

  const canDelete = (comment) => {
    if (!user) return false
    if (comment.user?.id === user.id) return true
    return user.role === 'admin' || user.role === 'moderator'
  }

  const handleVote = (id, type) => {
    if (!isAuthenticated) return signIn()
    reactMutation.mutate({ id, type })
  }

  const handleReply = (parentId, text) => {
    if (!isAuthenticated) return signIn()
    createMutation.mutate({ text, parentId })
    setExpandedReplies((prev) => new Set([...prev, parentId]))
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete this comment?')) return
    deleteMutation.mutate(id)
  }

  const handleNewComment = () => {
    if (!isAuthenticated) return signIn()
    const text = newComment.trim()
    if (!text) return
    createMutation.mutate({ text })
    setNewComment('')
  }

  const handleReport = (comment) => {
    if (!isAuthenticated) return signIn()
    setReportTarget(comment)
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-foreground mb-6">
        Comments
        <span className="text-sm font-normal text-muted ml-2">
          ({comments.length})
        </span>
      </h2>

      {/* New comment input */}
      <div className="flex gap-3 mb-8">
        <div className="w-8 h-8 rounded-full bg-surface border border-edge flex items-center justify-center shrink-0">
          <User size={14} className="text-muted" />
        </div>
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleNewComment()}
            placeholder={isAuthenticated ? 'Add a comment...' : 'Sign in to comment'}
            className="flex-1 bg-surface border border-edge rounded-sm text-sm text-foreground placeholder:text-muted px-4 py-2.5 outline-none focus:border-edge-hover transition-colors duration-200"
          />
          <button
            onClick={handleNewComment}
            disabled={!newComment.trim() || createMutation.isPending}
            className="flex items-center gap-2 bg-white text-black text-sm font-medium px-4 py-2.5 rounded-sm hover:bg-white/90 disabled:opacity-30 transition-all duration-200"
          >
            <Send size={14} />
            Post
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {isLoading && (
          <p className="text-center text-muted text-sm py-4">Loading comments…</p>
        )}

        {!isLoading && comments.length === 0 && (
          <p className="text-center text-muted text-sm py-8">
            No comments yet. Be the first to share your thoughts.
          </p>
        )}

        {comments.map((comment) => (
          <div key={comment.id}>
            <Comment
              comment={comment}
              onVote={handleVote}
              onReply={handleReply}
              onDelete={handleDelete}
              onReport={handleReport}
              canDelete={canDelete(comment)}
            />

            {comment.replies?.length > 0 && (
              <div className="ml-11 mt-2">
                <button
                  onClick={() => toggleReplies(comment.id)}
                  className="flex items-center gap-1 text-xs font-medium text-muted hover:text-foreground transition-colors duration-200 mb-3"
                >
                  {expandedReplies.has(comment.id) ? (
                    <>
                      <ChevronUp size={14} />
                      Hide replies ({comment.replies.length})
                    </>
                  ) : (
                    <>
                      <ChevronDown size={14} />
                      View replies ({comment.replies.length})
                    </>
                  )}
                </button>

                {expandedReplies.has(comment.id) && (
                  <div className="space-y-4">
                    {comment.replies.map((reply) => (
                      <Comment
                        key={reply.id}
                        comment={reply}
                        isReply
                        onVote={handleVote}
                        onDelete={handleDelete}
                        onReport={handleReport}
                        canDelete={canDelete(reply)}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <ReportModal
        open={!!reportTarget}
        onClose={() => setReportTarget(null)}
        targetType="comment"
        targetId={reportTarget?.id}
        targetLabel={reportTarget?.text?.slice(0, 80)}
      />
    </div>
  )
}

export default CommentSection

import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft } from 'lucide-react'
import { useHubs } from '../../hooks/useHubs'
import { useScripts } from '../../hooks/useScripts'
import {
  useShowcase,
  useCreateShowcase,
  useUpdateShowcase,
} from '../../hooks/useShowcases'

const ShowcaseForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const { data: hubs = [] } = useHubs({ limit: 100 })
  const { data: scripts = [] } = useScripts({ limit: 100 })
  const { data: existing, isLoading } = useShowcase(id)
  const createMutation = useCreateShowcase()
  const updateMutation = useUpdateShowcase()
  const saving = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      title: '',
      youtubeId: '',
      publishDate: '',
      hubIds: [],
      scriptIds: [],
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title || '',
        youtubeId: existing.youtubeId || '',
        publishDate: existing.publishDate
          ? existing.publishDate.slice(0, 10)
          : '',
        hubIds: existing.hubIds || [],
        scriptIds: existing.scriptIds || [],
      })
    }
  }, [existing, reset])

  const youtubeId = watch('youtubeId')
  const selectedHubIds = watch('hubIds') || []
  const selectedScriptIds = watch('scriptIds') || []

  const thumbnailUrl = youtubeId
    ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
    : ''

  const toggleArrayValue = (field, currentValues, value) => {
    const next = currentValues.includes(value)
      ? currentValues.filter((v) => v !== value)
      : [...currentValues, value]
    setValue(field, next)
  }

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      youtubeId: data.youtubeId || null,
      publishDate: data.publishDate || null,
      hubIds: data.hubIds || [],
      scriptIds: data.scriptIds || [],
    }
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate('/dashboard/showcases')
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to save showcase'
      )
    }
  }

  if (isEditing && !isLoading && !existing) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted">Showcase not found.</p>
        <Link
          to="/dashboard/showcases"
          className="text-sm text-foreground underline mt-2 inline-block"
        >
          Back to Showcases
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          to="/dashboard/showcases"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Back to Showcases
        </Link>
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Showcase' : 'New Showcase'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Title
          </label>
          <input
            {...register('title', { required: true })}
            type="text"
            placeholder="Showcase title"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
        </div>

        {/* YouTube Video ID */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            YouTube Video ID
          </label>
          <input
            {...register('youtubeId')}
            type="text"
            placeholder="e.g. dQw4w9WgXcQ"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
          {thumbnailUrl && (
            <div className="mt-3">
              <img
                src={thumbnailUrl}
                alt="YouTube thumbnail preview"
                className="w-full max-w-sm h-auto rounded-sm border border-edge"
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            </div>
          )}
        </div>

        {/* Publish Date */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Publish Date
          </label>
          <input
            {...register('publishDate')}
            type="date"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
        </div>

        {/* Attach Hubs */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Attach Hubs
          </label>
          <div className="bg-surface border border-edge rounded-sm p-3 space-y-2 max-h-48 overflow-y-auto">
            {hubs.length === 0 ? (
              <p className="text-xs text-muted">No hubs available.</p>
            ) : (
              hubs.map((hub) => (
                <label
                  key={hub.id}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedHubIds.includes(hub.id)}
                    onChange={() =>
                      toggleArrayValue('hubIds', selectedHubIds, hub.id)
                    }
                    className="w-4 h-4 rounded-sm border-edge bg-surface accent-white"
                  />
                  <span className="text-sm text-foreground">{hub.name}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Attach Scripts */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Attach Scripts
          </label>
          <div className="bg-surface border border-edge rounded-sm p-3 space-y-2 max-h-48 overflow-y-auto">
            {scripts.length === 0 ? (
              <p className="text-xs text-muted">No scripts available.</p>
            ) : (
              scripts.map((script) => (
                <label
                  key={script.id}
                  className="flex items-center gap-2.5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedScriptIds.includes(script.id)}
                    onChange={() =>
                      toggleArrayValue(
                        'scriptIds',
                        selectedScriptIds,
                        script.id
                      )
                    }
                    className="w-4 h-4 rounded-sm border-edge bg-surface accent-white"
                  />
                  <span className="text-sm text-foreground">
                    {script.title}
                    <span className="text-muted ml-1.5 text-xs">
                      ({script.targetGame})
                    </span>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-sm text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isEditing ? 'Update Showcase' : 'Create Showcase'}
          </button>
          <Link
            to="/dashboard/showcases"
            className="inline-flex items-center px-5 py-2.5 bg-surface border border-edge rounded-sm text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ShowcaseForm

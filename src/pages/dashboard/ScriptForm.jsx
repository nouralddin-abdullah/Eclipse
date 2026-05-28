import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft } from 'lucide-react'
import { useHubs } from '../../hooks/useHubs'
import {
  useScript,
  useCreateScript,
  useUpdateScript,
} from '../../hooks/useScripts'
import ImageUpload from '../../components/dashboard/ImageUpload'
import GameSearchPicker from '../../components/dashboard/GameSearchPicker'

const ScriptForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const { data: hubs = [] } = useHubs({ limit: 100 })
  const { data: existing, isLoading } = useScript(id)
  const createMutation = useCreateScript()
  const updateMutation = useUpdateScript()
  const saving = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      targetGame: '',
      gameId: '',
      hubId: '',
      code: '',
      hasKey: false,
      isPatched: false,
      imageKey: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        title: existing.title || '',
        description: existing.description || '',
        targetGame: existing.targetGame || '',
        gameId: existing.gameId || '',
        hubId: existing.hubId || '',
        code: existing.code || '',
        hasKey: existing.hasKey || false,
        isPatched: existing.isPatched || false,
        imageKey: existing.imageKey || '',
        imageUrl: existing.imageUrl || '',
      })
    }
  }, [existing, reset])

  const imageKey = watch('imageKey')
  const imageUrl = watch('imageUrl')
  const targetGame = watch('targetGame')
  const gameId = watch('gameId')

  const onSubmit = async (data) => {
    const payload = {
      title: data.title,
      description: data.description || null,
      targetGame: data.targetGame || null,
      gameId: data.gameId || null,
      hubId: data.hubId || null,
      code: data.code || '',
      hasKey: !!data.hasKey,
      isPatched: !!data.isPatched,
      imageKey: data.imageKey || null,
    }
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate('/dashboard/scripts')
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to save script'
      )
    }
  }

  if (isEditing && !isLoading && !existing) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted">Script not found.</p>
        <Link
          to="/dashboard/scripts"
          className="text-sm text-foreground underline mt-2 inline-block"
        >
          Back to Scripts
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          to="/dashboard/scripts"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Back to Scripts
        </Link>
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Script' : 'New Script'}
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
            placeholder="Script title"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            placeholder="What does this script do?"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none resize-none"
          />
        </div>

        {/* Target Game — searches Roblox and auto-fills the universeId */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Target Game
          </label>
          <GameSearchPicker
            value={targetGame}
            gameId={gameId}
            onChange={({ name, gameId: id }) => {
              setValue('targetGame', name, { shouldDirty: true })
              setValue('gameId', id, { shouldDirty: true })
            }}
          />
          <p className="text-[11px] text-muted mt-1.5">
            Universe ID is captured automatically from the selected game.
          </p>
        </div>

        {/* Hub */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Hub
          </label>
          <select
            {...register('hubId')}
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          >
            <option value="">Select a hub</option>
            {hubs.map((hub) => (
              <option key={hub.id} value={hub.id}>
                {hub.name}
              </option>
            ))}
          </select>
        </div>

        {/* Code */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Code
          </label>
          <textarea
            {...register('code')}
            rows={10}
            placeholder="-- Paste your script code here"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm font-mono focus:border-edge-hover focus:outline-none resize-y"
          />
        </div>

        {/* Toggles */}
        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('hasKey')}
              className="w-4 h-4 rounded-sm border-edge bg-surface accent-white"
            />
            <span className="text-sm text-foreground">Has Key System</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              {...register('isPatched')}
              className="w-4 h-4 rounded-sm border-edge bg-surface accent-white"
            />
            <span className="text-sm text-foreground">Is Patched</span>
          </label>
        </div>

        {/* Image */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Image
          </label>
          <ImageUpload
            folder="scripts"
            value={imageKey}
            previewUrl={imageUrl}
            onChange={({ key, url }) => {
              setValue('imageKey', key || '')
              setValue('imageUrl', url || '')
            }}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-sm text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isEditing ? 'Update Script' : 'Create Script'}
          </button>
          <Link
            to="/dashboard/scripts"
            className="inline-flex items-center px-5 py-2.5 bg-surface border border-edge rounded-sm text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default ScriptForm

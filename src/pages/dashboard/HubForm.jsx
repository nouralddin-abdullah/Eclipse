import { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { useForm } from 'react-hook-form'
import { Save, ArrowLeft } from 'lucide-react'
import { useHub, useCreateHub, useUpdateHub } from '../../hooks/useHubs'
import ImageUpload from '../../components/dashboard/ImageUpload'

const HubForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = !!id

  const { data: existing, isLoading } = useHub(id)
  const createMutation = useCreateHub()
  const updateMutation = useUpdateHub()
  const saving = createMutation.isPending || updateMutation.isPending

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      description: '',
      status: 'online',
      discordUrl: '',
      websiteUrl: '',
      imageKey: '',
      imageUrl: '',
    },
  })

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name || '',
        description: existing.description || '',
        status: existing.status || 'online',
        discordUrl: existing.discordUrl || '',
        websiteUrl: existing.websiteUrl || '',
        imageKey: existing.imageKey || '',
        imageUrl: existing.imageUrl || '',
      })
    }
  }, [existing, reset])

  const imageKey = watch('imageKey')
  const imageUrl = watch('imageUrl')

  const onSubmit = async (data) => {
    const payload = {
      name: data.name,
      description: data.description || null,
      status: data.status,
      discordUrl: data.discordUrl || null,
      websiteUrl: data.websiteUrl || null,
      imageKey: data.imageKey || null,
    }
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({ id, data: payload })
      } else {
        await createMutation.mutateAsync(payload)
      }
      navigate('/dashboard/hubs')
    } catch (err) {
      alert(
        err.response?.data?.message ||
          err.response?.data?.error ||
          'Failed to save hub'
      )
    }
  }

  if (isEditing && !isLoading && !existing) {
    return (
      <div className="text-center py-12">
        <p className="text-sm text-muted">Hub not found.</p>
        <Link
          to="/dashboard/hubs"
          className="text-sm text-foreground underline mt-2 inline-block"
        >
          Back to Hubs
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <Link
          to="/dashboard/hubs"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-3"
        >
          <ArrowLeft size={14} />
          Back to Hubs
        </Link>
        <h2 className="text-lg font-semibold text-foreground">
          {isEditing ? 'Edit Hub' : 'New Hub'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Name
          </label>
          <input
            {...register('name', { required: true })}
            type="text"
            placeholder="Hub name"
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
            placeholder="Brief description of this hub"
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none resize-none"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Status
          </label>
          <select
            {...register('status')}
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          >
            <option value="online">Online</option>
            <option value="updating">Updating</option>
            <option value="offline">Offline</option>
          </select>
        </div>

        {/* Discord URL */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Discord URL
          </label>
          <input
            {...register('discordUrl')}
            type="text"
            placeholder="https://discord.gg/..."
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
        </div>

        {/* Website URL */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Website URL
          </label>
          <input
            {...register('websiteUrl')}
            type="text"
            placeholder="https://..."
            className="w-full bg-surface border border-edge rounded-sm text-foreground px-3 py-2.5 text-sm focus:border-edge-hover focus:outline-none"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-xs font-medium text-muted mb-1.5">
            Image
          </label>
          <ImageUpload
            folder="hubs"
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
            {isEditing ? 'Update Hub' : 'Create Hub'}
          </button>
          <Link
            to="/dashboard/hubs"
            className="inline-flex items-center px-5 py-2.5 bg-surface border border-edge rounded-sm text-sm text-muted hover:text-foreground transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default HubForm

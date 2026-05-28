import { useRef, useState } from 'react'
import { Camera, Loader2, User as UserIcon } from 'lucide-react'
import { uploadImage } from '../lib/api'

const AvatarUpload = ({ value, onChange, size = 64 }) => {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Please choose an image')
      return
    }
    setUploading(true)
    setError('')
    try {
      const { url } = await uploadImage({ file, folder: 'avatars' })
      onChange(url)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Upload failed'
      )
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={() => !uploading && fileRef.current?.click()}
        disabled={uploading}
        className="relative group rounded-full overflow-hidden border border-edge bg-surface flex items-center justify-center"
        style={{ width: size, height: size }}
        title="Change profile picture"
      >
        {value ? (
          <img src={value} alt="" className="w-full h-full object-cover" />
        ) : (
          <UserIcon size={Math.round(size * 0.45)} className="text-muted" />
        )}

        <div
          className={`absolute inset-0 flex items-center justify-center bg-black/60 transition-opacity ${
            uploading ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          {uploading ? (
            <Loader2 size={Math.round(size * 0.32)} className="text-white animate-spin" />
          ) : (
            <Camera size={Math.round(size * 0.32)} className="text-white" />
          )}
        </div>
      </button>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

export default AvatarUpload

import { useState, useRef } from 'react'
import { Upload, Link2, X, ImageIcon, Loader2 } from 'lucide-react'
import { uploadImage } from '../../lib/api'

/**
 * ImageUpload uploads either a local file or a remote URL to /api/upload.
 * The backend stores the binary in R2 and returns { key, url }.
 *
 * Props:
 *  - value: current imageKey (R2 object key) or null
 *  - previewUrl: current preview URL (for edit mode)
 *  - onChange({ key, url }): called when the upload succeeds
 */
const ImageUpload = ({ value, previewUrl, onChange, folder }) => {
  const [tab, setTab] = useState('upload')
  const [urlInput, setUrlInput] = useState('')
  const [preview, setPreview] = useState(previewUrl || '')
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const doUpload = async (payload) => {
    setUploading(true)
    setError('')
    try {
      const { key, url } = await uploadImage({ ...payload, folder })
      setPreview(url)
      onChange({ key, url })
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          err.message ||
          'Upload failed'
      )
    } finally {
      setUploading(false)
    }
  }

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    doUpload({ file })
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer?.files?.[0]
    handleFile(file)
  }

  const handleUrlSubmit = () => {
    const url = urlInput.trim()
    if (!url) return
    doUpload({ url })
  }

  const handleClear = () => {
    setPreview('')
    setUrlInput('')
    setError('')
    onChange({ key: null, url: '' })
    if (fileRef.current) fileRef.current.value = ''
  }

  const currentPreview = preview || previewUrl

  return (
    <div className="space-y-3">
      {/* Tab switcher */}
      <div className="flex gap-1 bg-ground rounded-sm p-0.5">
        <button
          type="button"
          onClick={() => setTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            tab === 'upload'
              ? 'bg-surface text-foreground'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Upload size={14} />
          Upload
        </button>
        <button
          type="button"
          onClick={() => setTab('url')}
          className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-sm text-xs font-medium transition-colors ${
            tab === 'url'
              ? 'bg-surface text-foreground'
              : 'text-muted hover:text-foreground'
          }`}
        >
          <Link2 size={14} />
          URL
        </button>
      </div>

      {/* Upload tab */}
      {tab === 'upload' && (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && fileRef.current?.click()}
          className={`border-2 border-dashed rounded-sm p-6 text-center transition-colors ${
            uploading
              ? 'border-edge cursor-wait'
              : dragOver
                ? 'border-foreground/40 bg-white/5 cursor-pointer'
                : 'border-edge hover:border-edge-hover cursor-pointer'
          }`}
        >
          {uploading ? (
            <Loader2 size={24} className="mx-auto mb-2 text-muted animate-spin" />
          ) : (
            <ImageIcon size={24} className="mx-auto mb-2 text-muted" />
          )}
          <p className="text-xs text-muted">
            {uploading
              ? 'Uploading…'
              : (
                <>
                  Drag & drop an image or{' '}
                  <span className="text-foreground underline">browse</span>
                </>
              )}
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            disabled={uploading}
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
        </div>
      )}

      {/* URL tab */}
      {tab === 'url' && (
        <div className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.png"
            disabled={uploading}
            className="flex-1 bg-surface border border-edge rounded-sm text-foreground text-sm px-3 py-2.5 focus:border-edge-hover focus:outline-none disabled:opacity-50"
          />
          <button
            type="button"
            onClick={handleUrlSubmit}
            disabled={uploading || !urlInput.trim()}
            className="px-3 py-2.5 bg-surface border border-edge rounded-sm text-sm text-foreground hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : 'Load'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* Preview */}
      {currentPreview && (
        <div className="relative group">
          <img
            src={currentPreview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-sm border border-edge"
            onError={(e) => {
              e.target.style.display = 'none'
            }}
          />
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 p-1 rounded-sm bg-ground/80 text-muted hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
          {value && (
            <p className="text-[10px] text-muted/60 mt-1 font-mono truncate">
              {value}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export default ImageUpload

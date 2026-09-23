import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Trash2, User, Loader2 } from 'lucide-react'

interface AvatarUploadProps {
  currentUrl?: string
  onUpload: (file: File) => Promise<string>
  onRemove?: () => Promise<void>
  size?: number
}

export function AvatarUpload({ currentUrl, onUpload, onRemove, size = 96 }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setError(null)
    setUploading(true)
    try {
      await onUpload(file)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }, [onUpload])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleRemove = async () => {
    if (!onRemove) return
    setError(null)
    setRemoving(true)
    try {
      await onRemove()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression')
    } finally {
      setRemoving(false)
    }
  }

  const busy = uploading || removing

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar circle */}
      <motion.button
        type="button"
        onClick={() => !busy && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className="relative rounded-full overflow-hidden cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-primary)] focus-visible:ring-offset-2"
        style={{ width: size, height: size }}
        whileHover={busy ? undefined : { scale: 1.03 }}
        whileTap={busy ? undefined : { scale: 0.97 }}
      >
        {/* Image or placeholder */}
        {currentUrl ? (
          <img
            src={currentUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--admin-surface)] flex items-center justify-center">
            <User size={size * 0.4} className="text-[var(--admin-text-muted)]" />
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {(dragOver || !busy) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                dragOver
                  ? 'bg-[var(--admin-primary)]/30 opacity-100'
                  : 'bg-black/0 group-hover:bg-black/40 opacity-0 group-hover:opacity-100'
              }`}
            >
              <Upload size={size * 0.22} className="text-white drop-shadow-md" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Busy spinner */}
        {busy && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Loader2 size={size * 0.25} className="text-white animate-spin" />
          </div>
        )}
      </motion.button>

      {/* Remove button */}
      {currentUrl && onRemove && !busy && (
        <button
          type="button"
          onClick={handleRemove}
          className="flex items-center gap-1.5 text-xs text-[var(--admin-text-muted)] hover:text-[var(--admin-danger)] transition-colors"
        >
          <Trash2 size={12} />
          Supprimer
        </button>
      )}

      {/* Hint */}
      <p className="text-[10px] text-[var(--admin-text-muted)] text-center leading-tight">
        JPEG, PNG, WebP ou GIF — max 2 Mo
      </p>

      {/* Error */}
      {error && (
        <p className="text-xs text-[var(--admin-danger)] text-center">{error}</p>
      )}

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}

import { supabase } from '@/lib/supabase'

const BUCKET = 'avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

const PUBLIC_MARKER = `/storage/v1/object/public/${BUCKET}/`

/**
 * Upload an avatar image to Supabase Storage. Returns the public URL.
 */
export async function uploadAvatar(file: File, userId: string): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Format non supporté. Utilisez JPEG, PNG, WebP ou GIF.')
  }
  if (file.size > MAX_SIZE) {
    throw new Error('Le fichier dépasse la taille maximale de 2 Mo.')
  }

  const ext = file.name.split('.').pop() ?? 'jpg'
  const path = `${userId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: '31536000',
    upsert: false,
  })
  if (error) throw error

  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
}

/**
 * Delete an avatar from Supabase Storage by its public URL.
 * Silently ignores files that are not in our bucket or already gone.
 */
export async function deleteAvatar(url: string): Promise<void> {
  const idx = url.indexOf(PUBLIC_MARKER)
  if (idx === -1) return
  const path = decodeURIComponent(url.slice(idx + PUBLIC_MARKER.length))
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error && !/not.?found/i.test(error.message)) throw error
}

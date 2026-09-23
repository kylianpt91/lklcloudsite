import { Globe } from 'lucide-react'

interface SERPPreviewProps {
  title: string
  description: string
  url: string
}

export function SERPPreview({ title, description, url }: SERPPreviewProps) {
  const truncTitle = title.length > 60 ? title.slice(0, 57) + '...' : title
  const truncDesc = description.length > 155 ? description.slice(0, 152) + '...' : description

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-[var(--admin-text-muted)] uppercase tracking-wider">Aperçu Google</p>
      <div className="rounded-xl border border-[var(--admin-border)] bg-white p-4 space-y-1 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-[#202124]">
          <div className="w-6 h-6 rounded-full bg-[#f1f3f4] flex items-center justify-center">
            <Globe size={12} className="text-[#5f6368]" />
          </div>
          <div>
            <p className="text-sm text-[#202124]">LKLCloud</p>
            <p className="text-xs text-[#4d5156]">{url || 'https://lklcloud.fr'}</p>
          </div>
        </div>
        <h3 className="text-lg text-[#1a0dab] font-normal leading-snug hover:underline cursor-pointer">
          {truncTitle || 'Titre de la page'}
        </h3>
        <p className="text-sm text-[#4d5156] leading-relaxed">
          {truncDesc || 'Description de la page qui apparaîtra dans les résultats de recherche Google.'}
        </p>
      </div>
    </div>
  )
}

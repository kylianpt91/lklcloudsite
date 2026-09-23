import Accordion from '@/components/ui/Accordion'

interface FAQPreviewProps {
  items: { question: string; answer: string }[]
}

export function FAQPreview({ items }: FAQPreviewProps) {
  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-neutral-medium">Aucune question à afficher</p>
      </div>
    )
  }

  return (
    <div className="px-6 py-4 bg-white">
      <Accordion items={items} />
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Code, Globe, Server, Database, Terminal, Braces, Wrench, ArrowRight } from 'lucide-react'
import Card from '@/components/ui/Card.tsx'
import Button from '@/components/ui/Button.tsx'

interface TechOption {
  id: string
  name: string
  icon: typeof Code
  slug: string
  productName: string
}

const techOptions: TechOption[] = [
  { id: 'wordpress', name: 'WordPress', icon: Globe, slug: 'plesk', productName: 'Hebergement Web' },
  { id: 'react-nextjs', name: 'React / Next.js', icon: Braces, slug: 'nodejs', productName: 'Hebergement Node.js' },
  { id: 'vue-nuxt', name: 'Vue / Nuxt', icon: Code, slug: 'nodejs', productName: 'Hebergement Node.js' },
  { id: 'django', name: 'Django', icon: Database, slug: 'python', productName: 'Hebergement Python' },
  { id: 'laravel', name: 'Laravel', icon: Server, slug: 'plesk', productName: 'Hebergement Web' },
  { id: 'nodejs', name: 'Node.js / Express', icon: Terminal, slug: 'nodejs', productName: 'Hebergement Node.js' },
  { id: 'custom', name: 'Personnalise', icon: Wrench, slug: 'vps-linux', productName: 'VPS Linux' },
]

export default function StackDetector() {
  const [selected, setSelected] = useState<string | null>(null)

  const selectedTech = techOptions.find((t) => t.id === selected)

  return (
    <Card variant="glass" className="p-8">
      <h3 className="text-lg font-bold text-neutral-dark mb-2">
        Quel CMS / framework utilisez-vous ?
      </h3>
      <p className="text-sm text-neutral-medium mb-8">
        Selectionnez votre technologie pour recevoir une recommandation adaptee
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {techOptions.map((tech) => {
          const Icon = tech.icon
          const isSelected = selected === tech.id

          return (
            <motion.button
              key={tech.id}
              whileTap={{ scale: 0.95 }}
              animate={{
                scale: isSelected ? 1.05 : 1,
                borderColor: isSelected ? '#FF6A30' : 'rgba(229, 229, 229, 0.5)',
              }}
              transition={{ duration: 0.2, ease: 'easeOut' as const }}
              onClick={() => setSelected(tech.id)}
              className={[
                'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors duration-200 cursor-pointer',
                isSelected ? 'bg-primary/5 shadow-sm' : 'hover:bg-neutral-light/50',
              ].join(' ')}
            >
              <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-neutral-medium'}`} />
              <span className={[
                'text-xs font-semibold text-center',
                isSelected ? 'text-primary' : 'text-neutral-dark',
              ].join(' ')}>
                {tech.name}
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {selectedTech && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 border border-primary/20">
              <p className="text-sm text-neutral-medium mb-3">
                Pour <span className="font-semibold text-neutral-dark">{selectedTech.name}</span>, nous recommandons :
              </p>
              <p className="text-xl font-bold text-neutral-dark mb-4">{selectedTech.productName}</p>
              <Button
                variant="primary"
                size="md"
                href={`/products/${selectedTech.slug}`}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Voir les offres {selectedTech.productName}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

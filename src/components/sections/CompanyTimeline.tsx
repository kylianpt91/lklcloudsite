import { motion } from 'framer-motion'
import SectionTitle from '@/components/ui/SectionTitle'
import { companyTimeline } from '@/data/timeline'

const lineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const cardLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const cardRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

const dotVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const,
    },
  },
}

const currentYear = new Date().getFullYear().toString()

export default function CompanyTimeline() {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' as const }}
        >
          <SectionTitle
            title="Notre histoire"
            subtitle="L'évolution de LKL Cloud"
            centered
            gradient
          />
        </motion.div>

        <div className="mt-16 relative">
          {/* Central vertical line */}
          <motion.div
            className="absolute left-1/2 top-0 bottom-0 w-px bg-neutral-gray/30 -translate-x-1/2 origin-top hidden md:block"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            aria-hidden="true"
          />

          {/* Mobile vertical line (left side) */}
          <motion.div
            className="absolute left-6 top-0 bottom-0 w-px bg-neutral-gray/30 origin-top md:hidden"
            variants={lineVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            aria-hidden="true"
          />

          <div className="space-y-12 md:space-y-16">
            {companyTimeline.map((event, index) => {
              const isLeft = index % 2 === 0
              const isCurrent = event.year === currentYear
              const cardVariant = isLeft ? cardLeftVariants : cardRightVariants

              return (
                <div
                  key={event.year}
                  className="relative flex items-start md:items-center"
                >
                  {/* Mobile layout */}
                  <div className="md:hidden flex items-start gap-4 w-full">
                    {/* Dot */}
                    <motion.div
                      className="relative z-10 shrink-0"
                      variants={dotVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                          isCurrent
                            ? 'bg-primary text-white shadow-lg shadow-primary/30'
                            : 'bg-white border-2 border-neutral-gray/30 text-neutral-dark'
                        }`}
                      >
                        {event.year.slice(-2)}
                      </div>
                    </motion.div>

                    {/* Card */}
                    <motion.div
                      className={`glass rounded-2xl p-5 flex-1 ${
                        isCurrent ? 'border-l-4 border-primary' : ''
                      }`}
                      variants={cardRightVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <span
                        className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                          isCurrent
                            ? 'bg-primary/10 text-primary'
                            : 'bg-neutral-gray/20 text-neutral-medium'
                        }`}
                      >
                        {event.year}
                      </span>
                      <h3 className="font-semibold text-neutral-dark">
                        {event.title}
                      </h3>
                      <p className="text-sm text-neutral-medium mt-1 leading-relaxed">
                        {event.description}
                      </p>
                    </motion.div>
                  </div>

                  {/* Desktop layout */}
                  <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:gap-8 w-full items-center">
                    {/* Left content */}
                    <div className={isLeft ? '' : 'order-3'}>
                      {isLeft && (
                        <motion.div
                          className={`glass rounded-2xl p-6 text-right ${
                            isCurrent ? 'border-r-4 border-primary' : ''
                          }`}
                          variants={cardVariant}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          <span
                            className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                              isCurrent
                                ? 'bg-primary/10 text-primary'
                                : 'bg-neutral-gray/20 text-neutral-medium'
                            }`}
                          >
                            {event.year}
                          </span>
                          <h3 className="font-semibold text-neutral-dark">
                            {event.title}
                          </h3>
                          <p className="text-sm text-neutral-medium mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Center dot */}
                    <motion.div
                      className="relative z-10 order-2"
                      variants={dotVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <div
                        className={`w-4 h-4 rounded-full ${
                          isCurrent
                            ? 'bg-primary shadow-lg shadow-primary/30'
                            : 'bg-white border-2 border-neutral-gray/50'
                        }`}
                      />
                    </motion.div>

                    {/* Right content */}
                    <div className={isLeft ? 'order-3' : ''}>
                      {!isLeft && (
                        <motion.div
                          className={`glass rounded-2xl p-6 ${
                            isCurrent ? 'border-l-4 border-primary' : ''
                          }`}
                          variants={cardVariant}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          <span
                            className={`inline-block text-xs font-bold px-3 py-1 rounded-full mb-2 ${
                              isCurrent
                                ? 'bg-primary/10 text-primary'
                                : 'bg-neutral-gray/20 text-neutral-medium'
                            }`}
                          >
                            {event.year}
                          </span>
                          <h3 className="font-semibold text-neutral-dark">
                            {event.title}
                          </h3>
                          <p className="text-sm text-neutral-medium mt-1 leading-relaxed">
                            {event.description}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

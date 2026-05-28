import { motion } from 'motion/react'

const LegalLayout = ({ title, lastUpdated, children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="text-3xl font-bold text-foreground">{title}</h1>
      {lastUpdated && (
        <p className="mt-2 text-sm text-muted">Last updated: {lastUpdated}</p>
      )}
      <div className="prose prose-invert mt-8 space-y-6 text-sm leading-relaxed text-foreground/80 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-foreground [&_h2]:mt-8 [&_h2]:mb-3 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5">
        {children}
      </div>
    </div>
  </motion.div>
)

export default LegalLayout

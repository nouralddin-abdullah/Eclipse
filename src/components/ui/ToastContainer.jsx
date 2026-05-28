import { AnimatePresence, motion } from 'motion/react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useToastStore } from '../../hooks/useToastStore'

const icons = {
  success: { Icon: CheckCircle2, color: 'text-emerald-400' },
  error: { Icon: AlertCircle, color: 'text-red-400' },
  info: { Icon: Info, color: 'text-foreground' },
}

const ToastContainer = () => {
  const items = useToastStore((s) => s.items)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm pointer-events-none"
    >
      <AnimatePresence>
        {items.map((t) => {
          const { Icon, color } = icons[t.type] ?? icons.info
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.96 }}
              transition={{ duration: 0.18 }}
              className="pointer-events-auto bg-surface border border-edge rounded-md shadow-lg px-4 py-3 flex items-start gap-3"
            >
              <Icon size={16} className={`mt-0.5 shrink-0 ${color}`} />
              <p className="text-sm text-foreground flex-1 leading-snug">
                {t.message}
              </p>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-muted hover:text-foreground transition-colors mt-0.5"
              >
                <X size={14} />
              </button>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}

export default ToastContainer

import { motion } from 'motion/react'
import Button from '../components/ui/Button'
import SEO from '../components/SEO'

const NotFound = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="max-w-6xl mx-auto px-6 py-24 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <SEO title="Page Not Found" noIndex />
        <img
          src="/eclipse-logo.png"
          alt="Eclipse"
          className="w-16 h-16 opacity-40 mb-8"
        />
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="mt-4 text-muted text-lg">
          The page you&apos;re looking for doesn&apos;t exist
        </p>
        <Button variant="primary" to="/" className="mt-8">
          Back to Home
        </Button>
      </div>
    </motion.div>
  )
}

export default NotFound

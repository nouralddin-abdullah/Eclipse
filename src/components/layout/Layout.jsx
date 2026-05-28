import { Outlet, useLocation } from 'react-router'
import { AnimatePresence } from 'motion/react'
import Navbar from './Navbar'
import MobileNav from './MobileNav'
import Footer from './Footer'
import OnboardingModal from '../auth/OnboardingModal'
import CookieConsent from '../CookieConsent'
import ToastContainer from '../ui/ToastContainer'
import ErrorBoundary from '../ErrorBoundary'

const Layout = () => {
  const location = useLocation()

  return (
    <>
      <Navbar />
      <main className="pt-16 pb-20 md:pb-0 min-h-screen bg-ground">
        <ErrorBoundary key={location.pathname}>
          <AnimatePresence mode="wait">
            <Outlet key={location.pathname} />
          </AnimatePresence>
        </ErrorBoundary>
      </main>
      <Footer />
      <MobileNav />
      <OnboardingModal />
      <CookieConsent />
      <ToastContainer />
    </>
  )
}

export default Layout

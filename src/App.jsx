import { lazy, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './lib/queryClient'
import { useAuthStore } from './hooks/useAuthStore'

import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Hubs from './pages/Hubs'
import HubDetail from './pages/HubDetail'
import Scripts from './pages/Scripts'
import ScriptDetail from './pages/ScriptDetail'
import Showcases from './pages/Showcases'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Callback from './pages/auth/Callback'

import AdminGuard from './components/auth/AdminGuard'

const Privacy = lazy(() => import('./pages/legal/Privacy'))
const Terms = lazy(() => import('./pages/legal/Terms'))
const DMCA = lazy(() => import('./pages/legal/DMCA'))

const DashboardLayout = lazy(() => import('./components/dashboard/DashboardLayout'))
const Overview = lazy(() => import('./pages/dashboard/Overview'))
const HubsList = lazy(() => import('./pages/dashboard/HubsList'))
const HubForm = lazy(() => import('./pages/dashboard/HubForm'))
const ScriptsList = lazy(() => import('./pages/dashboard/ScriptsList'))
const ScriptForm = lazy(() => import('./pages/dashboard/ScriptForm'))
const ShowcasesList = lazy(() => import('./pages/dashboard/ShowcasesList'))
const ShowcaseForm = lazy(() => import('./pages/dashboard/ShowcaseForm'))
const Reports = lazy(() => import('./pages/dashboard/Reports'))

const App = () => {
  const hydrate = useAuthStore((s) => s.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth/callback" element={<Callback />} />

          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/showcases" element={<Showcases />} />
            <Route path="/hubs" element={<Hubs />} />
            <Route path="/hubs/:hubId" element={<HubDetail />} />
            <Route path="/scripts" element={<Scripts />} />
            <Route path="/scripts/:scriptId" element={<ScriptDetail />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/dmca" element={<DMCA />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AdminGuard />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Overview />} />
              <Route path="hubs" element={<HubsList />} />
              <Route path="hubs/new" element={<HubForm />} />
              <Route path="hubs/:id/edit" element={<HubForm />} />
              <Route path="scripts" element={<ScriptsList />} />
              <Route path="scripts/new" element={<ScriptForm />} />
              <Route path="scripts/:id/edit" element={<ScriptForm />} />
              <Route path="showcases" element={<ShowcasesList />} />
              <Route path="showcases/new" element={<ShowcaseForm />} />
              <Route path="showcases/:id/edit" element={<ShowcaseForm />} />
              <Route path="reports" element={<Reports />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App

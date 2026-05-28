import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '../../hooks/useAuthStore'

const Callback = () => {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const setTokenAndHydrate = useAuthStore((s) => s.setTokenAndHydrate)
  const didRunRef = useRef(false)

  useEffect(() => {
    if (didRunRef.current) return
    didRunRef.current = true

    const token = params.get('token')
    if (!token) {
      navigate('/?auth=failed', { replace: true })
      return
    }

    setTokenAndHydrate(token).then(() => {
      queryClient.invalidateQueries()
      navigate('/', { replace: true })
    })
  }, [params, navigate, queryClient, setTokenAndHydrate])

  return (
    <div className="min-h-screen flex items-center justify-center text-sm text-muted">
      Signing you in…
    </div>
  )
}

export default Callback

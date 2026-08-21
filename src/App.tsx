import { Navigate, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import { Atmosphere } from '@/components/atmosphere'
import { LandingPage } from '@/features/landing/landing-page'
import { DashboardShell } from '@/features/dashboard/dashboard-shell'

function DashboardRoute() {
  const { organizationId } = useParams<{ organizationId: string }>()
  if (!organizationId) return <Navigate to="/" replace />
  return <DashboardShell organizationId={organizationId} />
}

function LandingRoute() {
  const navigate = useNavigate()
  return (
    <LandingPage
      onAuthenticated={(organizationId) => {
        navigate(`/dashboard/${organizationId}`)
      }}
    />
  )
}

export function App() {
  return (
    <>
      <Atmosphere />
      {/*
        No transform/filter/opacity wrappers around pages —
        those create containing blocks and kill backdrop-filter.
      */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          <Route path="/dashboard/:organizationId" element={<DashboardRoute />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}

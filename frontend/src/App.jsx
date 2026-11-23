import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { BlurFade } from './components/reactbits'
import { Sidebar } from './components/layout/Sidebar'
import { Topbar } from './components/layout/Topbar'
import { OverviewPage } from './features/overview/OverviewPage'
import { PoliciesPage } from './features/policies/PoliciesPage'
import { ClaimsPage } from './features/claims/ClaimsPage'
import { SupportPage } from './features/support/SupportPage'
import { RecordModal } from './features/records/RecordModal'
import { useToast } from './hooks/useToast'
import { useWorkspace } from './hooks/useWorkspace'

export function App() {
  const [activeTab, setActiveTab] = useState('overview')
  const [modal, setModal] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { data, loading, error, refresh } = useWorkspace()
  const { message, showToast } = useToast()
  useEffect(() => {
    if (error) showToast(error)
  }, [error, showToast])
  if (loading || !data) return <LoadingState />
  const navigate = (tab) => {
    setActiveTab(tab)
    setMobileOpen(false)
  }
  const onSaved = () => {
    setModal(null)
    refresh()
    showToast('Record saved')
  }
  return (
    <div className="app-shell min-h-screen selection:bg-teal-200/60">
      <div className="fixed inset-0 -z-10 bg-grid opacity-60" />
      <Sidebar activeTab={activeTab} customer={data.customer} mobileOpen={mobileOpen} onNavigate={navigate} />
      {mobileOpen && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-[#001d1b]/45 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <main className="lg:pl-[258px]">
        <Topbar activeTab={activeTab} onRefresh={refresh} onMenu={() => setMobileOpen(true)} />
        <div className="px-5 pb-12 sm:px-8 lg:px-12">
          <BlurFade>{renderPage(activeTab, data, navigate, setModal)}</BlurFade>
        </div>
      </main>
      {modal && <RecordModal type={modal} onClose={() => setModal(null)} onSaved={onSaved} />}{' '}
      {message && (
        <div className="toast">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}
    </div>
  )
}

function renderPage(tab, data, navigate, openModal) {
  const pages = {
    overview: <OverviewPage data={data} onNavigate={navigate} />,
    policies: <PoliciesPage data={data} onAdd={() => openModal('policy')} />,
    claims: <ClaimsPage data={data} onAdd={() => openModal('claim')} />,
    support: <SupportPage data={data} onAdd={() => openModal('ticket')} />,
  }
  return pages[tab]
}
function LoadingState() {
  return (
    <div className="loading-screen">
      <div className="loading-panel">
        <div className="loading-art-wrap">
          <img src="/insureassist-loading.png" alt="Preparing insurance records" className="loading-art" />
        </div>
        <div className="loading-copy">
          <span className="loading-kicker">INSUREASSIST</span>
          <h1>Preparing your workspace</h1>
          <p>Connecting policies, claims, and support records.</p>
          <div className="loading-progress">
            <span />
          </div>
        </div>
      </div>
    </div>
  )
}

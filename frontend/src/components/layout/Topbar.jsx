import { Menu, RefreshCw } from 'lucide-react'
import { TABS, PAGE_COPY } from '../../lib/constants'

export function Topbar({ activeTab, onRefresh, onMenu }) {
  const [title, subtitle] = PAGE_COPY[activeTab]
  return (
    <header className="topbar">
      <button className="mr-3 rounded-xl border border-slate-200 bg-white p-2.5 lg:hidden" onClick={onMenu}>
        <Menu size={18} />
      </button>
      <div className="min-w-0 flex-1">
        <div className="eyebrow">
          INSURANCE OPERATIONS <span className="mx-2 text-teal-300">/</span>{' '}
          {TABS.find((tab) => tab.id === activeTab)?.label}
        </div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="hidden items-center gap-3 sm:flex">
        <div className="live-pill">
          <span className="status-dot" />
          Workspace synced
        </div>
        <button className="icon-button" onClick={onRefresh} title="Refresh workspace">
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  )
}

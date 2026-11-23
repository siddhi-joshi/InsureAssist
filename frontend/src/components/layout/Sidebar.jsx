import { ChevronRight, ShieldCheck } from 'lucide-react'
import { TABS } from '../../lib/constants'

export function Sidebar({ activeTab, customer, mobileOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center gap-3 px-2">
        <div className="brand-mark">
          <ShieldCheck size={17} />
        </div>
        <div>
          <div className="font-semibold tracking-tight text-white">InsureAssist</div>
          <div className="text-[10px] uppercase tracking-[.18em] text-teal-200/50">Operations hub</div>
        </div>
      </div>
      <nav className="mt-12 space-y-2">
        <div className="nav-label">Workspace</div>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`nav-item ${activeTab === id ? 'active' : ''}`}
          >
            <Icon size={17} />
            <span>{label}</span>
            {activeTab === id && <ChevronRight size={14} className="ml-auto opacity-60" />}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[.06] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[.16em] text-teal-100/50">Workspace</span>
            <span className="status-dot" />
          </div>
          <p className="text-sm font-medium text-white">{customer.name}</p>
          <p className="mt-1 text-[11px] text-teal-100/45">Local persistent records</p>
        </div>
        <p className="mt-5 px-1 text-[10px] leading-5 text-teal-100/35">
          Standalone insurance workspace
          <br />
          Records stay on this installation.
        </p>
      </div>
    </aside>
  )
}

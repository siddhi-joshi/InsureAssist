import { ChevronRight } from 'lucide-react'
import { TABS } from '../../lib/constants'
import { BrandLogo } from '../brand/BrandLogo'

export function Sidebar({ activeTab, customer, mobileOpen, onNavigate }) {
  return (
    <aside className={`sidebar ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className="flex items-center gap-3 px-2">
        <div>
          <BrandLogo />
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
        <p className="mt-5 px-1 text-[10px] leading-5 text-teal-100/35">
          Standalone insurance workspace
          <br />
          Records stay on this installation.
        </p>
      </div>
    </aside>
  )
}

import { ArrowUpRight, Plus } from 'lucide-react'

export const MetricCard = ({ icon: Icon, label, value, suffix, detail, NumberTicker, SpotlightCard }) => (
  <SpotlightCard className="metric-card p-5" glow="teal">
    <div className="metric-icon teal">
      <Icon size={18} />
    </div>
    <div className="mt-5 text-[11px] font-semibold uppercase tracking-[.14em] text-slate-400">{label}</div>
    <div className="mt-1 text-3xl font-semibold tracking-tight text-[#123b37]">
      <NumberTicker value={value} suffix={suffix} />
    </div>
    <div className="mt-1 text-xs text-slate-400">{detail}</div>
  </SpotlightCard>
)

export function SectionHeading({ icon: Icon, title, action, onClick }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="section-icon">
          <Icon size={16} />
        </div>
        <h3 className="font-semibold text-[#173f3b]">{title}</h3>
      </div>
      {action && (
        <button onClick={onClick} className="text-xs font-semibold text-teal-700 hover:text-teal-900">
          {action} <ArrowUpRight size={13} className="ml-1 inline" />
        </button>
      )}
    </div>
  )
}

export function EmptyState({ icon: Icon, text, action, onClick }) {
  return (
    <div className="empty-state">
      <Icon size={24} />
      <p>{text}</p>
      {action && (
        <button onClick={onClick}>
          {action} <Plus size={13} />
        </button>
      )}
    </div>
  )
}

export function Detail({ label, value }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[.1em] text-slate-400">{label}</p>
      <p className="mt-1.5 truncate text-sm font-semibold text-slate-700">{value}</p>
    </div>
  )
}

export function PolicyRow({ policy }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/55 p-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-100/70 text-teal-700">
        ✓
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-700">{policy.plan}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          {policy.policy_number} · {policy.type}
        </p>
      </div>
      <span className="badge green">{policy.status}</span>
    </div>
  )
}

export function ClaimRow({ claim }) {
  return (
    <div className="flex items-center gap-3 py-3.5">
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-orange-100/70 text-orange-700">
        #
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-700">{claim.claim_number}</p>
        <p className="mt-0.5 truncate text-[11px] text-slate-400">
          {claim.type || 'Insurance claim'} · {claim.amount || 'Amount pending'}
        </p>
      </div>
      <span className="badge amber">{claim.status}</span>
    </div>
  )
}
